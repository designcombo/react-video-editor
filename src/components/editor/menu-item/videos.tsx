import { ScrollArea } from '@/components/ui/scroll-area';
import { VIDEOS } from '@/data/video';
import { ADD_VIDEO, dispatcher } from '@designcombo/core';
import { nanoid } from 'nanoid';

export const Videos = () => {
  const handleAddVideo = (src: string) => {
    dispatcher?.dispatch(ADD_VIDEO, {
      payload: {
        id: nanoid(),
        details: {
          src: src,
        },
        metadata: {
          resourceId: src,
        },
      },
      options: {
        trackId: 'main',
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        Videos
      </div>
      <ScrollArea>
        <div className="px-4 masonry-sm">
          {VIDEOS.map((image, index) => {
            return (
              <div
                onClick={() => handleAddVideo(image.src)}
                key={index}
                className="flex items-center justify-center w-full  bg-zinc-950 pb-2 overflow-hidden cursor-pointer"
              >
                <img
                  src={image.preview}
                  className="w-full h-full object-cover rounded-md"
                  alt="image"
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
