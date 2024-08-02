import type { Active, ClientRect, Over } from '@dnd-kit/core';
import { Transform, getEventCoordinates } from '@dnd-kit/utilities';

type Modifier = (args: {
  activatorEvent: Event | null;
  active: Active | null;
  activeNodeRect: ClientRect | null;
  draggingNodeRect: ClientRect | null;
  containerNodeRect: ClientRect | null;
  over: Over | null;
  overlayNodeRect: ClientRect | null;
  scrollableAncestors: Element[];
  scrollableAncestorRects: ClientRect[];
  transform: Transform;
  windowRect: ClientRect | null;
  draggingOverType?: string;
}) => Transform;

export const snapLeftToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
  ...props
}) => {
  if (draggingNodeRect && activatorEvent && props.draggingOverType) {
    const activatorCoordinates = getEventCoordinates(activatorEvent);

    if (!activatorCoordinates) {
      return transform;
    }

    const offsetX = activatorCoordinates.x - draggingNodeRect.left;
    const offsetY = activatorCoordinates.y - draggingNodeRect.top;

    return {
      ...transform,
      x: transform.x + offsetX,
      y: transform.y + offsetY - draggingNodeRect.height / 2,
    };
  }

  return transform;
};
