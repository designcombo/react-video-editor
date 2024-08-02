import {
  DRAG_END,
  DRAG_PREFIX,
  DRAG_START,
  ITransition,
  TRANSITIONS,
  dispatcher,
  filter,
} from '@designcombo/core';
import React, { useEffect, useState } from 'react';
import Draggable from '@/components/shared/draggable';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Transitions = () => {
  const [shouldDisplayPreview, setShouldDisplayPreview] = useState(true);
  //   handle track and track item events - updates
  useEffect(() => {
    const dragEvents = dispatcher.bus.pipe(
      filter(({ key }) => key.startsWith(DRAG_PREFIX)),
    );

    const dragEventsSubscription = dragEvents.subscribe((obj) => {
      if (obj.key === DRAG_START) {
        setShouldDisplayPreview(false);
      } else if (obj.key === DRAG_END) {
        setShouldDisplayPreview(true);
      }
    });
    return () => dragEventsSubscription.unsubscribe();
  }, []);
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        Transitions
      </div>
      <ScrollArea>
        <div className="grid grid-cols-3 gap-2 px-4">
          {TRANSITIONS.map((transition, index) => (
            <TransitionsMenuItem
              key={index}
              transition={transition}
              shouldDisplayPreview={shouldDisplayPreview}
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
  transition: Partial<ITransition>;
  shouldDisplayPreview: boolean;
}) => {
  const style = React.useMemo(
    () => ({
      backgroundImage: `url(${transition.preview})`,
      backgroundSize: 'cover',
      width: '70px',
      height: '70px',
    }),
    [transition.preview],
  );

  return (
    <Draggable
      data={transition}
      renderCustomPreview={<div style={style} className="draggable" />}
      shouldDisplayPreview={shouldDisplayPreview}
    >
      <div>
        <div>
          <div
            //  ref={divRef}
            style={style}
            className="draggable"
          />
        </div>
        <div className="text-muted-foreground text-[12px] text-nowrap overflow-ellipsis h-6 flex items-center capitalize">
          {transition.name || transition.type}
        </div>
      </div>
    </Draggable>
  );
};

export default TransitionsMenuItem;
