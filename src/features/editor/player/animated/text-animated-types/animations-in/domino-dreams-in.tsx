import { spring } from "remotion";

const DominoDreamsIn = ({
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

  const rotateY = spring({
    frame: frame - delay,
    fps,
    from: -90,
    to: 0,
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

export default DominoDreamsIn;
