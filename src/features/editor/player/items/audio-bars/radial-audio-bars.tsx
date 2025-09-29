import { Audio } from "remotion";
import { RadialBarsVisualization } from "./radial-bars-visualization";
import { IRadialAudioBars } from "@designcombo/types";
import { SequenceItemOptions } from "../../base-sequence";
import { audioDataManager } from "../../lib/audio-data";

export const RadialBars = ({
  item,
  options
}: {
  item: IRadialAudioBars;
  options: SequenceItemOptions;
}) => {
  const { fps, frame } = options;
  const { details } = item;
  const playbackRate = item.playbackRate || 1;

  audioDataManager.setAudioDataManager(fps);

  const nSamples = 512;
  const visualizationValues = audioDataManager.getAudioDataForFrame(frame || 0);

  const frequencyData = visualizationValues.slice(0, 0.7 * nSamples);
  return (
    <>
      <RadialBarsVisualization
        frequencyData={frequencyData}
        diameter={details.width}
        innerRadius={details.width / 4}
        color={details.radialBarColor}
      />
      {details.reproduceAudio &&
        details.srcs.map((src, index) => {
          return <Audio key={index} playbackRate={playbackRate} src={src} />;
        })}
    </>
  );
};
