import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function ControlsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const onDragEnd = ({ active, delta }: DragEndEvent) => {
    // console.log('drag end', event);
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => console.log('drag start', event)}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  );
}
