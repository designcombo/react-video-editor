import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dispatch } from "@designcombo/events";
import { ADD_ANIMATION } from "@designcombo/state";
import useStore from "../store/use-store";
import { presets } from "../player/animated";
import { PresetName } from "../player/animated/presets";
import React from "react";

const Animations = () => {
  const { activeIds } = useStore();

  const applyAnimation = (presetName: PresetName, type: "in" | "out") => {
    if (!activeIds.length) {
      console.warn("No active ID to apply the animation to.");
      return;
    }

    const presetAnimation = presets[presetName];
    const composition = presetName.includes("rotate")
      ? [presetAnimation, presets.scaleIn]
      : [presetAnimation];

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
            width: "70px",
            height: "70px",
            borderRadius: "8px",
          }),
          [preset.previewUrl],
        );

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

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-md text-text-primary flex h-12 flex-none items-center px-4 font-medium">
        Animations
      </div>
      <div className="px-4">
        <Tabs defaultValue="in" className="w-full">
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
    </div>
  );
};

export default Animations;
