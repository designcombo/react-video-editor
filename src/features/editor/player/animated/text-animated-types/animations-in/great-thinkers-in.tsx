import { spring } from "remotion";

const GetThinkersAnimationIn = ({
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

  const opacity = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { stiffness: 60, damping: 10 }
  });

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default GetThinkersAnimationIn;
