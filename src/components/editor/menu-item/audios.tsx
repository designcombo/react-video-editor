import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AUDIOS } from '@/data/audio';
import { ADD_AUDIO, dispatcher } from '@designcombo/core';
import { Music } from 'lucide-react';
import { nanoid } from 'nanoid';

export const Audios = () => {
  const handleAddAudio = (src: string) => {
    dispatcher?.dispatch(ADD_AUDIO, {
      payload: {
        id: nanoid(),
        details: {
          src: 'https://ik.imagekit.io/snapmotion/timer-voice.mp3',
        },
      },
      options: {},
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        Audios
      </div>
      <ScrollArea>
        <div className="px-2 flex flex-col">
          {AUDIOS.map((audio, index) => {
            return (
              <AudioItem
                handleAddAudio={handleAddAudio}
                audio={audio}
                key={index}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

const AudioItem = ({
  audio,
  handleAddAudio,
}: {
  audio: any;
  handleAddAudio: (src: string) => void;
}) => {
  return (
    <div
      onClick={() => handleAddAudio(audio.src)}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr',
      }}
      className="flex px-2 py-1 gap-4 text-sm hover:bg-zinc-800/70 cursor-pointer"
    >
      <div className="bg-zinc-800 flex items-center justify-center h-12">
        <Music width={16} />
      </div>
      <div className="flex  flex-col justify-center">
        <div>{audio.name}</div>
        <div className="text-zinc-400">{audio.author}</div>
      </div>
    </div>
  );
};
