import { interpolate, spring } from "remotion";

const SunnyMorningsAnimationOut = ({
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
  const exitStart = durationInFrames - animationTextOutFrames;
  const delayPerChar = animationTextOutFrames / textLength;

  const charExitStart = exitStart + index * delayPerChar;
  const progress = frame - charExitStart;

  const scale = spring({
    frame: progress,
    fps,
    from: 1,
    to: 0,
    config: { mass: 1, damping: 10 }
  });

  const opacity = interpolate(progress, [0, delayPerChar], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};
export default SunnyMorningsAnimationOut;
