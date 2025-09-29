import { interpolate, spring } from "remotion";

const SunnyMorningsAnimationIn = ({
  char,
  index,
  frame,
  fps,
  textLength,
  animationTextInFrames
}: {
  char: string;
  index: number;
  frame: number;
  fps: number;
  textLength: number;
  animationTextInFrames: number;
}) => {
  const totalDuration = animationTextInFrames;
  const delayFactor = totalDuration / (textLength + 1);
  const delay = index * delayFactor;

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 4,
    to: 1,
    config: { mass: 1, damping: 10 }
  });

  const opacity = interpolate(
    frame - delay,
    [0, totalDuration / 2], // Ensure opacity fades in within half the duration
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity: opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default SunnyMorningsAnimationIn;
