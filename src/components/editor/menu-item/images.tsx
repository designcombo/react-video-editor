import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IMAGES } from '@/data/images';
import { ADD_IMAGE, dispatcher } from '@designcombo/core';
import { nanoid } from 'nanoid';

export const Images = () => {
  const handleAddImage = (src: string) => {
    dispatcher?.dispatch(ADD_IMAGE, {
      payload: {
        id: nanoid(),
        details: {
          src: src,
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
        Photos
      </div>
      <ScrollArea>
        <div className="px-4 masonry-sm">
          {IMAGES.map((image, index) => {
            return (
              <div
                onClick={() => handleAddImage(image.src)}
                key={index}
                className="flex items-center justify-center w-full  bg-zinc-950 pb-2 overflow-hidden cursor-pointer"
              >
                <img
                  src={image.src}
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

function modifyImageUrl(url: string): string {
  const uploadIndex = url.indexOf('/upload');
  if (uploadIndex === -1) {
    throw new Error('Invalid URL: /upload not found');
  }

  const modifiedUrl =
    url.slice(0, uploadIndex + 7) +
    '/w_0.05,c_scale' +
    url.slice(uploadIndex + 7);
  return modifiedUrl;
}
