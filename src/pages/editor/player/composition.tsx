import useStore from "@/pages/editor/store/use-store";
import { SequenceItem } from "./sequence-item";
import { ITransition } from "@designcombo/types";
import { useEffect, useState } from "react";
import {
  EDIT_OBJECT,
  ENTER_EDIT_MODE,
  dispatch,
  filter,
  subject,
} from "@designcombo/events";
import { merge } from "lodash";
import { groupTrackItems } from "../utils/track-items";
import { TransitionSeries } from "@remotion/transitions";
import { populateTransitionIds } from "../utils/scene";
import { TransitionSequenceItem } from "./transition-sequence-item";
import { Transitions } from "./transitions";

const Composition = () => {
  const [editableTextId, setEditableTextId] = useState<string | null>(null);
  const {
    trackItemIds,
    trackItemsMap,
    fps,
    trackItemDetailsMap,
    size,
    transitionsMap,
  } = useStore();

  const mergedTrackItemsDeatilsMap = merge(trackItemsMap, trackItemDetailsMap);

  const groupedItems = groupTrackItems({
    trackItemIds,
    transitionsMap,
    trackItemsMap: mergedTrackItemsDeatilsMap,
  });

  const handleTextChange = (id: string, newContent: string) => {
    console.warn("handleTextChange", id, newContent);
  };

  //   handle track and track item events - updates
  useEffect(() => {
    const stateEvents = subject.pipe(
      filter(({ key }) => key.startsWith(ENTER_EDIT_MODE)),
    );

    const subscription = stateEvents.subscribe((obj) => {
      if (obj.key === ENTER_EDIT_MODE) {
        if (editableTextId) {
          // get element by  data-text-id={id}
          const element = document.querySelector(
            `[data-text-id="${editableTextId}"]`,
          );

          dispatch(EDIT_OBJECT, {
            payload: {
              [editableTextId]: {
                details: {
                  text: element?.textContent || "",
                },
              },
            },
          });
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
          const item = mergedTrackItemsDeatilsMap[group[0]];
          return SequenceItem[item.type](item, {
            fps,
            handleTextChange,
            editableTextId,
          });
        }
        const firstTrackItem = mergedTrackItemsDeatilsMap[group[0]];
        const from = (firstTrackItem.display.from / 1000) * fps;
        return (
          <TransitionSeries from={from} key={index}>
            {populateTransitionIds(group).map((id, index) => {
              if (index % 2 === 0) {
                const item = mergedTrackItemsDeatilsMap[id];
                const containTransition = Object.values(transitionsMap).find(
                  (t) => t.toId === id && true,
                );
                return TransitionSequenceItem[item.type](item, {
                  fps,
                  handleTextChange,
                  containTransition,
                });
              } else {
                const transition: ITransition = transitionsMap[id];
                const durationInFrames =
                  ((transition.duration / 1000) * fps) / 2;
                return Transitions[transition.kind]({
                  durationInFrames,
                  ...size,
                  id: id,
                  direction: transition.direction,
                });
              }
            })}
          </TransitionSeries>
        );
      })}
    </>
  );
};

export default Composition;
