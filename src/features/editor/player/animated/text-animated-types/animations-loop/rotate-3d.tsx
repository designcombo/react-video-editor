import { interpolate } from "remotion";

const Rotate3d = ({
  frame,
  durationInFrames,
  text
}: {
  text: string;
  frame: number;
  durationInFrames: number;
}) => {
  const rotation = interpolate(frame, [0, durationInFrames / 2], [0, 360]);
  const rotation2 = rotation - 90;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "transparent",
        perspective: 1000 // necesaria para el efecto 3D
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          background: "transparent"
        }}
      >
        {text}
      </div>
      <div
        style={{
          transform: `rotateY(${rotation2}deg)`,
          transformStyle: "preserve-3d",
          position: "absolute",
          top: 0,
          background: "transparent"
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Rotate3d;
