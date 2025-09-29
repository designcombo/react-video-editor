import { ITextDetails } from "@designcombo/types";
import { useMemo } from "react";
import { interpolate } from "remotion";

export default function TypeWriterIn({
  frame,
  durationInFrames,
  text,
  style
}: {
  frame: number;
  durationInFrames: number;
  text: string;
  style: ITextDetails;
}) {
  const visibleCharacters = Math.floor(
    interpolate(frame, [0, durationInFrames], [0, text.length], {
      extrapolateRight: "clamp"
    })
  );

  const visibleText = useMemo(() => {
    let count = 0;
    return text
      .split(" ")
      .map((word) => {
        if (count + word.length <= visibleCharacters) {
          count += word.length + 1;
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
          fontSize: style.fontSize
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
}
