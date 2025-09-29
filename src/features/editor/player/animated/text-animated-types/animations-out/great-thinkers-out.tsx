import { spring } from "remotion";

const GreatThinkersAnimationOut = ({
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

  const opacity = spring({
    frame: progress,
    fps,
    from: 1,
    to: 0,
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

export default GreatThinkersAnimationOut;
