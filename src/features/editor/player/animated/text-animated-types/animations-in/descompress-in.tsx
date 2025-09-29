const DescompressAnimationIn = ({
  char,
  index,
  frame,
  fps,
  animationTextInFrames
}: {
  char: string;
  index: number;
  frame: number;
  fps: number;
  animationTextInFrames: number;
}) => {
  const endTime = animationTextInFrames / fps;
  const time = frame / fps;

  const progress = Math.min(Math.max(time / endTime, 0), 1);

  const scaleX = 3 - progress * 2;
  const opacity = progress;

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

export default DescompressAnimationIn;
