import { interpolate, spring } from "remotion";

const MadeWithLoveAnimationIn = ({
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
  const delayFactor = totalDuration / textLength;
  const delay = index * delayFactor; // Calculate delay for each letter

  const translateY = spring({
    frame: frame - delay,
    fps,
    from: -100,
    to: 0,
    config: { damping: 20, stiffness: 120 }
  });

  const opacity = interpolate(
    frame - delay,
    [0, totalDuration / 2], // Complete opacity ramp-up within half the duration
    [0, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp"
    }
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

export default MadeWithLoveAnimationIn;
