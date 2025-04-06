import { PlayerRef } from "@remotion/player";
import { RefObject, useEffect } from "react";
import useStore from "../store/use-store";
import { dispatch } from "@designcombo/events";
import { ENTER_EDIT_MODE } from "@designcombo/state";
import { getTargetById, getTypeFromClassName } from "../utils/target";

export default function useUpdateAnsestors({
  playing,
  playerRef,
}: {
  playing: boolean;
  playerRef: RefObject<PlayerRef> | null;
}) {
  const { trackItemIds, activeIds } = useStore();

  useEffect(() => {
    if (!playing) {
      updateAnsestorsPointerEvents();
    }
  }, [playing, trackItemIds, activeIds]);

  useEffect(() => {
    if (playerRef && playerRef.current) {
      playerRef.current.addEventListener(
        "seeked",
        updateAnsestorsPointerEvents,
      );
    }
    return () => {
      if (playerRef && playerRef.current) {
        playerRef.current.removeEventListener(
          "seeked",
          updateAnsestorsPointerEvents,
        );
      }
    };
  }, [playerRef]);

  useEffect(() => {
    if (activeIds.length !== 1) {
      dispatch(ENTER_EDIT_MODE, {
        payload: {
          id: null,
        },
      });
      return;
    }
    const element = getTargetById(activeIds[0]);
    if (!element) return;
    const handleDoubleClick = (e: MouseEvent) => {
      const type = getTypeFromClassName(element.className);
      if (type === "text") {
        dispatch(ENTER_EDIT_MODE, {
          payload: {
            id: activeIds[0],
          },
        });
        e.stopPropagation();
      }
    };
    element.addEventListener("dblclick", handleDoubleClick);
    return () => {
      element.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [activeIds]);

  const updateAnsestorsPointerEvents = () => {
    const elements = document.querySelectorAll(
      '[data-track-item="transition-element"]',
    );

    elements.forEach((element) => {
      let currentElement = element;
      // Traverse up the DOM tree and collect the ancestors
      while (currentElement.parentElement?.className !== "__remotion-player") {
        const parentElement = currentElement.parentElement;
        if (parentElement) {
          currentElement = parentElement;
          parentElement.style.pointerEvents = "none";
          // if (parentElement.parentElement?.className !== "__remotion-player") {
          //   console.log("parentElement", parentElement);
          // }
        }
      }
    });
  };
}
