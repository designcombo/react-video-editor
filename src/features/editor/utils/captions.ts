import { generateId } from "@designcombo/timeline";
import { ICaption } from "@designcombo/types";

interface Word {
  start: number;
  end: number;
  word: string;
}

interface ICaptionLine {
  text: string;
  words: Word[];
  width: number;
  start: number;
  end: number;
}

export const generateCaption = (
  captionLine: ICaptionLine,
  fontInfo: FontInfo,
  options: Options,
  sourceUrl: string,
): ICaption => {
  const caption = {
    id: generateId(),
    type: "caption",
    name: "Caption",
    display: {
      from: options.displayFrom + captionLine.start * 1000,
      to: options.displayFrom + captionLine.end * 1000,
    },
    metadata: {
      words: captionLine.words.map((w) => ({
        ...w,
        start: w.start * 1000,
        end: w.end * 1000,
      })),
      sourceUrl,
      parentId: options.parentId,
    },
    details: {
      top: 800,
      text: captionLine.text,
      fontSize: fontInfo.fontSize,
      width: options.containerWidth,
      fontFamily: fontInfo.fontFamily,
      fontUrl: fontInfo.fontUrl,
      color: "#ff4757",
      textAlign: "center",
    } as unknown,
  };
  return caption as ICaption;
};

interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface CaptionsInput {
  sourceUrl: string;
  results: {
    main: {
      words: Word[];
    };
  };
}

function createCaptionLines(
  input: CaptionsInput,
  fontInfo: FontInfo,
  options: Options,
): ICaptionLine[] {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = `${fontInfo.fontSize}px ${fontInfo.fontFamily}`;

  const captionLines: ICaptionLine[] = [];
  const words: Word[] = input.results.main.words;

  let currentLine: ICaptionLine = {
    text: "",
    words: [],
    width: 0,
    start: words.length > 0 ? words[0].start : 0,
    end: 0,
  };
  let linesCount = 0;

  words.forEach((wordObj, index) => {
    const wordWidth = context.measureText(wordObj.word).width;

    if (
      currentLine.width + wordWidth > options.containerWidth - 64 ||
      currentLine.text.endsWith(".")
    ) {
      const advance = currentLine.text.endsWith(".");
      // Check if it's time to start a new caption set
      if (linesCount + 1 === options.linesPerCaption || advance) {
        // Only push when lines count is correct
        captionLines.push(currentLine);
        linesCount = 0;

        // Reset currentLine for the next set of lines
        currentLine = {
          text: "",
          words: [],
          width: 0,
          start: wordObj.start,
          end: wordObj.end,
        };
      } else {
        linesCount += 1;

        // Reset currentLine.width but keep other details to continue accumulation
        currentLine.width = 0;
      }
    }

    // Accumulate words and width for the current line
    currentLine.text += (currentLine.text ? " " : "") + wordObj.word;
    currentLine.words.push(wordObj);
    currentLine.width += wordWidth;
    currentLine.end = wordObj.end;

    // Push the final line if it's the last word
    if (index === words.length - 1 && currentLine.text) {
      captionLines.push(currentLine);
    }
  });

  return captionLines;
}
interface FontInfo {
  fontFamily: string;
  fontUrl: string;
  fontSize: number;
}

interface Options {
  containerWidth: number;
  linesPerCaption: number;
  parentId: string;
  displayFrom: number;
}

export function generateCaptions(
  input: CaptionsInput,
  fontInfo: FontInfo,
  options: Options,
): ICaption[] {
  const captionLines = createCaptionLines(input, fontInfo, options);

  const captions = captionLines.map((line) =>
    generateCaption(line, fontInfo, options, input.sourceUrl),
  );

  return captions;
}
