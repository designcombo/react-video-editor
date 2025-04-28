import Draggable from '@/components/shared/draggable';
import { Button, buttonVariants } from '@/components/ui/button';
import { DEFAULT_FONT } from '@/features/editor/constants/font';
import { cn } from '@/lib/utils';
import { dispatch } from '@designcombo/events';
import { ADD_TEXT } from '@designcombo/state';
import { generateId } from '@designcombo/timeline';
import { useIsDraggingOverTimeline } from '../hooks/is-dragging-over-timeline';

export const getAddTextPayload = () => ({
  id: generateId(),
  display: {
    from: 0,
    to: 5000,
  },
  type: 'text',
  details: {
    text: 'Heading and some body',
    fontSize: 120,
    width: 600,
    fontUrl: DEFAULT_FONT.url,
    fontFamily: DEFAULT_FONT.postScriptName,
    color: '#ffffff',
    wordWrap: 'break-word',
    textAlign: 'center',
    borderWidth: 0,
    borderColor: '#000000',
    boxShadow: {
      color: '#ffffff',
      x: 0,
      y: 0,
      blur: 0,
    },
  },
});

export const Texts = () => {
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  const handleAddText = () => {
    dispatch(ADD_TEXT, {
      payload: getAddTextPayload(),
      options: {},
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-12 flex-none items-center px-4 font-medium text-sm text-text-primary">
        Text
      </div>
      <div className="flex flex-col gap-2 px-4">
        <Draggable
          data={getAddTextPayload}
          renderCustomPreview={
            <Button variant="secondary" className="w-60">
              Add text
            </Button>
          }
          shouldDisplayPreview={!isDraggingOverTimeline}
        >
          <div
            onClick={handleAddText}
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            Add text
          </div>
        </Draggable>
      </div>
    </div>
  );
};
