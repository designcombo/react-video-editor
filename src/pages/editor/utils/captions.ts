import { generateId } from "@designcombo/timeline";
import { ICaption } from "@designcombo/types";

interface Word {
  start: number;
  end: number;
  word: string;
}

interface Segment {
  start: number;
  end: number;
  text: string;
  words: Word[];
}

interface Input {
  segments: Segment[];
}

interface ICaptionLines {
  lines: Line[];
}

interface Line {
  text: string;
  words: Word[];
  width: number;
  start: number;
  end: number;
}

export function getCaptionLines(
  input: Input,
  fontSize: number,
  fontFamily: string,
  maxWidth: number,
): ICaptionLines {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = `${fontSize}px ${fontFamily}`;

  const captionLines: ICaptionLines = { lines: [] };
  input.segments.forEach((segment) => {
    let currentLine: Line = {
      text: "",
      words: [],
      width: 0,
      start: segment.start,
      end: 0,
    };
    segment.words.forEach((wordObj, index) => {
      const wordWidth = context.measureText(wordObj.word).width;

      // Check if adding this word exceeds the max width
      if (currentLine.width + wordWidth > maxWidth) {
        // Push the current line to captionLines and start a new line
        console.log({ currentLine });
        captionLines.lines.push(currentLine);
        currentLine = {
          text: "",
          words: [],
          width: 0,
          start: wordObj.start,
          end: wordObj.end,
        };
      }

      // Add the word to the current line
      currentLine.text += (currentLine.text ? " " : "") + wordObj.word;
      currentLine.words.push(wordObj);
      currentLine.width += wordWidth;

      // Update line end time
      currentLine.end = wordObj.end;

      // Push the last line when the iteration ends
      if (index === segment.words.length - 1) {
        captionLines.lines.push(currentLine);
      }
    });
  });

  return captionLines;
}

export const getCaptions = (
  captionLines: ICaptionLines,
): Partial<ICaption>[] => {
  const captions = captionLines.lines.map((line) => {
    return {
      id: generateId(),
      type: "caption",
      name: "Caption",
      display: {
        from: line.start,
        to: line.end,
      },
      metadata: {},
      details: {
        top: 400,
        text: line.text,
        fontSize: 64,
        width: 800,
        fontFamily: "theboldfont",
        fontUrl: "https://cdn.designcombo.dev/fonts/theboldfont.ttf",
        color: "#fff",
        textAlign: "center",
        words: line.words,
      },
    };
  });
  return captions as unknown as Partial<ICaption>[];
};
