import React from "react";
import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRANSITIONS } from "../data/transitions";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";

export const Transitions = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  return (
    <div className="flex flex-1 flex-col py-4 max-h-full">
      <ScrollArea className="flex-1 px-4 max-h-full">
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))] max-h-full">
          {TRANSITIONS.map((transition, index) => (
            <TransitionsMenuItem
              key={index}
              transition={transition}
              shouldDisplayPreview={!isDraggingOverTimeline}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const TransitionsMenuItem = ({
  transition,
  shouldDisplayPreview
}: {
  transition: Partial<any>;
  shouldDisplayPreview: boolean;
}) => {
  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${transition.preview})`,
      backgroundSize: "cover",
      width: "70px",
      height: "70px"
    }),
    [transition.preview]
  );

  return (
    <Draggable
      data={transition}
      renderCustomPreview={<div style={style} />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div className="w-full">
        <div className="w-full flex items-center justify-center">
          <div style={style} draggable={false} />
        </div>
        <div className="flex w-full h-6 items-center justify-center text-center overflow-hidden text-ellipsis whitespace-nowrap text-[12px] capitalize text-muted-foreground">
          {transition.name || transition.type}
        </div>
      </div>
    </Draggable>
  );
};

export default TransitionsMenuItem;
