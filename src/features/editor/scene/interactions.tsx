import { useEffect, useRef, useState } from "react";
import Selection from "@interactify/selection";
import Moveable from "@interactify/moveable";
import { getIdFromClassName } from "../utils/scene";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import {
  SelectionInfo,
  emptySelection,
  getSelectionByIds,
  getTargetById,
} from "../utils/target";
import useStore from "../store/use-store";
import StateManager from "@designcombo/state";
import { getCurrentTime } from "../utils/time";

let holdGroupPosition: Record<string, any> | null = null;
let dragStartEnd = false;

interface SceneInteractionsProps {
  stateManager: StateManager;
  viewerRef: React.RefObject<any>;
  containerRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  size: { width: number; height: number };
}
export function SceneInteractions({
  stateManager,
  viewerRef,
  zoom,
}: SceneInteractionsProps) {
  const [targets, setTargets] = useState<HTMLDivElement[]>([]);
  const [selection, setSelection] = useState<Selection>();
  const {
    activeIds,
    setState,
    trackItemDetailsMap,
    trackItemsMap,
    playerRef,
    setSceneMoveableRef,
  } = useStore();
  const moveableRef = useRef<Moveable>(null);
  const [selectionInfo, setSelectionInfo] =
    useState<SelectionInfo>(emptySelection);

  useEffect(() => {
    const updateTargets = (time?: number) => {
      const currentTime = time || getCurrentTime();
      const { trackItemsMap } = useStore.getState();
      const targetIds = activeIds.filter((id) => {
        return (
          trackItemsMap[id]?.display.from <= currentTime &&
          trackItemsMap[id]?.display.to >= currentTime
        );
      });
      const targets = targetIds.map(
        (id) => getTargetById(id) as HTMLDivElement,
      );
      selection?.setSelectedTargets(targets);
      const selInfo = getSelectionByIds(targetIds);

      setSelectionInfo(selInfo);
      setTargets(selInfo.targets as HTMLDivElement[]);
    };
    const timer = setTimeout(() => {
      updateTargets();
    });

    const onSeeked = (v: any) => {
      setTimeout(() => {
        const { fps } = useStore.getState();
        const seekedTime = (v.detail.frame / fps) * 1000;
        updateTargets(seekedTime);
      });
    };
    playerRef?.current?.addEventListener("seeked", onSeeked);

    return () => {
      playerRef?.current?.removeEventListener("seeked", onSeeked);
      clearTimeout(timer);
    };
  }, [activeIds, playerRef, trackItemsMap]);

  useEffect(() => {
    const selection = new Selection({
      container: viewerRef.current?.infiniteViewer.getContainer(),
      boundContainer: true,
      hitRate: 0,
      selectableTargets: [".designcombo-scene-item"],
      selectFromInside: false,
      selectByClick: true,
      toggleContinueSelect: "shift",
    })
      .on("select", (e) => {
        const ids = e.selected.map((el) => getIdFromClassName(el.className));
        setTargets(e.selected as HTMLDivElement[]);

        stateManager.updateState(
          {
            activeIds: ids,
          },
          {
            updateHistory: false,
            kind: "layer:selection",
          },
        );
      })
      .on("dragStart", (e) => {
        const target = e.inputEvent.target as HTMLDivElement;
        dragStartEnd = false;

        if (targets.includes(target)) {
          e.stop();
        }
        if (
          target &&
          moveableRef?.current?.moveable.isMoveableElement(target)
        ) {
          e.stop();
        }
      })
      .on("dragEnd", () => {
        dragStartEnd = true;
      })
      .on("selectEnd", (e) => {
        const moveable = moveableRef.current;
        if (e.isDragStart) {
          e.inputEvent.preventDefault();
          setTimeout(() => {
            if (!dragStartEnd) {
              moveable?.moveable.dragStart(e.inputEvent);
            }
          });
        } else {
          const targets = e.selected as HTMLDivElement[];
          const ids = targets.map((el) => getIdFromClassName(el.className));

          stateManager.updateState(
            {
              activeIds: ids,
            },
            {
              updateHistory: false,
              kind: "layer:selection",
            },
          );
          setTargets(targets);
        }
      });
    setSelection(selection);
    return () => {
      selection.destroy();
    };
  }, []);

  useEffect(() => {
    const activeSelectionSubscription = stateManager.subscribeToActiveIds(
      (newState) => {
        setState(newState);
      },
    );

    return () => {
      activeSelectionSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    moveableRef.current!.moveable.updateRect();
  }, [trackItemsMap]);

  useEffect(() => {
    setSceneMoveableRef(moveableRef);
  }, [moveableRef]);
  return (
    <Moveable
      ref={moveableRef}
      rotationPosition={"bottom"}
      renderDirections={selectionInfo.controls}
      {...selectionInfo.ables}
      origin={false}
      target={targets}
      zoom={1 / zoom}
      className="designcombo-scene-moveable"
      onDrag={({ target, top, left }) => {
        target.style.top = top + "px";
        target.style.left = left + "px";
      }}
      onDragEnd={({ target, isDrag }) => {
        if (!isDrag) return;
        const targetId = getIdFromClassName(target.className) as string;

        dispatch(EDIT_OBJECT, {
          payload: {
            [targetId]: {
              details: {
                left: target.style.left,
                top: target.style.top,
              },
            },
          },
        });
      }}
      onScale={({ target, transform, direction }) => {
        const [xControl, yControl] = direction;

        const moveX = xControl === -1;
        const moveY = yControl === -1;

        const scaleRegex = /scale\(([^)]+)\)/;
        const match = target.style.transform.match(scaleRegex)!;

        //get current scale
        const [scaleX, scaleY] = match[1]
          .split(",")
          .map((value) => parseFloat(value.trim()));

        //get new Scale
        const match2 = transform.match(scaleRegex)!;
        const [newScaleX, newScaleY] = match2[1]
          .split(",")
          .map((value) => parseFloat(value.trim()));

        const currentWidth = target.clientWidth * scaleX;
        const currentHeight = target.clientHeight * scaleY;

        const newWidth = target.clientWidth * newScaleX;
        const newHeight = target.clientHeight * newScaleY;

        target.style.transform = transform;

        //Move element to initial Left position
        const diffX = currentWidth - newWidth;
        let newLeft = parseFloat(target.style.left) - diffX / 2;

        const diffY = currentHeight - newHeight;
        let newTop = parseFloat(target.style.top) - diffY / 2;

        if (moveX) {
          newLeft += diffX;
        }
        if (moveY) {
          newTop += diffY;
        }
        target.style.left = newLeft + "px";
        target.style.top = newTop + "px";
      }}
      onScaleEnd={({ target }) => {
        if (!target.style.transform) return;
        const targetId = getIdFromClassName(target.className) as string;

        dispatch(EDIT_OBJECT, {
          payload: {
            [targetId]: {
              details: {
                transform: target.style.transform,
                left: parseFloat(target.style.left),
                top: parseFloat(target.style.top),
              },
            },
          },
        });
      }}
      onRotate={({ target, transform }) => {
        target.style.transform = transform;
      }}
      onRotateEnd={({ target }) => {
        if (!target.style.transform) return;
        const targetId = getIdFromClassName(target.className) as string;
        dispatch(EDIT_OBJECT, {
          payload: {
            [targetId]: {
              details: {
                transform: target.style.transform,
              },
            },
          },
        });
      }}
      onDragGroup={({ events }) => {
        holdGroupPosition = {};
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          const id = getIdFromClassName(event.target.className);
          const trackItem = trackItemDetailsMap[id];
          const left =
            parseFloat(trackItem?.details.left as string) +
            event.beforeTranslate[0];
          const top =
            parseFloat(trackItem?.details.top as string) +
            event.beforeTranslate[1];
          event.target.style.left = `${left}px`;
          event.target.style.top = `${top}px`;
          holdGroupPosition[id] = {
            left: left,
            top: top,
          };
        }
      }}
      onResize={({
        target,
        width: nextWidth,
        height: nextHeight,
        direction,
      }) => {
        if (direction[1] === 1) {
          const currentWidth = target.clientWidth;
          const currentHeight = target.clientHeight;

          // Get new width and height
          const scaleY = nextHeight / currentHeight;
          const scale = scaleY;

          // Update target dimensions
          target.style.width = `${currentWidth * scale}px`;
          target.style.height = `${currentHeight * scale}px`;

          // Safely access nested elements
          const animationDiv = target.firstElementChild
            ?.firstElementChild as HTMLDivElement | null;
          if (animationDiv) {
            animationDiv.style.width = `${currentWidth * scale}px`;
            animationDiv.style.height = `${currentHeight * scale}px`;

            const textDiv =
              animationDiv.firstElementChild as HTMLDivElement | null;
            if (textDiv) {
              const fontSize = parseFloat(getComputedStyle(textDiv).fontSize);
              textDiv.style.fontSize = `${fontSize * scale}px`;
              textDiv.style.width = `${currentWidth * scale}px`;
              textDiv.style.height = `${currentHeight * scale}px`;
            }
          }
        } else {
          target.style.width = nextWidth + "px";
          target.style.height = nextHeight + "px";

          // Safely access nested elements
          const animationDiv = target.firstElementChild
            ?.firstElementChild as HTMLDivElement | null;
          if (animationDiv) {
            animationDiv.style.width = `${nextWidth}px`;
            animationDiv.style.height = `${nextHeight}px`;

            const textDiv =
              animationDiv.firstElementChild as HTMLDivElement | null;
            if (textDiv) {
              textDiv.style.width = `${nextWidth}px`;
              textDiv.style.height = `${nextHeight}px`;
            }
          }
        }
      }}
      onResizeEnd={({ target }) => {
        const targetId = getIdFromClassName(target.className) as string;
        const textDiv = target.firstElementChild?.firstElementChild
          ?.firstElementChild as HTMLDivElement;
        dispatch(EDIT_OBJECT, {
          payload: {
            [targetId]: {
              details: {
                width: parseFloat(target.style.width),
                height: parseFloat(target.style.height),
                fontSize: parseFloat(textDiv.style.fontSize),
              },
            },
          },
        });
      }}
      onDragGroupEnd={() => {
        if (holdGroupPosition) {
          const payload: Record<string, Partial<any>> = {};
          Object.keys(holdGroupPosition).forEach((id) => {
            const left = holdGroupPosition![id].left;
            const top = holdGroupPosition![id].top;
            payload[id] = {
              details: {
                top: `${top}px`,
                left: `${left}px`,
              },
            };
          });
          dispatch(EDIT_OBJECT, {
            payload: payload,
          });
          holdGroupPosition = null;
        }
      }}
    />
  );
}
