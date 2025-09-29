import { interpolate, spring } from "remotion";

const BeatifulQuestionAnimationIn = ({
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
  const delay = index * delayFactor;

  const translateY = spring({
    frame: frame - delay,
    fps,
    from: 1.1,
    to: 0,
    config: { damping: 10 }
  });

  const opacity = interpolate(frame - delay, [0, totalDuration / 2], [0, 1], {
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

export default BeatifulQuestionAnimationIn;
