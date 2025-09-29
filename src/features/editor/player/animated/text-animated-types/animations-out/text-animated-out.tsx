import { spring } from "remotion";

const AnimatedTextOut = ({
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
  const startExitFrame = durationInFrames - animationTextOutFrames;
  const delay = (index / textLength) * (durationInFrames - startExitFrame);

  const opacity = spring({
    frame: frame - startExitFrame - delay,
    fps,
    from: 1,
    to: 0,
    config: { mass: 0.5, damping: 10 }
  });

  const y = spring({
    frame: frame - startExitFrame - delay,
    fps,
    from: 0,
    to: 50,
    config: { mass: 0.5, damping: 10 }
  });

  const rotate = spring({
    frame: frame - startExitFrame - delay,
    fps,
    from: 0,
    to: 180,
    config: { mass: 0.5, damping: 12 }
  });
  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px) rotate(${rotate}deg)`
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default AnimatedTextOut;
