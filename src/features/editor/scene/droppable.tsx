import { dispatch } from "@designcombo/events";
import { ADD_AUDIO, ADD_IMAGE, ADD_VIDEO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import React, { useCallback, useState } from "react";

enum AcceptedDropTypes {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
}

interface DraggedData {
  type: AcceptedDropTypes;
  [key: string]: any;
}

interface DroppableAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onDragStateChange?: (isDragging: boolean) => void;
  id?: string;
}

const useDragAndDrop = (onDragStateChange?: (isDragging: boolean) => void) => {
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = useCallback((draggedData: DraggedData) => {
    const payload = { ...draggedData, id: generateId() };
    switch (draggedData.type) {
      case AcceptedDropTypes.IMAGE:
        dispatch(ADD_IMAGE, { payload });
        break;
      case AcceptedDropTypes.VIDEO:
        dispatch(ADD_VIDEO, { payload });
        break;
      case AcceptedDropTypes.AUDIO:
        dispatch(ADD_AUDIO, { payload });
        break;
    }
  }, []);

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      try {
        const draggedDataString = e.dataTransfer?.types[0] as string;
        if (!draggedDataString) return;
        const draggedData: DraggedData = JSON.parse(draggedDataString);

        if (!Object.values(AcceptedDropTypes).includes(draggedData.type))
          return;
        setIsDraggingOver(true);
        setIsPointerInside(true);
        onDragStateChange?.(true);
      } catch (error) {
        console.error("Error parsing dragged data:", error);
      }
    },
    [onDragStateChange],
  );

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isPointerInside) {
        setIsDraggingOver(true);
        onDragStateChange?.(true);
      }
    },
    [isPointerInside, onDragStateChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!isDraggingOver) return;
      e.preventDefault();
      setIsDraggingOver(false);
      onDragStateChange?.(false);

      try {
        const draggedDataString = e.dataTransfer?.types[0] as string;
        const draggedData = JSON.parse(
          e.dataTransfer!.getData(draggedDataString),
        );
        handleDrop(draggedData);
      } catch (error) {
        console.error("Error parsing dropped data:", error);
      }
    },
    [isDraggingOver, onDragStateChange, handleDrop],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
        setIsPointerInside(false);
        onDragStateChange?.(false);
      }
    },
    [onDragStateChange],
  );

  return { onDragEnter, onDragOver, onDrop, onDragLeave, isDraggingOver };
};

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  children,
  className,
  style,
  onDragStateChange,
  id,
}) => {
  const { onDragEnter, onDragOver, onDrop, onDragLeave } =
    useDragAndDrop(onDragStateChange);

  return (
    <div
      id={id}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={className}
      style={style}
      role="region"
      aria-label="Droppable area for images, videos, and audio"
    >
      {children}
    </div>
  );
};
