import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
import useLayoutStore from "../../store/use-layout-store";
import { ICaption, ITrackItem } from "@designcombo/types";
import useStore from "../../store/use-store";
import { groupCaptionItems } from "../floating-controls/caption-preset-picker";
import { dispatch } from "@designcombo/events";
import { ADD_ITEMS, EDIT_OBJECT, LAYER_DELETE } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { debounce } from "lodash";

export function regroupCaptions(
  captions: ICaption[],
  newLinesPerCaption: number
): ICaption[] {
  const allWords = captions.flatMap((c) => c.details.words);
  if (allWords.length === 0) return [];

  const base = captions[0];
  const fontFamily = base.details.fontFamily || "Arial";
  const fontSize = base.details.fontSize || 16;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${fontSize}px ${fontFamily}`;

  const maxWidth = base.details.width - 80;

  const newCaptions: ICaption[] = [];
  let buffer: typeof allWords = [];
  let currentLineWidth = 0;
  let currentLineCount = 1;

  for (let i = 0; i < allWords.length; i++) {
    const word = allWords[i];
    const wordWidth = ctx.measureText(word.word).width;
    const spaceWidth = ctx.measureText(" ").width;

    let nextWidth =
      currentLineWidth === 0
        ? wordWidth
        : currentLineWidth + spaceWidth + wordWidth;

    if (nextWidth > maxWidth) {
      currentLineCount++;
      if (currentLineCount > newLinesPerCaption) {
        const text = buffer.map((w) => w.word).join(" ");
        const from = buffer[0].start;
        const to = buffer[buffer.length - 1].end;

        const newCaption: ICaption = {
          ...base,
          id: generateId(),
          display: { from, to },
          details: {
            ...base.details,
            text,
            linesPerCaption: newLinesPerCaption,
            words: [...buffer]
          }
        };

        newCaptions.push(newCaption);

        buffer = [];
        currentLineWidth = 0;
        currentLineCount = 1;
      } else {
        currentLineWidth = wordWidth;
      }
    } else {
      currentLineWidth = nextWidth;
    }

    buffer.push(word);

    if (i === allWords.length - 1 && buffer.length > 0) {
      const text = buffer.map((w) => w.word).join(" ");
      const from = buffer[0].start;
      const to = buffer[buffer.length - 1].end;

      const newCaption: ICaption = {
        ...base,
        id: generateId(),
        display: { from, to },
        details: {
          ...base.details,
          text,
          linesPerCaption: newLinesPerCaption,
          words: [...buffer]
        }
      };
      newCaptions.push(newCaption);
    }
  }

  return newCaptions;
}
type CaptionTransformType = "punctuationOrPause" | "time" | "singleWord";

export function transformCaptions(
  captions: ICaption[],
  type: CaptionTransformType
): ICaption[] {
  if (!captions.length) return [];

  const allWords = captions.flatMap((c) => c.details.words);

  const base = captions[0];

  const makeCaption = (words: any[]): ICaption => {
    const text = words.map((w) => w.word).join(" ");
    return {
      ...base,
      id: generateId(),
      display: { from: words[0].start, to: words[words.length - 1].end },
      details: {
        ...base.details,
        text,
        words,
        wordsPerLine: type,
        linesPerCaption: 1
      }
    };
  };

  switch (type) {
    case "singleWord":
      return allWords.map((word) => makeCaption([{ ...word }]));

    case "punctuationOrPause":
      const result: ICaption[] = [];
      let buffer: any[] = [];

      for (let i = 0; i < allWords.length; i++) {
        const word = allWords[i];
        const nextWord = allWords[i + 1];

        buffer.push(word);

        let shouldSplit = false;

        if (nextWord) {
          const gap = nextWord.start - word.end;
          if (gap >= 150) {
            shouldSplit = true;
          }
        }

        if (
          !shouldSplit &&
          (/[.,!?;]/.test(word.word) || word.word.endsWith("."))
        ) {
          shouldSplit = true;
        }

        if (shouldSplit) {
          result.push(makeCaption([...buffer]));
          buffer = [];
        }
      }

      if (buffer.length > 0) {
        result.push(makeCaption(buffer));
      }
      return result;

    case "time":
      const interval = 500; // ms (0.5s)
      const chunks: ICaption[] = [];
      let currentStart = allWords[0]?.start || 0;
      let wordIndex = 0;

      while (
        currentStart < (allWords[allWords.length - 1]?.end || 0) &&
        wordIndex < allWords.length
      ) {
        const currentEnd = Math.min(
          currentStart + interval,
          allWords[allWords.length - 1]?.end || 0
        );
        const chunkWords: any[] = [];

        // Collect words that fall within this time interval
        while (
          wordIndex < allWords.length &&
          allWords[wordIndex].start < currentEnd
        ) {
          chunkWords.push(allWords[wordIndex]);
          wordIndex++;
        }

        if (chunkWords.length > 0) {
          chunks.push(makeCaption(chunkWords));
        }

        currentStart = currentEnd;
      }

      return chunks;

    default:
      return captions;
  }
}
const OPTIONS_LINES_PER_PAGE = [
  {
    label: "One",
    value: 1
  },
  {
    label: "Two",
    value: 2
  },

  {
    label: "Three",
    value: 3
  },

  {
    label: "Four",
    value: 4
  },

  {
    label: "Five",
    value: 5
  }
];

const OPTIONS_WORDS_PER_LINE = [
  {
    label: "Punctuation",
    value: "punctuationOrPause"
  },
  {
    label: "Time",
    value: "time"
  },
  {
    label: "Single Word",
    value: "singleWord"
  }
];

const OPTIONS_WORDS_IN_LINE = [
  {
    label: "Page",
    value: "page"
  },
  {
    label: "Line",
    value: "line"
  },
  {
    label: "Word",
    value: "word"
  }
];
const CaptionWords = ({
  handleModalAnimation,
  trackItem
}: {
  id: string;
  handleModalAnimation: (newState?: boolean) => void;
  trackItem: ITrackItem & any;
}) => {
  const { setFloatingControl } = useLayoutStore();
  const { trackItemsMap, size } = useStore();
  const [captionsData, setCaptionsData] = useState<any[]>([]);
  const [captionItemIds, setCaptionItemIds] = useState<string[]>([]);
  const [topPosition, setTopPosition] = useState<string>(() => {
    const topValue = trackItem?.details.top;
    if (topValue === undefined) return "800";
    if (typeof topValue === "string") return topValue.replace("px", "");
    return String(topValue);
  });
  const [leftPosition, setLeftPosition] = useState<string>(() => {
    const leftValue = trackItem?.details.left;
    if (leftValue === undefined) {
      return String((size.width - elementWidth) / 2);
    }
    if (typeof leftValue === "string") return leftValue.replace("px", "");
    return String(leftValue);
  });
  const [data, setData] = useState<{
    linesPerCaption: number;
    wordsPerLine: string;
    captionsTransitions: string;
    showObject: string;
  }>({
    linesPerCaption: trackItem?.details?.linesPerCaption || 2,
    wordsPerLine: trackItem?.details?.wordsPerLine || "punctuationOrPause",
    captionsTransitions: "none",
    showObject: trackItem?.details?.showObject || "page"
  });

  const rawWidth = trackItem?.details.width as string | number | undefined;

  const elementWidth = Number(
    typeof rawWidth === "string" ? rawWidth.replace("px", "") : rawWidth || 0
  );
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const groupedCaptions = groupCaptionItems(trackItemsMap);

    const currentGroupItems = groupedCaptions[trackItem.metadata.sourceUrl];
    const captionItemIds = currentGroupItems?.map((item) => item.id);
    setCaptionItemIds(captionItemIds);
    setCaptionsData(currentGroupItems);
  }, [trackItemsMap, trackItem]);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        popoverRef.current &&
        event.target instanceof Node &&
        !popoverRef.current.contains(event.target)
      ) {
        handleModalAnimation(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const onChange = ({ type, value }: { type: string; value: any }) => {
    let newData;
    setData({ ...data, [type]: value });
    if (type === "linesPerCaption") {
      newData = regroupCaptions(captionsData, value);
    } else if (type === "wordsPerLine") {
      newData = transformCaptions(captionsData, value);
    } else if (type === "showObject") {
      newData = captionsData.map((item) => ({
        ...item,
        details: { ...item.details, showObject: value }
      }));
    }

    dispatch(LAYER_DELETE, {
      payload: {
        trackItemIds: captionsData.map((t) => t.id)
      }
    });

    dispatch(ADD_ITEMS, {
      payload: {
        trackItems: newData,
        tracks: [
          {
            id: generateId(),
            items: newData?.map((item) => item.id) || [],
            type: "caption"
          }
        ]
      }
    });
  };

  const handleSetPosition = useCallback(
    debounce((left: number, top: number) => {
      const updates = captionsData.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            details: { left, top }
          }
        }),
        {}
      );

      dispatch(EDIT_OBJECT, { payload: updates });
    }, 200),
    [captionsData]
  );

  const handlePresetPosition = (
    position: "left" | "center" | "right" | "up" | "middle" | "down"
  ) => {
    let left = 0;
    let top = 0;
    const elementHeight = trackItem?.details.height || 0;
    switch (position) {
      case "left":
        left = size.width * 0.1;
        // Keep current vertical position
        top = parseFloat(topPosition) || 0;
        break;
      case "center":
        left = (size.width - elementWidth) / 2;
        // Keep current vertical position
        top = parseFloat(topPosition) || 0;
        break;
      case "right":
        left = size.width * 0.9 - elementWidth;
        // Keep current vertical position
        top = parseFloat(topPosition) || 0;
        break;
      case "up":
        // Keep current horizontal position
        left = parseFloat(leftPosition) || 0;
        top = size.height * 0.1;
        break;
      case "middle":
        // Keep current horizontal position
        left = parseFloat(leftPosition) || 0;
        top = size.height / 2 - elementHeight / 2;
        break;
      case "down":
        // Keep current horizontal position
        left = parseFloat(leftPosition) || 0;
        top = size.height * 0.9 - elementHeight;
        break;
    }

    setTopPosition(String(top));
    setLeftPosition(String(left));
    handleSetPosition(left, top);
  };

  const animationOptions: { key: string; label: string }[] = [
    { key: "none", label: "None" },
    { key: "fade-in-full", label: "Fade" },
    { key: "scale-up-0", label: "Scale" },
    { key: "translate-x", label: "Slide" },
    { key: "scale-up-08", label: "Zoom" },
    { key: "scale-down-12", label: "Pop" },
    { key: "jump", label: "Jump" },
    { key: "pulse", label: "Pulse" }
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  function toggleOption(option: string) {
    setSelectedOptions((prev) => {
      let newOptions: string[];
      if (prev.includes(option)) {
        newOptions = [];
      } else {
        newOptions = [option];
      }

      const animationString = newOptions.length > 0 ? newOptions[0] : "none";
      selectAnimation(animationString);

      return newOptions;
    });
  }

  const selectAnimation = (animation: string) => {
    console.log("animation", animation);
    const payload = captionItemIds.reduce((acc, id) => {
      return {
        ...acc,
        [id]: {
          details: {
            animation
          }
        }
      };
    }, {});
    dispatch(EDIT_OBJECT, {
      payload
    });
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold">Words</Label>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Lines per Page
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="flex h-8 w-full items-center justify-between text-sm"
                variant="secondary"
              >
                <div className="w-full overflow-hidden text-left">
                  <p className="truncate">
                    {
                      OPTIONS_LINES_PER_PAGE.filter(
                        (option) => option.value === data.linesPerCaption
                      )[0].label
                    }
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground" size={14} />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[300] w-32 p-0">
              {OPTIONS_LINES_PER_PAGE.map((option, index) => (
                <Button
                  size={"sm"}
                  variant="ghost"
                  className="w-full"
                  key={index}
                  onClick={() =>
                    onChange({ type: "linesPerCaption", value: option.value })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Words per line
        </div>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-8 w-full items-center justify-between text-sm"
                  variant="secondary"
                >
                  <div className="w-full overflow-hidden text-left">
                    <p className="truncate">
                      {
                        OPTIONS_WORDS_PER_LINE.filter(
                          (option) => option.value === data.wordsPerLine
                        )[0].label
                      }
                    </p>
                  </div>
                  <ChevronDown className="text-muted-foreground" size={14} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-[300] w-32 p-0">
                {OPTIONS_WORDS_PER_LINE.map((option, index) => (
                  <Button
                    size={"sm"}
                    variant="ghost"
                    className="w-full truncate"
                    key={index}
                    onClick={() =>
                      onChange({ type: "wordsPerLine", value: option.value })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Words in line
        </div>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-8 w-full items-center justify-between text-sm"
                  variant="secondary"
                >
                  <div className="w-full overflow-hidden text-left">
                    <p className="truncate">
                      {
                        OPTIONS_WORDS_IN_LINE.filter(
                          (option) => option.value === data.showObject
                        )[0].label
                      }
                    </p>
                  </div>
                  <ChevronDown className="text-muted-foreground" size={14} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-[300] w-32 p-0">
                {OPTIONS_WORDS_IN_LINE.map((option, index) => (
                  <Button
                    size={"sm"}
                    variant="ghost"
                    className="w-full truncate"
                    key={index}
                    onClick={() =>
                      onChange({ type: "showObject", value: option.value })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Position
        </div>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-8 w-full items-center justify-between text-sm"
                  variant="secondary"
                >
                  <div className="w-full overflow-hidden text-left">
                    <p className="truncate">Auto</p>
                  </div>
                  <ChevronDown className="text-muted-foreground" size={14} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-[300] w-32 p-0">
                <Button
                  size={"sm"}
                  variant="ghost"
                  className="w-full"
                  onClick={() => handlePresetPosition("middle")}
                >
                  Auto
                </Button>
                <Button
                  size={"sm"}
                  variant="ghost"
                  className="w-full"
                  onClick={() => handlePresetPosition("up")}
                >
                  Top
                </Button>
                <Button
                  size={"sm"}
                  variant="ghost"
                  className="w-full"
                  onClick={() => handlePresetPosition("middle")}
                >
                  Center
                </Button>
                <Button
                  size={"sm"}
                  variant="ghost"
                  className="w-full"
                  onClick={() => handlePresetPosition("down")}
                >
                  Bottom
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Transition
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="flex h-8 w-full items-center justify-between text-sm"
                variant="secondary"
              >
                <div className="w-full overflow-hidden text-left">
                  <p className="truncate">
                    {selectedOptions.length === 0
                      ? "None"
                      : animationOptions.find(
                          (opt) => opt.key === selectedOptions[0]
                        )?.label || "None"}
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground" size={14} />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                {animationOptions.map((opt) => (
                  <Button
                    key={opt.key}
                    variant={
                      selectedOptions.includes(opt.key) ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => toggleOption(opt.key)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default CaptionWords;
