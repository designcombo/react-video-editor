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
      className="designcombo_scene pointer-events-auto mt-3.5 bg-black"
    >
      <div
        style={{
          width: size.width,
          height: size.height,
        }}
        className={`pointer-events-none absolute z-50 mt-3.5 transition-colors duration-200 ease-in-out ${isDraggingOver ? "border-4 border-dashed border-white bg-white/[0.075]" : "bg-transparent"} shadow-[0_0_0_5000px_#1D1D1F]`}
      />
      {children}
    </DroppableArea>
  );
};

export default SceneBoard;
