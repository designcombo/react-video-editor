import { ITextDetails } from "@designcombo/types";
import { useMemo } from "react";
import { interpolate } from "remotion";

const TypeWriterOut = ({
  animationDuration,
  text,
  details,
  frame,
  durationInFrames
}: {
  animationDuration: number;
  text: string;
  details: ITextDetails;
  frame: number;
  durationInFrames: number;
}) => {
  const visibleCharacters = Math.floor(
    interpolate(
      frame,
      [durationInFrames - animationDuration, durationInFrames],
      [text.length, 0],
      { extrapolateRight: "clamp" }
    )
  );

  const visibleText = useMemo(() => {
    let count = 0;
    return text
      .split(" ")
      .map((word) => {
        if (count + word.length <= visibleCharacters) {
          count += word.length + 1; // Contamos el espacio
          return word;
        }
        if (count < visibleCharacters) {
          const partialWord = word.slice(0, visibleCharacters - count);
          count = visibleCharacters;
          return partialWord;
        }
        return "";
      })
      .join(" ");
  }, [visibleCharacters]);

  return (
    <div
      style={{
        textAlign: "center"
      }}
    >
      <span
        style={{
          fontSize: details.fontSize
        }}
      >
        {visibleText}
      </span>
      <span
        style={{
          color: "#60a5fa",
          opacity: frame % 15 < 7 ? 1 : 0
        }}
      >
        |
      </span>
    </div>
  );
};

export default TypeWriterOut;
