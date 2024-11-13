import React from "react";
import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRANSITIONS } from "@/data/transitions";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";

export const Transitions = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Transitions
      </div>
      <ScrollArea>
        <div className="grid grid-cols-3 gap-2 px-4">
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
  shouldDisplayPreview,
}: {
  transition: Partial<any>;
  shouldDisplayPreview: boolean;
}) => {
  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${transition.preview})`,
      backgroundSize: "cover",
      width: "70px",
      height: "70px",
    }),
    [transition.preview],
  );

  return (
    <Draggable
      data={transition}
      renderCustomPreview={<div style={style} />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div>
        <div>
          <div style={style} draggable={false} />
        </div>
        <div className="flex h-6 items-center overflow-ellipsis text-nowrap text-[12px] capitalize text-muted-foreground">
          {transition.name || transition.type}
        </div>
      </div>
    </Draggable>
  );
};

export default TransitionsMenuItem;
