import React from "react";
import useStore from "../store/use-store";

export const useResizbleTimeline = () => {
  const [isResizing, setIsResizing] = React.useState(false);
  const timelineContainerRef = React.useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = React.useState(320);
  const { timeline } = useStore();

  const onMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { y } = timelineContainerRef.current!.getBoundingClientRect();
    const cursorPosition = ev.clientY - y;
    if (cursorPosition > 15 || cursorPosition < -15) return;
    setIsResizing(true);

    const startY = ev.clientY;
    const timelineHeight = timelineContainerRef.current!.offsetHeight;
    let currentHeight = 0;

    const onMouseMove = (ev: MouseEvent) => {
      currentHeight = timelineHeight + startY - ev.clientY;

      if (currentHeight < 50 || currentHeight >= window.innerHeight * 0.5) {
        ev.preventDefault();
        return;
      }
      timelineContainerRef.current!.style.height = `${currentHeight}px`;
      timelineContainerRef.current!.style.borderTopColor = "#2B64EB";
      timelineContainerRef.current!.style.cursor = "row-resize";
      const containerHeight =
        (document.getElementById("playhead")?.clientHeight || 0) -
        (document.getElementById("playhead-handle")?.clientHeight || 0);
      timeline?.resize({
        height: containerHeight
      });
      setTimelineHeight(currentHeight);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isResizing) return;
    const { y } = timelineContainerRef.current!.getBoundingClientRect();
    const cursorPosition = ev.clientY - y;

    if (cursorPosition <= 15 && cursorPosition >= -15) {
      timelineContainerRef.current!.style.cursor = "row-resize";
      timelineContainerRef.current!.style.borderTopColor = "#2B64EB";
    } else {
      timelineContainerRef.current!.style.borderTopColor = "transparent";
      timelineContainerRef.current!.style.cursor = "default";
    }
  };

  const onMouseOut = () => {
    if (isResizing) return;
    timelineContainerRef.current!.style.borderTopColor = "transparent";
    timelineContainerRef.current!.style.cursor = "default";
  };

  React.useEffect(() => {
    if (!timelineContainerRef.current) return;

    setTimelineHeight(timelineContainerRef.current.clientHeight);
  }, [timelineContainerRef.current]);

  return {
    timelineContainerRef,
    onMouseDown,
    onMouseMove,
    onMouseOut,
    timelineHeight
  };
};
