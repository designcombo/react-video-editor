import { IHillAudioBars } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { HillBars } from "./audio-bars/hill-audio-bars";

export default function HillAudioBars({
  item,
  options
}: {
  item: IHillAudioBars;
  options: SequenceItemOptions;
}) {
  const children = (
    <>
      <HillBars item={item} options={options} />
    </>
  );
  return BaseSequence({ item, options, children });
}
