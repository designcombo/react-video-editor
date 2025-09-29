import { interpolate, spring } from "remotion";

const RealityIsBrokenAnimationOut = ({
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
    to: 1,
    config: { mass: 1, damping: 10 }
  });

  const translateX = spring({
    frame: progress,
    fps,
    from: 0,
    to: 0.55,
    config: { mass: 1, damping: 10 }
  });

  const rotateZ = spring({
    frame: progress,
    fps,
    from: 0,
    to: 180,
    config: { mass: 1, damping: 10 }
  });

  const opacity = interpolate(progress, [0, delayPerChar], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transformOrigin: "0 100%",
        transform: `translateY(${translateY}em) translateX(${translateX}em) rotateZ(${rotateZ}deg)`,
        opacity
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
};

export default RealityIsBrokenAnimationOut;
