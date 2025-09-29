import { ILinealAudioBars } from "@designcombo/types";
import { BarsVisualization } from "./bars-visualization";
import { SequenceItemOptions } from "../../base-sequence";
import { audioDataManager } from "../../lib/audio-data";

export const LinealBars = ({
  item,
  options
}: {
  item: ILinealAudioBars;
  options: SequenceItemOptions;
}) => {
  const { frame, fps } = options;
  const { details } = item;

  audioDataManager.setAudioDataManager(fps);

  const nSamples = 512;
  const visualizationValues = audioDataManager.getAudioDataForFrame(frame || 0);

  const frequencyData = visualizationValues.slice(0, 0.7 * nSamples);
  const validPlacements = ["middle", "over", "under"] as const;
  const isValidPlacement = validPlacements.includes(details.placement as any);
  return (
    <>
      <BarsVisualization
        frequencyData={frequencyData}
        width={details.width}
        height={details.height}
        lineThickness={details.lineThickness}
        gapSize={details.gapSize}
        roundness={details.roundness}
        color={details.linealBarColor}
        placement={
          isValidPlacement
            ? (details.placement as "middle" | "over" | "under")
            : undefined
        }
      />
    </>
  );
};
