import { spring } from "remotion";

const AnimatedTextIn = ({
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
  // Adjust delay based on total frames available for the entire animation
  const totalDelay = animationTextInFrames;
  const delayFactor = totalDelay / textLength;
  const delay = index * delayFactor;

  const opacity = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { mass: 0.5, damping: 10 }
  });

  const y = spring({
    frame: frame - delay,
    fps,
    from: -50,
    to: 0,
    config: { mass: 0.5, damping: 10 }
  });

  const rotate = spring({
    frame: frame - delay,
    fps,
    from: -180,
    to: 0,
    config: { mass: 0.5, damping: 12 }
  });

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px) rotate(${rotate}deg)`,
        transition: "all 0.05s ease-out"
      }}
    >
      {char === " " ? " " : char}
    </span>
  );
};

export default AnimatedTextIn;
