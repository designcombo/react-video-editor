import { ITextDetails } from "@designcombo/types";
import { interpolate } from "remotion";

const PulseText = ({
  char,
  index,
  frame,
  details
}: {
  char: string;
  index: number;
  frame: number;
  details: ITextDetails;
}) => {
  const delay = index * 6;
  const pulse = interpolate(
    ((frame + 30 - delay) % 30) / 30,
    [0, 0.5, 1],
    [1, 1.2, 1],
    {
      extrapolateRight: "clamp"
    }
  );
  const opacity = interpolate(
    ((frame + 30 - delay) % 30) / 30,
    [0, 0.5, 1],
    [0.5, 1, 0.5],
    {
      extrapolateRight: "clamp"
    }
  );

  return (
    <span
      style={{
        opacity: opacity,
        position: "relative",
        fontSize: parseFloat(details.fontSize.toString()) * pulse,
        scale: pulse
      }}
    >
      {char}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: parseFloat(details.fontSize.toString()) * 1.5,
          height: parseFloat(details.fontSize.toString()) * 1.5,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(20px)",
          opacity: opacity
        }}
      />
    </span>
  );
};

export default PulseText;
