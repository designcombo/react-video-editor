import { ITextDetails } from "@designcombo/types";
import { interpolate } from "remotion";

const BackgroundIn = ({
  text,
  frame,
  details,
  animationTextInFrames
}: {
  text: string;
  frame: number;
  details: ITextDetails;
  animationTextInFrames: number;
}) => {
  const progress = interpolate(frame, [0, animationTextInFrames], [0, 1], {
    extrapolateRight: "clamp"
  });
  const fullWidth = details.width;
  const fullHeight = details.height;

  const revealWidth = interpolate(progress, [0, 1], [0, fullWidth]);
  const textTranslateX = interpolate(progress, [0, 1], [fullWidth / 2, 0]);

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        width: details.width,
        height: details.height
      }}
    >
      <div
        style={{
          width: revealWidth,
          height: fullHeight,
          overflow: "hidden",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white"
        }}
      >
        <div
          style={{
            fontSize: parseFloat(details.fontSize.toString()),
            display: "flex",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            width: details.width,
            height: details.height,
            color:
              details.color === "white" || details.color.includes("fff")
                ? "black"
                : details.color,
            transform: `translateX(${textTranslateX * 2}px)`
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default BackgroundIn;
