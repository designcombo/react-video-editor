import { ScrollArea } from "@/components/ui/scroll-area";
import { IBoxShadow, ITrackItem, IVideo } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import Opacity from "./common/opacity";
import Rounded from "./common/radius";
import AspectRatio from "./common/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Crop } from "lucide-react";
import Volume from "./common/volume";
import { useEffect, useState } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import Speed from "./common/speed";
import useLayoutStore from "../store/use-layout-store";
import { Label } from "@/components/ui/label";

const BasicVideo = ({ trackItem }: { trackItem: ITrackItem & IVideo }) => {
  const [properties, setProperties] = useState(trackItem);
  const { setCropTarget } = useLayoutStore();
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

  const onChangeBorderWidth = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderWidth: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          borderWidth: v,
        },
      };
    });
  };

  const onChangeBorderColor = (v: string) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderColor: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          borderColor: v,
        },
      };
    });
  };

  const handleChangeOpacity = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            opacity: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          opacity: v,
        },
      };
    });
  };

  const onChangeBorderRadius = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderRadius: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          borderRadius: v,
        },
      };
    });
  };

  const onChangeBoxShadow = (boxShadow: IBoxShadow) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            boxShadow: boxShadow,
          },
        },
      },
    });

    setProperties((prev) => {
      return {
        ...prev,
        details: {
          ...prev.details,
          boxShadow,
        },
      };
    });
  };
  useEffect(() => {
    setProperties(trackItem);
  }, [trackItem]);

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

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Video
      </div>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 px-4">
          <div className="mb-4 mt-2">
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => {
                setCropTarget(trackItem);
              }}
            >
              <Crop size={18} />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-sans text-xs font-semibold text-primary">
              Basic
            </Label>
            <AspectRatio />
            <Volume
              onChange={(v: number) => handleChangeVolume(v)}
              value={properties.details.volume!}
            />
            <Opacity
              onChange={(v: number) => handleChangeOpacity(v)}
              value={properties.details.opacity!}
            />
            <Speed
              value={properties.playbackRate!}
              onChange={handleChangeSpeed}
            />
            <Rounded
              onChange={(v: number) => onChangeBorderRadius(v)}
              value={properties.details.borderRadius as number}
            />
          </div>
          <Outline
            onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
            onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
            valueBorderWidth={properties.details.borderWidth as number}
            valueBorderColor={properties.details.borderColor as string}
            label="Outline"
          />
          <Shadow
            onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
            value={properties.details.boxShadow!}
            label="Shadow"
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default BasicVideo;
