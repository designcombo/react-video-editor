import { ITextDetails } from "@designcombo/types";
import { interpolate } from "remotion";

const BackgroundOut = ({
  text,
  frame,
  animationTextOutFrames,
  details,
  durationInFrames,
  fps
}: {
  text: string;
  frame: number;
  animationTextOutFrames: number;
  details: ITextDetails;
  durationInFrames: number;
  fps: number;
}) => {
  const start = durationInFrames - animationTextOutFrames;
  const duration = animationTextOutFrames;

  // Progreso de la animación de salida
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateRight: "clamp"
  });
  const fullWidth = details.width;
  const fullHeight = details.height;

  // El rectángulo se reduce de ancho completo a 0
  const revealWidth = interpolate(
    Math.round(progress * 100),
    [0, 100 - fps / 10],
    [fullWidth, 0]
  );
  // El texto se mueve del centro hacia la derecha
  const textTranslateX = interpolate(progress, [0, 1], [0, fullWidth * 2]);

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
      {/* Máscara que oculta el texto fuera del rectángulo */}
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
            transform: `translateX(${textTranslateX}px)`
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default BackgroundOut;
