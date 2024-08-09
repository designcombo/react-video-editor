import { useEditorState } from '@designcombo/core';
import React, { useState, cloneElement, ReactElement, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DraggableProps {
  children: ReactElement;
  shouldDisplayPreview?: boolean;
  renderCustomPreview?: ReactElement;
  data?: Record<string, any>;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  renderCustomPreview,
  data = {},
  shouldDisplayPreview = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    setIsDragging(true);
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Hides default preview
    // set drag data
    e.dataTransfer.setData('transition', JSON.stringify(data));
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.DragEvent<HTMLElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const childWithProps = cloneElement(children, {
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDrag: handleDrag,
    style: {
      ...children.props.style,
      cursor: 'grab',
    },
  });

  return (
    <>
      {childWithProps}
      {isDragging && shouldDisplayPreview && renderCustomPreview
        ? createPortal(
            <div
              ref={previewRef}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)', // Center the preview
              }}
            >
              {renderCustomPreview}
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default Draggable;
