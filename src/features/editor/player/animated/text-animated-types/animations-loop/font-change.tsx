import { ITextDetails } from "@designcombo/types";

const FontChange = ({
  frame,
  text,
  details,
  animationFonts
}: {
  text: string;
  frame: number;
  details: ITextDetails;
  animationFonts: { fontFamily: string; url: string }[];
}) => {
  const totalFonts = [{ fontFamily: details.fontFamily }, ...animationFonts];
  const cycleDuration = 30; // Duración de un ciclo completo en frames
  const framesPerFont = cycleDuration / totalFonts.length; // Frames por cada fuente

  const fontIndex = Math.floor((frame % cycleDuration) / framesPerFont);

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
          fontFamily: totalFonts[fontIndex].fontFamily
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default FontChange;
