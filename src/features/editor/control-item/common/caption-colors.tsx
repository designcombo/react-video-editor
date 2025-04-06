import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";
import { Input } from "@/components/ui/input";
import { dispatch } from "@designcombo/events";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { EDIT_OBJECT } from "@designcombo/state";
interface ICaptionColors {
  appearedColor: string;
  activeColor: string;
  activeFillColor: string;
}

interface ICaptionColorsProps extends ICaptionColors {
  id: string;
}

const CaptionColors = ({
  id,
  appearedColor,
  activeColor,
  activeFillColor,
}: ICaptionColorsProps) => {
  const [localAppearedColor, setLocalAppearedColor] =
    useState<string>(appearedColor);
  const [localActiveColor, setLocalActiveColor] = useState<string>(activeColor);
  const [localActiveFillColor, setLocalActiveFillColor] =
    useState<string>(activeFillColor);

  const onChangeAppearedColor = (v: string) => {
    setLocalAppearedColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            appearedColor: v,
          },
        },
      },
    });
  };

  const onChangeActiveColor = (v: string) => {
    setLocalActiveColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            activeColor: v,
          },
        },
      },
    });
  };

  const onChangeActiveFillColor = (v: string) => {
    console.log({
      localActiveFillColor: localActiveFillColor,
      v: v,
      id,
    });
    setLocalActiveFillColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            activeFillColor: v,
          },
        },
      },
    });
  };

  useEffect(() => {
    console.log(appearedColor, activeColor, activeFillColor);
    setLocalAppearedColor(appearedColor);
    setLocalActiveColor(activeColor);
    setLocalActiveFillColor(activeFillColor);
  }, [appearedColor, activeColor, activeFillColor]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-primary">
        Colors
      </Label>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Appeared
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <div
                  style={{
                    backgroundColor: localAppearedColor,
                  }}
                  className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                ></div>

                <Input
                  variant="secondary"
                  className="pointer-events-none h-8 pl-10"
                  value={localAppearedColor}
                  onChange={() => {}}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent className="z-[300] w-full p-0">
              <ColorPicker
                value={localAppearedColor}
                format="hex"
                gradient={true}
                solid={true}
                onChange={(v: string) => {
                  setLocalAppearedColor(v);
                  onChangeAppearedColor(v);
                }}
                allowAddGradientStops={true}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Active
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <div
                  style={{
                    backgroundColor: localActiveColor,
                  }}
                  className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                ></div>

                <Input
                  variant="secondary"
                  className="pointer-events-none h-8 pl-10"
                  value={localActiveColor}
                  onChange={() => {}}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent className="z-[300] w-full p-0">
              <ColorPicker
                value={localActiveColor}
                format="hex"
                gradient={true}
                solid={true}
                onChange={(v: string) => {
                  setLocalActiveColor(v);
                  onChangeActiveColor(v);
                }}
                allowAddGradientStops={true}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Active Fill
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <div
                  style={{
                    backgroundColor: localActiveFillColor,
                  }}
                  className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                ></div>

                <Input
                  variant="secondary"
                  className="pointer-events-none h-8 pl-10"
                  value={localActiveFillColor}
                  onChange={() => {}}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent className="z-[300] w-full p-0">
              <ColorPicker
                value={localActiveFillColor}
                format="hex"
                gradient={true}
                solid={true}
                onChange={(v: string) => {
                  setLocalActiveFillColor(v);
                  onChangeActiveFillColor(v);
                }}
                allowAddGradientStops={true}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default CaptionColors;
