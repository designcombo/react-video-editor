import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";
import { Input } from "@/components/ui/input";
import { dispatch } from "@designcombo/events";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { EDIT_OBJECT } from "@designcombo/state";
import useLayoutStore from "../../store/use-layout-store";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import { Switch } from "@/components/ui/switch";

interface ICaptionColors {
  appearedColor: string;
  activeColor: string;
  activeFillColor: string;
  isKeywordColor: string;
  preservedColorKeyWord: boolean;
}

interface ICaptionColorsProps extends ICaptionColors {
  id: string;
}

const CaptionColors = ({
  id,
  appearedColor,
  activeColor,
  activeFillColor,
  isKeywordColor,
  preservedColorKeyWord
}: ICaptionColorsProps) => {
  const [localAppearedColor, setLocalAppearedColor] =
    useState<string>(appearedColor);
  const [localActiveColor, setLocalActiveColor] = useState<string>(activeColor);
  const [localActiveFillColor, setLocalActiveFillColor] =
    useState<string>(activeFillColor);

  const [localEmphasizeColor, setLocalEmphasizeColor] =
    useState<string>(isKeywordColor);

  const [localPreservedColor, setLocalPreservedColor] = useState<boolean>(
    preservedColorKeyWord
  );
  const isLargeScreen = useIsLargeScreen();
  const { setControItemDrawerOpen, setTypeControlItem, setLabelControlItem } =
    useLayoutStore();

  const onChangeAppearedColor = (v: string) => {
    setLocalAppearedColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            appearedColor: v
          }
        }
      }
    });
  };

  const onChangeActiveColor = (v: string) => {
    setLocalActiveColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            activeColor: v
          }
        }
      }
    });
  };

  const onChangeActiveFillColor = (v: string) => {
    setLocalActiveFillColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            activeFillColor: v
          }
        }
      }
    });
  };
  const onChangeEmphasizeColor = (v: string) => {
    setLocalEmphasizeColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            isKeywordColor: v
          }
        }
      }
    });
  };

  const onChangePreservedColor = (v: boolean) => {
    setLocalPreservedColor(v);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            preservedColorKeyWord: v
          }
        }
      }
    });
  };

  useEffect(() => {
    setLocalAppearedColor(appearedColor);
    setLocalActiveColor(activeColor);
    setLocalActiveFillColor(activeFillColor);
    setLocalEmphasizeColor(isKeywordColor);
    setLocalPreservedColor(preservedColorKeyWord);
  }, [
    appearedColor,
    activeColor,
    activeFillColor,
    isKeywordColor,
    preservedColorKeyWord
  ]);

  const handleAppearedColorClick = () => {
    if (!isLargeScreen) {
      setControItemDrawerOpen(true);
      setTypeControlItem("appearedColor");
      setLabelControlItem("Appeared Color");
    }
  };

  const handleActiveColorClick = () => {
    if (!isLargeScreen) {
      setControItemDrawerOpen(true);
      setTypeControlItem("activeColor");
      setLabelControlItem("Active Color");
    }
  };

  const handleActiveFillColorClick = () => {
    if (!isLargeScreen) {
      setControItemDrawerOpen(true);
      setTypeControlItem("activeFillColor");
      setLabelControlItem("Active Fill Color");
    }
  };
  const handleEmphasizeColorClick = () => {
    if (!isLargeScreen) {
      setControItemDrawerOpen(true);
      setTypeControlItem("emphasizeColor");
      setLabelControlItem("Emphasize Color");
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold">Colors</Label>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Appeared
        </div>
        {isLargeScreen ? (
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div
                    style={{
                      backgroundColor: localAppearedColor
                    }}
                    className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                  />

                  <Input
                    className="pointer-events-none h-8 pl-10"
                    value={localAppearedColor}
                    onChange={() => {}}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                className="z-[300] w-[280px] p-4"
              >
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
        ) : (
          <div className="relative w-32">
            <div
              className="relative cursor-pointer"
              onClick={handleAppearedColorClick}
            >
              <div
                style={{
                  backgroundColor: localAppearedColor
                }}
                className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
              />

              <Input
                className="pointer-events-none h-8 pl-10"
                value={localAppearedColor}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Active
        </div>
        {isLargeScreen ? (
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div
                    style={{
                      backgroundColor: localActiveColor
                    }}
                    className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                  />

                  <Input
                    className="pointer-events-none h-8 pl-10"
                    value={localActiveColor}
                    onChange={() => {}}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                className="z-[300] w-[280px] p-4"
              >
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
        ) : (
          <div className="relative w-32">
            <div
              className="relative cursor-pointer"
              onClick={handleActiveColorClick}
            >
              <div
                style={{
                  backgroundColor: localActiveColor
                }}
                className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
              />

              <Input
                className="pointer-events-none h-8 pl-10"
                value={localActiveColor}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Active Fill
        </div>
        {isLargeScreen ? (
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div
                    style={{
                      backgroundColor: localActiveFillColor
                    }}
                    className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                  />

                  <Input
                    className="pointer-events-none h-8 pl-10"
                    value={localActiveFillColor}
                    onChange={() => {}}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                className="z-[300] w-[280px] p-4"
              >
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
        ) : (
          <div className="relative w-32">
            <div
              className="relative cursor-pointer"
              onClick={handleActiveFillColorClick}
            >
              <div
                style={{
                  backgroundColor: localActiveFillColor
                }}
                className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
              />

              <Input
                className="pointer-events-none h-8 pl-10"
                value={localActiveFillColor}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Emphasize
        </div>
        {isLargeScreen ? (
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div
                    style={{
                      backgroundColor: localEmphasizeColor
                    }}
                    className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                  />

                  <Input
                    className="pointer-events-none h-8 pl-10"
                    value={localEmphasizeColor}
                    onChange={() => {}}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                className="z-[300] w-[280px] p-4"
              >
                <ColorPicker
                  value={localEmphasizeColor}
                  format="hex"
                  gradient={true}
                  solid={true}
                  onChange={(v: string) => {
                    setLocalEmphasizeColor(v);
                    onChangeEmphasizeColor(v);
                  }}
                  allowAddGradientStops={true}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="relative w-32">
            <div
              className="relative cursor-pointer"
              onClick={handleEmphasizeColorClick}
            >
              <div
                style={{
                  backgroundColor: localEmphasizeColor
                }}
                className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
              />

              <Input
                className="pointer-events-none h-8 pl-10"
                value={localEmphasizeColor}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Preserved Color
        </div>
        <div className="relative w-32">
          <Switch
            checked={localPreservedColor}
            onCheckedChange={onChangePreservedColor}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptionColors;
