import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADD_ANIMATION } from "@designcombo/state";
import { dispatch } from "@designcombo/events";
import useStore from "../../store/use-store";
import { Animation, presets } from "../../player/animated";
import React, { useRef } from "react";
import Draggable from "react-draggable";
import useLayoutStore from "../../store/use-layout-store";
import useClickOutside from "../../hooks/useClickOutside";
import { Easing } from "remotion";
import { PresetName } from "../../player/animated/presets";
const animationType = "media";

export default function AnimationPicker() {
  const { activeIds, trackItemDetailsMap } = useStore();

  const applyAnimation = (presetName: PresetName, type: "in" | "out") => {
    if (!activeIds.length) {
      console.warn("No active ID to apply the animation to.");
      return;
    }
    const presetAnimation: any = presets[presetName];
    const composition: Animation[] = [presetAnimation];
    if (presetName.includes("rotate") && presetName.includes("In"))
      composition.push(presets.scaleIn);
    else if (presetName.includes("shake") && presetName.includes("In")) {
      const shakeMovX = trackItemDetailsMap[activeIds[0]].details.width / 6;
      const shakeMovY = trackItemDetailsMap[activeIds[0]].details.height / 6;
      composition[0].from = presetName.includes("Horizontal")
        ? shakeMovX
        : shakeMovY;
      composition[0].to = presetName.includes("Horizontal")
        ? -shakeMovX
        : -shakeMovY;
      composition.push({
        property: "scale",
        from: 2,
        to: 1,
        durationInFrames: 30,
        ease: Easing.ease,
        previewUrl: "https://cdn.designcombo.dev/animations/ScaleIn.webp",
        name: "Scale",
      });
    } else if (presetName.includes("shake") && presetName.includes("Out")) {
      const shakeMovX = trackItemDetailsMap[activeIds[0]].details.width / 6;
      const shakeMovY = trackItemDetailsMap[activeIds[0]].details.height / 6;
      composition[0].from = presetName.includes("Horizontal")
        ? -shakeMovX
        : -shakeMovY;
      composition[0].to = presetName.includes("Horizontal")
        ? shakeMovX
        : shakeMovY;
      composition.push({
        property: "scale",
        from: 1,
        to: 2,
        durationInFrames: 30,
        ease: Easing.ease,
        previewUrl: "https://cdn.designcombo.dev/animations/ScaleOut.webp",
        name: "Scale",
      });
    }
    dispatch(ADD_ANIMATION, {
      payload: {
        id: activeIds[0],
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
            width: "60px",
            height: "60px",
            borderRadius: "8px",
          }),
          [preset.previewUrl],
        );
        if (
          animationType === "media" &&
          preset.property?.toLowerCase().includes("text")
        )
          return;

        return (
          <div
            key={presetKey}
            className="flex cursor-pointer flex-col gap-2 text-center text-xs text-muted-foreground"
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
  const presetOutButtons = createPresetButtons(
    (key) => key.includes("Out"),
    "out",
  );
  const { setFloatingControl } = useLayoutStore();
  const floatingRef = useRef(null);

  useClickOutside(floatingRef, () => setFloatingControl(""));
  return (
    <Draggable handle=".handle">
      <div
        ref={floatingRef}
        className="bg-sidebar absolute right-2 top-2 z-[200] w-56 border p-0"
      >
        <div className="handle flex cursor-grab items-center justify-between px-4 py-3">
          <p className="text-sm font-bold">Animations</p>
          <div className="h-4 w-4" onClick={() => setFloatingControl("")}>
            <X className="h-3 w-3 cursor-pointer font-extrabold text-muted-foreground" />
          </div>
        </div>

        <Tabs defaultValue="in" className="w-full px-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">In</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
          </TabsList>
          <TabsContent value="in">
            <div className="grid grid-cols-3 gap-2 py-4">{presetInButtons}</div>
          </TabsContent>
          <TabsContent value="out">
            <div className="grid grid-cols-3 gap-2 py-4">
              {presetOutButtons}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Draggable>
  );
}
