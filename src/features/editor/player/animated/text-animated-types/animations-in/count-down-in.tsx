import { ITextDetails } from "@designcombo/types";
import { interpolate } from "remotion";

const numbers = ["3", "2", "1"];

const CountDownIn = ({
  text,
  frame,
  animationTextInFrames,
  details
}: {
  text: string;
  frame: number;
  animationTextInFrames: number;
  details: ITextDetails;
}) => {
  const countdownFrames = (animationTextInFrames * 3) / 4;
  const framesPerNumber = Math.floor(countdownFrames / numbers.length);

  let displayText = "";
  let localFrame = 0;
  let duration = framesPerNumber;
  let initialScale = 2;
  let finalScale = 0.5;
  let fontSize = parseFloat(details.fontSize.toString());

  if (frame < countdownFrames) {
    // Mostrar el número correspondiente
    const idx = Math.floor(frame / framesPerNumber);
    displayText = numbers[idx];
    localFrame = frame - idx * framesPerNumber;
    duration = framesPerNumber;
    initialScale = 2;
    finalScale = 0.5;
    fontSize = parseFloat(details.fontSize.toString());
  } else if (frame < animationTextInFrames) {
    // Mostrar el texto final con animación
    displayText = text;
    localFrame = frame - countdownFrames;
    duration = animationTextInFrames - countdownFrames;
    initialScale = 2;
    finalScale = 1;
    fontSize = parseFloat(details.fontSize.toString());
  } else {
    // Después de la animación, mostrar el texto final estático
    displayText = text;
    localFrame = duration;
    initialScale = 1;
    finalScale = 1;
    fontSize = parseFloat(details.fontSize.toString());
  }

  const progress = Math.min(localFrame / duration, 1);
  const scale = interpolate(progress, [0, 1], [initialScale, finalScale]);
  const opacity = interpolate(progress, [0, 1], [0.3, 1]);
  const blur = interpolate(progress, [0, 1], [8, 0]);

  return (
    <span
      style={{
        opacity,
        display: "flex",
        width: details.width,
        height: details.height,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        fontSize: `${fontSize}px`
      }}
    >
      {displayText}
    </span>
  );
};

export default CountDownIn;
