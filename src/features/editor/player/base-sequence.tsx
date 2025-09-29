import { ISize, ITrackItem } from "@designcombo/types";
import { AbsoluteFill, Sequence } from "remotion";
import { calculateFrames } from "../utils/frames";
import { calculateContainerStyles } from "./styles";
import { TransitionSeries } from "@designcombo/transitions";

export interface SequenceItemOptions {
  handleTextChange?: (id: string, text: string) => void;
  fps: number;
  editableTextId?: string | null;
  currentTime?: number;
  zIndex?: number;
  onTextBlur?: (id: string, text: string) => void;
  size?: ISize;
  frame?: number;
  isTransition?: boolean;
}

export const BaseSequence = ({
  item,
  options,
  children
}: {
  item: ITrackItem;
  options: SequenceItemOptions;
  children: React.ReactNode;
}) => {
  const { details } = item as ITrackItem;
  const { fps, isTransition } = options;
  const { from, durationInFrames } = calculateFrames(
    {
      from: item.display.from,
      to: item.display.to
    },
    fps
  );
  const crop = details.crop || {
    x: 0,
    y: 0,
    width: item.details.width,
    height: item.details.height
  };

  const background =
    details?.background?.type === "color"
      ? details?.background?.value
      : typeof details?.background === "string"
        ? details?.background
        : "transparent";

  if (isTransition) {
    return (
      <TransitionSeries.Sequence
        key={item.id}
        durationInFrames={durationInFrames}
        style={{ pointerEvents: "none" }}
      >
        <AbsoluteFill
          id={item.id}
          data-track-item="transition-element"
          className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type}`}
          style={calculateContainerStyles(details, crop, { background })}
        >
          {children}
        </AbsoluteFill>
      </TransitionSeries.Sequence>
    );
  }

  return (
    <Sequence
      key={item.id}
      from={from}
      durationInFrames={durationInFrames || 1 / fps}
      style={{
        pointerEvents: "none"
      }}
    >
      <AbsoluteFill
        id={item.id}
        data-track-item="transition-element"
        className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type}`}
        style={calculateContainerStyles(
          details,
          crop,
          {
            background,
            pointerEvents: item.type === "audio" ? "none" : "auto",
            overflow:
              item.type !== "caption" && item.type !== "text"
                ? "hidden"
                : "visible"
          },
          item.type
        )}
      >
        {children}
      </AbsoluteFill>
    </Sequence>
  );
};
