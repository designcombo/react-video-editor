const DescompressAnimationOut = ({
  char,
  index,
  frame,
  fps,
  animationTextOutFrames,
  durationInFrames
}: {
  char: string;
  index: number;
  frame: number;
  fps: number;
  animationTextOutFrames: number;
  durationInFrames: number;
}) => {
  const startTime = (durationInFrames - animationTextOutFrames) / fps;
  const endTime = durationInFrames / fps;
  const time = frame / fps;

  const progress = Math.min(
    Math.max((time - startTime) / (endTime - startTime), 0),
    1
  );
  const scaleX = 1 + progress;
  const opacity = 1 - progress;

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `scaleX(${scaleX})`,
        opacity: opacity
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default DescompressAnimationOut;
