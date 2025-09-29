import { interpolate, spring } from "remotion";

const BeatifulQuestionAnimationOut = ({
  char,
  index,
  frame,
  fps,
  textLength,
  animationTextOutFrames,
  durationInFrames
}: {
  char: string;
  index: number;
  frame: number;
  fps: number;
  textLength: number;
  animationTextOutFrames: number;
  durationInFrames: number;
}) => {
  const exitDuration = animationTextOutFrames;
  const delayPerChar = exitDuration / textLength;
  const exitStart = durationInFrames - animationTextOutFrames;
  const charExitStart = exitStart + index * delayPerChar;
  const progress = frame - charExitStart;

  const translateY = spring({
    frame: progress,
    fps,
    from: 0,
    to: 1.1,
    config: { damping: 10 }
  });

  const opacity = interpolate(progress, [0, delayPerChar], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp"
  });
  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `translateY(${translateY}em)`,
        opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default BeatifulQuestionAnimationOut;
