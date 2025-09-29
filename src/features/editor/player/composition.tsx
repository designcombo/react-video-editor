import { SequenceItem } from "./sequence-item";
import { useEffect, useState } from "react";
import { dispatch, filter, subject } from "@designcombo/events";
import { EDIT_OBJECT, ENTER_EDIT_MODE } from "@designcombo/state";
import { groupTrackItems } from "../utils/track-items";
import { TransitionSeries, Transitions } from "@designcombo/transitions";
import { calculateTextHeight } from "../utils/text";
import { useCurrentFrame } from "remotion";
import useStore from "../store/use-store";

const Composition = () => {
  const [editableTextId, setEditableTextId] = useState<string | null>(null);
  const {
    trackItemIds,
    trackItemsMap,
    fps,
    sceneMoveableRef,
    size,
    transitionsMap,
    structure,
    activeIds
  } = useStore();
  const frame = useCurrentFrame();

  const groupedItems = groupTrackItems({
    trackItemIds,
    transitionsMap,
    trackItemsMap: trackItemsMap
  });
  const mediaItems = Object.values(trackItemsMap).filter((item) => {
    return item.type === "video" || item.type === "audio";
  });

  const handleTextChange = (id: string, _: string) => {
    const elRef = document.querySelector(`.id-${id}`) as HTMLDivElement;
    const containerDiv = elRef.firstElementChild
      ?.firstElementChild as HTMLDivElement;
    const textDiv = elRef.firstElementChild?.firstElementChild
      ?.firstElementChild?.firstElementChild
      ?.firstElementChild as HTMLDivElement;

    const {
      fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      textShadow,
      webkitTextStroke,
      textTransform
    } = textDiv.style;
    if (!elRef.innerText) return;

    // Check if any word is wider than current container
    const words = elRef.innerText.split(/\s+/);
    const longestWord = words.reduce(
      (longest, word) => (word.length > longest.length ? word : longest),
      ""
    );

    // Create temporary element to measure longest word width
    const tempDiv = document.createElement("div");
    tempDiv.style.visibility = "hidden";
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-1000px";
    tempDiv.style.fontSize = fontSize;
    tempDiv.style.fontFamily = fontFamily;
    tempDiv.style.fontWeight = fontWeight;
    tempDiv.style.letterSpacing = letterSpacing;
    tempDiv.textContent = longestWord;
    document.body.appendChild(tempDiv);
    const wordWidth = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);

    // Expand width if word is wider than current container
    const currentWidth = elRef.clientWidth;
    if (wordWidth > currentWidth) {
      elRef.style.width = `${wordWidth}px`;
      textDiv.style.width = `${wordWidth}px`;
      containerDiv.style.width = `${wordWidth}px`;
    }

    const newHeight = calculateTextHeight({
      family: fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      text: elRef.innerText || "",
      textShadow: textShadow,
      webkitTextStroke,
      width: elRef.style.width,
      id: id,
      textTransform
    });
    const currentHeight = elRef.clientHeight;
    if (newHeight > currentHeight) {
      elRef.style.height = `${newHeight}px`;
      textDiv.style.height = `${newHeight}px`;
    }
    sceneMoveableRef?.current?.moveable.updateRect();
    sceneMoveableRef?.current?.moveable.forceUpdate();
  };

  const onTextBlur = (id: string, _: string) => {
    const elRef = document.querySelector(`.id-${id}`) as HTMLDivElement;
    const textDiv = elRef.firstElementChild?.firstElementChild
      ?.firstElementChild as HTMLDivElement;
    const {
      fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      textShadow,
      webkitTextStroke,
      textTransform
    } = textDiv.style;
    const { width } = elRef.style;
    if (!elRef.innerText) return;
    const newHeight = calculateTextHeight({
      family: fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      lineHeight,
      text: elRef.innerText || "",
      textShadow: textShadow,
      webkitTextStroke,
      width,
      id: id,
      textTransform
    });
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            height: newHeight
          }
        }
      }
    });
  };

  //   handle track and track item events - updates
  useEffect(() => {
    const stateEvents = subject.pipe(
      filter(({ key }) => key.startsWith(ENTER_EDIT_MODE))
    );

    const subscription = stateEvents.subscribe((obj) => {
      if (obj.key === ENTER_EDIT_MODE) {
        if (editableTextId) {
          // get element by  data-text-id={id}
          const element = document.querySelector(
            `[data-text-id="${editableTextId}"]`
          ) as HTMLDivElement;

          let text = "";
          if (element) {
            for (let i = 0; i < element.childNodes.length; i++) {
              const node = element.childNodes[i];
              if (node.nodeType === Node.TEXT_NODE) {
                const nodeText = node.textContent || "";
                text += nodeText;
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                const nodeText = node.textContent || "";
                text += `\n${nodeText}`;
              }
            }
          }

          if (trackItemIds.includes(editableTextId)) {
            dispatch(EDIT_OBJECT, {
              payload: {
                [editableTextId]: {
                  details: {
                    text: text || ""
                  }
                }
              }
            });
          }
        }
        setEditableTextId(obj.value?.payload.id);
      }
    });
    return () => subscription.unsubscribe();
  }, [editableTextId]);

  return (
    <>
      {groupedItems.map((group, index) => {
        if (group.length === 1) {
          const item = trackItemsMap[group[0].id];
          return SequenceItem[item.type](item, {
            fps,
            handleTextChange,
            onTextBlur,
            editableTextId,
            frame,
            size,
            isTransition: false
          });
        }
        const firstItem = trackItemsMap[group[0].id];
        const from = (firstItem.display.from / 1000) * fps;
        return (
          <TransitionSeries from={from} key={index}>
            {group.map((item) => {
              if (item.type === "transition") {
                const durationInFrames = (item.duration / 1000) * fps;
                return Transitions[item.kind]({
                  durationInFrames,
                  ...size,
                  id: item.id,
                  direction: item.direction
                });
              }
              return SequenceItem[item.type](trackItemsMap[item.id], {
                fps,
                handleTextChange,
                editableTextId,
                isTransition: true,
                size
              });
            })}
          </TransitionSeries>
        );
      })}
    </>
  );
};

export default Composition;
