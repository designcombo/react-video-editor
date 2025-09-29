import { spring } from "remotion";

const DominoDreamsAnimationOut = ({
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

  const rotateY = spring({
    frame: progress,
    fps,
    from: 0,
    to: 90,
    config: { mass: 1, damping: 12 }
  });

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `rotateY(${rotateY}deg)`
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default DominoDreamsAnimationOut;
