import { IProgressFrame } from "@designcombo/types";
import { calculateFrames } from "../../utils/frames";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";

export default function ProgressFrame({
  item,
  options
}: {
  item: IProgressFrame;
  options: SequenceItemOptions;
}) {
  const { fps, frame } = options;
  const { details } = item;
  const playbackRate = item.playbackRate || 1;
  const { from, durationInFrames } = calculateFrames(
    {
      from: item.display.from / playbackRate,
      to: item.display.to / playbackRate
    },
    fps
  );
  let progress;
  if (details.inverted) {
    const relativeFrame = Math.max((frame || 0) - from, 0);
    progress = 100 - Math.min((relativeFrame / durationInFrames) * 100, 100);
  } else {
    const relativeFrame = Math.max((frame || 0) - from, 0);
    progress = Math.min((relativeFrame / durationInFrames) * 100, 100);
  }
  const width = details.width || 100;
  const height = details.height || 100;
  const minSide = Math.min(width, height);
  const maskSize = minSide * 0.1;

  const children = (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          scale: `${details.flipX ? -1 : 1} ${details.flipY ? -1 : 1}`
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(0 0, 100% 0, 100% ${maskSize}px, ${maskSize}px ${maskSize}px, ${maskSize}px 100%, 0 100%)`
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor:
                details.backgroundColors[0] || "rgba(128, 128, 128,0.5)",
              width: "100%",
              height: "100%"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor:
                details.backgroundColors[1] || "rgba(128, 128, 128,1)",
              width: `${progress}%`,
              height: `${progress}%`
            }}
          />
        </div>
      </div>
    </>
  );

  return BaseSequence({ item, options, children });
}
