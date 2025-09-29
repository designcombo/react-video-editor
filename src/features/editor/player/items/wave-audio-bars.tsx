import { IWaveAudioBars } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { WaveBars } from "./audio-bars/wave-audio-bars";

export default function WaveAudioBars({
  item,
  options
}: {
  item: IWaveAudioBars;
  options: SequenceItemOptions;
}) {
  const children = (
    <>
      <WaveBars item={item} options={options} />
    </>
  );
  return BaseSequence({ item, options, children });
}
