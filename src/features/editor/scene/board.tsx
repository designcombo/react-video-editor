import { useState } from "react";
import { DroppableArea } from "./droppable";

const SceneBoard = ({
  size,
  children,
}: {
  size: { width: number; height: number };
  children: React.ReactNode;
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <DroppableArea
      id="artboard"
      onDragStateChange={setIsDraggingOver}
      style={{
        width: size.width,
        height: size.height,
      }}
      className="pointer-events-auto"
    >
      <div
        style={{
          width: size.width,
          height: size.height,
        }}
        className={`pointer-events-none absolute z-50 border border-white/15 transition-colors duration-200 ease-in-out ${isDraggingOver ? "border-4 border-dashed border-white bg-white/[0.075]" : "bg-transparent"} shadow-[0_0_0_5000px_#121213]`}
      />
      {children}
    </DroppableArea>
  );
};

export default SceneBoard;
