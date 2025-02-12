import { ScrollArea } from "@/components/ui/scroll-area";
import { IAudio, ITrackItem } from "@designcombo/types";
import Volume from "./common/volume";
import Speed from "./common/speed";
import { useState } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT, LAYER_REPLACE } from "@designcombo/state";
import { Button } from "@/components/ui/button";

const BasicAudio = ({ trackItem }: { trackItem: ITrackItem & IAudio }) => {
  const [properties, setProperties] = useState(trackItem);

  const handleChangeVolume = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            volume: v,
          },
        },
      },
    });

    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          volume: v,
        },
      };
    });
  };

  const handleChangeSpeed = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          playbackRate: v,
        },
      },
    });

    setProperties((prev) => {
      return {
        ...prev,
        playbackRate: v,
      };
    });
  };

  const handleReplace = () => {
    dispatch(LAYER_REPLACE, {
      payload: {
        [trackItem.id]: {
          details: {
            src: "https://ik.imagekit.io/pablituuu/like_a_player.mp3?updatedAt=1722278521488",
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Audio
      </div>
      <ScrollArea className="h-full">
        <Button onClick={handleReplace} variant={"secondary"} size={"lg"}>
          Replace
        </Button>
        <div className="flex flex-col gap-2 px-4">
          <Volume
            onChange={(v: number) => handleChangeVolume(v)}
            value={properties.details.volume!}
          />
          <Speed
            value={properties.playbackRate!}
            onChange={handleChangeSpeed}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default BasicAudio;
