import { useEffect, useRef, useState } from "react";
import Header from "./header";
import Ruler from "./ruler";
import CanvasTimeline, {
  timeMsToUnits,
  unitsToTimeMs,
} from "@designcombo/timeline";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  TIMELINE_BOUNDING_CHANGED,
  TIMELINE_PREFIX,
  filter,
  subject,
} from "@designcombo/events";
import useStore from "@/pages/editor/store/use-store";
import { handleEvents } from "@designcombo/timeline";
import Playhead from "./playhead";
import { useCurrentPlayerFrame } from "@/hooks/use-current-frame";
import { Audio, Image, Text, Video, Caption, Helper, Track } from "./items";
import StateManager from "@designcombo/state";
import {
  TIMELINE_OFFSET_CANVAS_LEFT,
  TIMELINE_OFFSET_CANVAS_RIGHT,
} from "../constants/constants";

CanvasTimeline.registerItems({
  Text,
  Image,
  Audio,
  Video,
  Caption,
  Helper,
  Track,
});

const EMPTY_SIZE = { width: 0, height: 0 };
const Timeline = ({ stateManager }: { stateManager: StateManager }) => {
  const canScrollRef = useRef(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<CanvasTimeline | null>(null);
  const verticalScrollbarVpRef = useRef<HTMLDivElement>(null);
  const horizontalScrollbarVpRef = useRef<HTMLDivElement>(null);
  const { scale, playerRef, fps, duration, setState, timeline } = useStore();
  const currentFrame = useCurrentPlayerFrame(playerRef!);
  const [canvasSize, setCanvasSize] = useState(EMPTY_SIZE);
  const [size, setSize] = useState<{ width: number; height: number }>(
    EMPTY_SIZE,
  );

  const { setTimeline } = useStore();
  const onScroll = (v: { scrollTop: number; scrollLeft: number }) => {
    if (horizontalScrollbarVpRef.current && verticalScrollbarVpRef.current) {
      verticalScrollbarVpRef.current.scrollTop = -v.scrollTop;
      horizontalScrollbarVpRef.current.scrollLeft = -v.scrollLeft;
      setScrollLeft(-v.scrollLeft);
    }
  };

  useEffect(() => {
    const position = timeMsToUnits((currentFrame / fps) * 1000, scale.zoom);
    const canvasBoudingX =
      canvasElRef.current?.getBoundingClientRect().x! +
      canvasElRef.current?.clientWidth!;
    const playHeadPos = position - scrollLeft + 40;
    if (playHeadPos >= canvasBoudingX) {
      const scrollDivWidth = horizontalScrollbarVpRef.current?.clientWidth!;
      const totalScrollWidth = horizontalScrollbarVpRef.current?.scrollWidth!;
      const currentPosScroll = horizontalScrollbarVpRef.current?.scrollLeft!;
      const availableScroll =
        totalScrollWidth - (scrollDivWidth + currentPosScroll);
      const scaleScroll = availableScroll / scrollDivWidth;
      if (scaleScroll >= 0) {
        if (scaleScroll > 1)
          horizontalScrollbarVpRef.current?.scrollTo({
            left: currentPosScroll + scrollDivWidth,
          });
        else
          horizontalScrollbarVpRef.current?.scrollTo({
            left: totalScrollWidth - scrollDivWidth,
          });
      }
    }
  }, [currentFrame]);

  useEffect(() => {
    const canvasEl = canvasElRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;
    const canvas = new CanvasTimeline(canvasEl, {
      width: containerWidth,
      height: containerHeight,
      bounding: {
        width: containerWidth,
        height: 0,
      },
      selectionColor: "rgba(0, 216, 214,0.1)",
      selectionBorderColor: "rgba(0, 216, 214,1.0)",
      onScroll,
      scale: scale,
      state: stateManager,
      duration,
      spacing: {
        left: TIMELINE_OFFSET_CANVAS_LEFT,
        right: TIMELINE_OFFSET_CANVAS_RIGHT,
      },
      guideLineColor: "#ffffff",
    });

    const eventsHandler = handleEvents(canvas);

    canvasRef.current = canvas;

    setCanvasSize({ width: containerWidth, height: containerHeight });
    setSize({
      width: containerWidth,
      height: 0,
    });
    setTimeline(canvas);

    const resizeDesignSubscription = stateManager.subscribeToSize(
      (newState) => {
        setState(newState);
      },
    );
    const scaleSubscription = stateManager.subscribeToScale((newState) => {
      setState(newState);
    });

    const tracksSubscription = stateManager.subscribeToTracks((newState) => {
      setState(newState);
    });
    const durationSubscription = stateManager.subscribeToDuration(
      (newState) => {
        setState(newState);
      },
    );

    const updateTrackItemsMap = stateManager.subscribeToUpdateTrackItem(() => {
      const currentState = stateManager.getState();
      setState({
        duration: currentState.duration,
        trackItemsMap: currentState.trackItemsMap,
      });
    });

    const itemsDetailsSubscription = stateManager.subscribeToAddOrRemoveItems(
      () => {
        const currentState = stateManager.getState();
        setState({
          trackItemDetailsMap: currentState.trackItemDetailsMap,
          trackItemsMap: currentState.trackItemsMap,
          trackItemIds: currentState.trackItemIds,
          tracks: currentState.tracks,
        });
      },
    );

    const updateItemDetailsSubscription =
      stateManager.subscribeToUpdateItemDetails(() => {
        const currentState = stateManager.getState();
        setState({
          trackItemDetailsMap: currentState.trackItemDetailsMap,
        });
      });

    return () => {
      eventsHandler.unsubscribe();
      canvas.purge();
      scaleSubscription.unsubscribe();
      tracksSubscription.unsubscribe();
      durationSubscription.unsubscribe();
      itemsDetailsSubscription.unsubscribe();
      updateTrackItemsMap.unsubscribe();
      updateItemDetailsSubscription.unsubscribe();
      resizeDesignSubscription.unsubscribe();
    };
  }, []);

  const handleOnScrollH = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (canScrollRef.current) {
      const canvas = canvasRef.current!;
      canvas.scrollTo({ scrollLeft });
    }
    setScrollLeft(scrollLeft);
  };

  const handleOnScrollV = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (canScrollRef.current) {
      const canvas = canvasRef.current!;
      canvas.scrollTo({ scrollTop });
    }
  };

  useEffect(() => {
    const addEvents = subject.pipe(
      filter(({ key }) => key.startsWith(TIMELINE_PREFIX)),
    );

    const subscription = addEvents.subscribe((obj) => {
      if (obj.key === TIMELINE_BOUNDING_CHANGED) {
        const bounding = obj.value?.payload?.bounding;
        if (bounding) {
          setSize({
            width: bounding.width,
            height: bounding.height,
          });
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onClickRuler = (units: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const time = unitsToTimeMs(units, scale.zoom);
    playerRef?.current?.seekTo((time * fps) / 1000);
  };

  useEffect(() => {
    const availableScroll = horizontalScrollbarVpRef.current?.scrollWidth;
    if (!availableScroll || !timeline) return;
    const canvasWidth = timeline.width;
    if (availableScroll < canvasWidth + scrollLeft) {
      timeline.scrollTo({ scrollLeft: availableScroll - canvasWidth });
    }
  }, [scale]);

  return (
    <div className="relative h-80 w-full overflow-hidden bg-background">
      <Header />
      <Ruler onClick={onClickRuler} scrollLeft={scrollLeft} />
      <Playhead scrollLeft={scrollLeft} />
      <div className="flex">
        <div className="relative w-10 flex-none"></div>
        <div className="relative h-[230px] flex-1">
          <div ref={containerRef} className="absolute top-0 h-[230px] w-full">
            <canvas id="designcombo-timeline-canvas" ref={canvasElRef} />
          </div>
          <ScrollArea.Root
            type="always"
            style={{
              position: "absolute",
              width: "calc(100vw - 40px)",
              height: "10px",
            }}
            className="ScrollAreaRootH"
          >
            <ScrollArea.Viewport
              onScroll={handleOnScrollH}
              className="ScrollAreaViewport"
              id="viewportH"
              ref={horizontalScrollbarVpRef}
            >
              <div
                style={{
                  width:
                    size.width > canvasSize.width
                      ? size.width + TIMELINE_OFFSET_CANVAS_RIGHT
                      : size.width,
                }}
                className="pointer-events-none h-[10px]"
              ></div>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar"
              orientation="horizontal"
            >
              <ScrollArea.Thumb
                onMouseDown={() => {
                  canScrollRef.current = true;
                }}
                onMouseUp={() => {
                  canScrollRef.current = false;
                }}
                className="ScrollAreaThumb"
              />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          <ScrollArea.Root
            type="always"
            style={{
              position: "absolute",
              height: "230px",
              width: "10px",
            }}
            className="ScrollAreaRootV"
          >
            <ScrollArea.Viewport
              onScroll={handleOnScrollV}
              className="ScrollAreaViewport"
              ref={verticalScrollbarVpRef}
            >
              <div
                style={{
                  height:
                    size.height > canvasSize.height
                      ? size.height + 40
                      : canvasSize.height,
                }}
                className="pointer-events-none w-[10px]"
              ></div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar"
              orientation="vertical"
            >
              <ScrollArea.Thumb
                onMouseDown={() => {
                  canScrollRef.current = true;
                }}
                onMouseUp={() => {
                  canScrollRef.current = false;
                }}
                className="ScrollAreaThumb"
              />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
