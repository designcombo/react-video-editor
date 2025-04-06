import React, { useEffect, useRef } from "react";
import { usePointerDrag } from "../hooks/use-pointer-drag";
import { Area } from "../interfaces/editor";
import useCropStore from "../store/use-crop-store";
import { clamp } from "../utils/math";
import { ITrackItemBase } from "@designcombo/types";

const MIN_CROP_SIZE = 100;

interface ElementCropProps {
  element: HTMLVideoElement | HTMLImageElement;
  size: {
    width: number;
    height: number;
  };
  targetDetails: ITrackItemBase["details"];
}

const handleDirections = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export const ElementCrop: React.FC<ElementCropProps> = ({
  element,
  size,
  targetDetails,
}) => {
  const { area, setArea, scale } = useCropStore();
  const canvasPreviewRef = useRef<HTMLCanvasElement>(null);

  const { dragProps, isDragging } = usePointerDrag<{
    dirX: number;
    dirY: number;
    area: Area;
  }>({
    preventDefault: true,
    stopPropagation: true,
    onMove: ({ x, y, deltaX, deltaY, state: { dirX, dirY, area } }) => {
      const rect = canvasPreviewRef.current!.getBoundingClientRect();

      const newArea: Area = [...area];

      if (dirX === 0 && dirY === 0) {
        newArea[0] = clamp(
          area[0] + deltaX / (rect.width / (size.width * scale)),
          0,
          size.width * scale - area[2],
        );
        newArea[1] = clamp(
          area[1] + deltaY / (rect.height / (size.height * scale)),
          0,
          size.height * scale - area[3],
        );
      } else {
        const relativeX = clamp(
          (x - rect.left) / (rect.width / (size.width * scale)),
          0,
          size.width * scale,
        );
        const relativeY = clamp(
          (y - rect.top) / (rect.height / (size.height * scale)),
          0,
          size.height * scale,
        );

        const endX = area[0] + area[2];
        const endY = area[1] + area[3];

        if (dirY === -1) {
          newArea[1] = Math.min(relativeY, Math.max(endY - MIN_CROP_SIZE, 0));
          newArea[3] = endY - newArea[1];
        } else if (dirY === 1) {
          newArea[3] = Math.max(
            relativeY - newArea[1],
            Math.min(MIN_CROP_SIZE, size.height * scale),
          );
        }

        if (dirX === -1) {
          newArea[0] = Math.min(relativeX, Math.max(endX - MIN_CROP_SIZE, 0));
          newArea[2] = endX - newArea[0];
        } else if (dirX === 1) {
          newArea[2] = Math.max(
            relativeX - newArea[0],
            Math.min(MIN_CROP_SIZE, size.width * scale),
          );
        }
      }

      setArea(newArea);
    },
  });
  useEffect(() => {
    let updating = true;

    const canvas = canvasPreviewRef.current;
    const context = canvas?.getContext("2d");

    const CANVAS_FRAME_TIME = 1000 / 30;
    let time = Date.now();

    const update = () => {
      if (!updating) {
        return;
      }

      const now = Date.now();
      let shouldDraw = true;
      // if element is instace of HTMLVideoElement
      if (element instanceof HTMLVideoElement) {
        shouldDraw = now - time > CANVAS_FRAME_TIME && element.readyState === 4;
      }

      if (canvas && context && shouldDraw) {
        time = now;
        context.reset();
        context.clearRect(0, 0, canvas.width, canvas.height);

        // const area = transform.area!;
        const area = useCropStore.getState().area;

        if (!area) {
          context.drawImage(element, 0, 0, canvas.width, canvas.height);
        } else {
          context.filter = "brightness(0.25)";
          context.drawImage(element, 0, 0, canvas.width, canvas.height);

          const x = area[0] * ((size.width * scale) / canvas.width);
          const y = area[1] * ((size.height * scale) / canvas.height);
          const w = area[2] * ((size.width * scale) / canvas.width);
          const h = area[3] * ((size.height * scale) / canvas.height);

          context.filter = "none";

          context.drawImage(
            element,
            x / scale,
            y / scale,
            w / scale,
            h / scale,
            x,
            y,
            w,
            h,
          );
        }
      }
      requestAnimationFrame(update);
    };
    const widthTotal = area[2];
    const scaleWidth = targetDetails.width / widthTotal;
    const areaPosX = (targetDetails.crop?.x || 0) / scaleWidth;
    const areaPosY = (targetDetails.crop?.y || 0) / scaleWidth;
    const areaWidth =
      (targetDetails.crop?.width || targetDetails.width) / scaleWidth;
    const areaHeight =
      (targetDetails.crop?.height || targetDetails.height) / scaleWidth;
    setArea([areaPosX, areaPosY, areaWidth, areaHeight]);

    requestAnimationFrame(update);

    return () => {
      updating = false;
    };
  }, [element]);

  return (
    <div className="flex">
      <div className={"crop"}>
        <canvas
          width={size.width * scale}
          height={size.height * scale}
          className={"videoPreview"}
          ref={canvasPreviewRef}
        />
        <div
          className={"box"}
          style={{
            left: `${(area[0] / (size.width * scale)) * 100}%`,
            top: `${(area[1] / (size.height * scale)) * 100}%`,
            width: `${(area[2] / (size.width * scale)) * 100}%`,
            height: `${(area[3] / (size.height * scale)) * 100}%`,
          }}
        >
          <svg
            viewBox="0 0 90 90"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            {...dragProps({ dirX: 0, dirY: 0, area })}
          >
            <line
              x1="30"
              y1="0"
              x2="30"
              y2="90"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: isDragging ? 0.5 : 0,
              }}
            />
            <line
              x1="60"
              y1="0"
              x2="60"
              y2="90"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: isDragging ? 0.5 : 0,
              }}
            />
            <line
              x1="0"
              y1="30"
              x2="90"
              y2="30"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: isDragging ? 0.5 : 0,
              }}
            />
          </svg>
          <div className={"handles"}>
            {handleDirections.map((direction) => (
              <div
                key={direction}
                className={`handle-${direction}`}
                style={{ cursor: `${direction}-resize` }}
                {...dragProps({
                  dirX: direction.includes("e")
                    ? 1
                    : direction.includes("w")
                      ? -1
                      : 0,
                  dirY: direction.includes("s")
                    ? 1
                    : direction.includes("n")
                      ? -1
                      : 0,
                  area,
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
