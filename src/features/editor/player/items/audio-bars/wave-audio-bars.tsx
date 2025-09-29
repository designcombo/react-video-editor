import { IWaveAudioBars } from "@designcombo/types";
import { SequenceItemOptions } from "../../base-sequence";
import { audioDataManager } from "../../lib/audio-data";
import { WaveVisualization } from "./wave-visualization";

export const WaveBars = ({
  item,
  options
}: {
  item: IWaveAudioBars;
  options: SequenceItemOptions;
}) => {
  const { frame, fps } = options;
  const { details } = item;
  audioDataManager.setAudioDataManager(fps);

  const nSamples = 512;
  const visualizationValues = audioDataManager.getAudioDataForFrame(frame || 0);

  const frequencyData = visualizationValues.slice(0, 0.7 * nSamples);
  return (
    <>
      <WaveVisualization
        frequencyData={frequencyData}
        width={details.width}
        height={details.height}
        offsetPixelSpeed={details.offsetPixelSpeed}
        lineColor={details.lineColor}
        lineGap={details.lineGap}
        {...(details.topRoundness != null
          ? { topRoundness: details.topRoundness }
          : {})}
        {...(details.bottomRoundness != null
          ? { bottomRoundness: details.bottomRoundness }
          : {})}
        {...(details.lines != null && details.lines !== 0
          ? { lines: details.lines }
          : {})}
        sections={details.sections}
      />
    </>
  );
};
