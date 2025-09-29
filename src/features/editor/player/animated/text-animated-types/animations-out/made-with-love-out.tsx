import { interpolate, spring } from "remotion";

const MadeWithLoveAnimationOut = ({
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

  const translateY = spring({
    frame: progress,
    fps,
    from: 0,
    to: 100, // Move text out of view
    config: { damping: 20, stiffness: 120 }
  });

  const opacity = interpolate(
    progress,
    [0, delayPerChar], // Frames for opacity fade-out
    [1, 0],
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
      {char === " " ? "\u00A0" : char}
    </span>
  );
};

export default MadeWithLoveAnimationOut;
