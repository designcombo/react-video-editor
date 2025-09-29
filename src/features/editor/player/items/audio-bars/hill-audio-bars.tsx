import { IHillAudioBars } from "@designcombo/types";
import { SequenceItemOptions } from "../../base-sequence";
import { audioDataManager } from "../../lib/audio-data";
import { HillsVisualization } from "./hill-visualization";

export const HillBars = ({
  item,
  options
}: {
  item: IHillAudioBars;
  options: SequenceItemOptions;
}) => {
  const { frame, fps } = options;
  const { details } = item;

  audioDataManager.setAudioDataManager(fps);

  const nSamples = 512;
  const visualizationValues = audioDataManager.getAudioDataForFrame(frame || 0);

  const frequencyData = visualizationValues.slice(0, 0.7 * nSamples);
  const isValidBlendMode = (
    value: any
  ): value is
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity" => {
    return [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity"
    ].includes(value);
  };
  return (
    <>
      <HillsVisualization
        frequencyData={frequencyData}
        width={details.width}
        height={details.height}
        strokeColor={details.strokeColor}
        {...(details.fillColor != null ? { fillColor: details.fillColor } : {})}
        {...(details.copies != null ? { copies: details.copies } : {})}
        {...(details.strokeWidth != null
          ? { strokeWidth: details.strokeWidth }
          : {})}
        {...(isValidBlendMode(details.blendMode)
          ? { blendMode: details.blendMode }
          : { blendMode: "normal" })}
      />
    </>
  );
};
