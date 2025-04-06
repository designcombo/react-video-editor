import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { ADD_ANIMATION } from "@designcombo/state";
import { X } from "lucide-react";
import React, { useRef } from "react";
import { Animation, presets } from "../../player/animated";
import useLayoutStore from "../../store/use-layout-store";
import useClickOutside from "../../hooks/useClickOutside";
import Draggable from "react-draggable";
import { PresetName } from "../../player/animated/presets";

const AnimationCaption = () => {
  const { setFloatingControl, trackItem } = useLayoutStore();

  const applyAnimation = (presetName: PresetName, type: "in" | "out") => {
    if (!trackItem!.id) {
      console.warn("No active ID to apply the animation to.");
      return;
    }
    const presetAnimation = presets[presetName];
    const composition: Animation[] = [presetAnimation];

    dispatch(ADD_ANIMATION, {
      payload: {
        id: trackItem!.id,
        animations: {
          [type]: {
            name: presetName,
            composition,
          },
        },
      },
    });
  };
  const createPresetButtons = (
    filter: (key: string) => boolean,
    type: "in" | "out",
  ) =>
    Object.keys(presets)
      .filter(filter)
      .map((presetKey) => {
        const preset = presets[presetKey as "scaleIn"];
        const style = React.useMemo(
          () => ({
            backgroundImage: `url(${preset.previewUrl})`,
            backgroundSize: "cover",
            width: "50px",
            height: "50px",
            borderRadius: "8px",
          }),
          [preset.previewUrl],
        );
        if (
          preset.property?.toLowerCase().includes("text") ||
          preset.property?.toLowerCase().includes("shake")
        )
          return;

        return (
          <div
            key={presetKey}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground"
            onClick={() => applyAnimation(presetKey as PresetName, type)}
          >
            <div style={style} draggable={false} />
            <div>{preset.name}</div>
          </div>
        );
      });

  const presetInButtons = createPresetButtons(
    (key) => key.includes("In"),
    "in",
  );
  const floatingRef = useRef(null);

  useClickOutside(floatingRef, () => setFloatingControl(""));
  return (
    <Draggable handle=".handle">
      <div
        className="bg-sidebar absolute right-2 top-2 z-[200] h-[calc(100%-80px)] w-56 border p-0"
        ref={floatingRef}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="handle flex cursor-grab justify-between">
            <p>Animations</p>
            <div className="h-4 w-4" onClick={() => setFloatingControl("")}>
              <X className="h-3 w-3 cursor-pointer font-extrabold text-muted-foreground" />
            </div>
          </div>
          <div className="h-full overflow-hidden">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-3 gap-2 py-4">
                {[...Array(4)].flatMap(() => presetInButtons)}
              </div>{" "}
            </ScrollArea>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default AnimationCaption;
