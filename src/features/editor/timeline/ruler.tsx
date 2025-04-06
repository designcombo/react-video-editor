import { useCallback, useEffect, useRef, useState } from "react";

import {
  PREVIEW_FRAME_WIDTH,
  SECONDARY_FONT,
  SMALL_FONT_SIZE,
  TIMELINE_OFFSET_CANVAS_LEFT,
  TIMELINE_OFFSET_X,
} from "../constants/constants";
import { formatTimelineUnit } from "../utils/format";
import useStore from "../store/use-store";
import { debounce } from "lodash";

interface RulerProps {
  height?: number;
  longLineSize?: number;
  shortLineSize?: number;
  offsetX?: number;
  textOffsetY?: number;
  scrollPos?: number;
  textFormat?: (scale: number) => string;
  scrollLeft?: number;
  onClick?: (units: number) => void;
}

const Ruler = (props: RulerProps) => {
  const {
    height = 40, // Increased height to give space for the text
    longLineSize = 8,
    shortLineSize = 10,
    offsetX = TIMELINE_OFFSET_X + TIMELINE_OFFSET_CANVAS_LEFT,
    textOffsetY = 17, // Place the text above the lines but inside the canvas
    textFormat = formatTimelineUnit,
    scrollLeft: scrollPos = 0,
    onClick,
  } = props;
  const { scale } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: height, // Increased height for text space
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      setCanvasContext(context);
      resize(canvas, context, scrollPos);
    }
  }, []);

  const handleResize = useCallback(() => {
    resize(canvasRef.current, canvasContext, scrollPos);
  }, [canvasContext, scrollPos]);

  useEffect(() => {
    const resizeHandler = debounce(handleResize, 200);
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [handleResize]);

  useEffect(() => {
    if (canvasContext) {
      resize(canvasRef.current, canvasContext, scrollPos);
    }
  }, [canvasContext, scrollPos, scale]);

  const resize = (
    canvas: HTMLCanvasElement | null,
    context: CanvasRenderingContext2D | null,
    scrollPos: number,
  ) => {
    if (!canvas || !context) return;

    const offsetParent = canvas.offsetParent as HTMLDivElement;
    const width = offsetParent?.offsetWidth ?? canvas.offsetWidth;
    const height = canvasSize.height;

    canvas.width = width;
    canvas.height = height;

    draw(context, scrollPos, width, height);
    setCanvasSize({ width, height });
  };

  const draw = (
    context: CanvasRenderingContext2D,
    scrollPos: number,
    width: number,
    height: number,
  ) => {
    const zoom = scale.zoom;
    const unit = scale.unit;
    const segments = scale.segments;
    context.clearRect(0, 0, width, height);
    context.save();
    context.strokeStyle = "#71717a";
    context.fillStyle = "#71717a";
    context.lineWidth = 1;
    context.font = `${SMALL_FONT_SIZE}px ${SECONDARY_FONT}`;
    context.textBaseline = "top";

    context.translate(0.5, 0);
    context.beginPath();

    const zoomUnit = unit * zoom * PREVIEW_FRAME_WIDTH;
    const minRange = Math.floor(scrollPos / zoomUnit);
    const maxRange = Math.ceil((scrollPos + width) / zoomUnit);
    const length = maxRange - minRange;

    // Draw text before drawing the lines
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = (value * zoomUnit) / zoom;
      const startPos = (startValue - scrollPos / zoom) * zoom;

      if (startPos < -zoomUnit || startPos >= width + zoomUnit) continue;
      const text = textFormat(startValue);

      // Calculate the textOffsetX value
      const textWidth = context.measureText(text).width;
      const textOffsetX = -textWidth / 2;

      // Adjust textOffsetY so it stays inside the canvas but above the lines
      context.fillText(text, startPos + textOffsetX + offsetX, textOffsetY);
    }

    // Draw long and short lines after the text
    for (let i = 0; i <= length; ++i) {
      const value = i + minRange;

      if (value < 0) continue;

      const startValue = value * zoomUnit;
      const startPos = startValue - scrollPos + offsetX;

      for (let j = 0; j < segments; ++j) {
        const pos = startPos + (j / segments) * zoomUnit;

        if (pos < 0 || pos >= width) continue;

        const lineSize = j % segments ? shortLineSize : longLineSize;

        // Set color based on line size
        if (lineSize === shortLineSize) {
          context.strokeStyle = "#52525b"; // Yellow for short lines
        } else {
          context.strokeStyle = "#18181b"; // Red for long lines
        }

        const origin = 18; // Increase the origin to start lines lower, below the text

        const [x1, y1] = [pos, origin];
        const [x2, y2] = [x1, y1 + lineSize];

        context.beginPath(); // Begin a new path for each line
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);

        // Set color based on line size
        if (lineSize === shortLineSize) {
          context.stroke(); // Draw the line
        }
      }
    }

    context.restore();
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the bounding box of the canvas to calculate the relative click position
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Calculate total x position, including scrollPos
    const totalX =
      clickX + scrollPos - TIMELINE_OFFSET_X - TIMELINE_OFFSET_CANVAS_LEFT;

    onClick?.(totalX);
    // Here you can handle the result as needed
  };

  return (
    <div
      className="border-t border-border"
      style={{
        position: "relative",
        width: "100%",
        height: `${canvasSize.height}px`,
      }}
    >
      <canvas
        onMouseUp={handleClick}
        ref={canvasRef}
        height={canvasSize.height}
      />
    </div>
  );
};

export default Ruler;
