import { interpolate } from "remotion";

const RisingStrongAnimationIn = ({
  char,
  index,
  frame,
  textLength,
  animationTextInFrames
}: {
  char: string;
  index: number;
  frame: number;
  textLength: number;
  animationTextInFrames: number;
}) => {
  const totalDuration = animationTextInFrames / 2;
  const delayFactor = totalDuration / textLength;
  const appearDelay = index * delayFactor;

  // Adjust the disappearance to happen after the complete animation if needed
  const disappearStart = totalDuration + appearDelay;

  const opacity = interpolate(
    frame - appearDelay,
    [0, totalDuration / 2, disappearStart, disappearStart + totalDuration / 2],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame - appearDelay,
    [0, totalDuration],
    [100, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `translateY(${translateY}px)`,
        opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default RisingStrongAnimationIn;
