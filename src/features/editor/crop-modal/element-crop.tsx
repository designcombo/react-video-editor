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
  aspectRatio: "free" | string;
}

const handleDirections = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export const ElementCrop: React.FC<ElementCropProps> = ({
  element,
  size,
  targetDetails,
  aspectRatio
}) => {
  const { area, setArea, scale } = useCropStore();
  const canvasPreviewRef = useRef<HTMLCanvasElement>(null);
  const lastAspectRatioRef = useRef<string | null>(null);
  let ratio: number | null = null;
  if (aspectRatio && aspectRatio !== "free") {
    const [w, h] = aspectRatio.split(":").map(Number);
    if (w > 0 && h > 0) ratio = w / h;
  }

  const { dragProps, isDragging } = usePointerDrag<{
    dirX: number;
    dirY: number;
    area: Area;
  }>({
    preventDefault: true,
    stopPropagation: true,
    onMove: ({ x, y, deltaX, deltaY, state: { dirX, dirY, area } }) => {
      const rect = canvasPreviewRef.current?.getBoundingClientRect();
      if (!rect) return;

      let newArea: Area = [...area];

      if (dirX === 0 && dirY === 0) {
        newArea[0] = clamp(
          area[0] + deltaX / (rect.width / (size.width * scale)),
          0,
          size.width * scale - area[2]
        );
        newArea[1] = clamp(
          area[1] + deltaY / (rect.height / (size.height * scale)),
          0,
          size.height * scale - area[3]
        );
      } else {
        const relativeX = clamp(
          (x - rect.left) / (rect.width / (size.width * scale)),
          0,
          size.width * scale
        );
        const relativeY = clamp(
          (y - rect.top) / (rect.height / (size.height * scale)),
          0,
          size.height * scale
        );

        const endX = area[0] + area[2];
        const endY = area[1] + area[3];

        if (dirY === -1) {
          // Resizing from top (north)
          if (ratio) {
            // Maintain aspect ratio: adjust width based on height change
            const newHeight = endY - relativeY;
            if (newHeight >= MIN_CROP_SIZE) {
              const newWidth = newHeight * ratio;
              if (
                newWidth >= MIN_CROP_SIZE &&
                newArea[0] + newWidth <= size.width * scale
              ) {
                newArea[1] = relativeY;
                newArea[3] = newHeight;
                newArea[2] = newWidth;
              }
            }
          } else {
            // Free aspect ratio
            const newHeight = endY - relativeY;
            if (newHeight >= MIN_CROP_SIZE) {
              newArea[1] = relativeY;
              newArea[3] = newHeight;
            }
          }
        } else if (dirY === 1) {
          // Resizing from bottom (south)
          if (ratio) {
            // Maintain aspect ratio: adjust width based on height change
            const newHeight = relativeY - newArea[1];
            if (newHeight >= MIN_CROP_SIZE) {
              const newWidth = newHeight * ratio;
              if (
                newWidth >= MIN_CROP_SIZE &&
                newArea[0] + newWidth <= size.width * scale
              ) {
                newArea[3] = newHeight;
                newArea[2] = newWidth;
              }
            }
          } else {
            // Free aspect ratio
            const newHeight = relativeY - newArea[1];
            if (newHeight >= MIN_CROP_SIZE) {
              newArea[3] = newHeight;
            }
          }
        }

        if (dirX === -1) {
          // Resizing from left (west)
          if (ratio) {
            // Maintain aspect ratio: adjust height based on width change
            const newWidth = endX - relativeX;
            if (newWidth >= MIN_CROP_SIZE) {
              const newHeight = newWidth / ratio;
              if (
                newHeight >= MIN_CROP_SIZE &&
                newArea[1] + newHeight <= size.height * scale
              ) {
                newArea[0] = relativeX;
                newArea[2] = newWidth;
                newArea[3] = newHeight;
              }
            }
          } else {
            // Free aspect ratio
            const newWidth = endX - relativeX;
            if (newWidth >= MIN_CROP_SIZE) {
              newArea[0] = relativeX;
              newArea[2] = newWidth;
            }
          }
        } else if (dirX === 1) {
          // Resizing from right (east)
          if (ratio) {
            // Maintain aspect ratio: adjust height based on width change
            const newWidth = relativeX - newArea[0];
            if (newWidth >= MIN_CROP_SIZE) {
              const newHeight = newWidth / ratio;
              if (
                newHeight >= MIN_CROP_SIZE &&
                newArea[1] + newHeight <= size.height * scale
              ) {
                newArea[2] = newWidth;
                newArea[3] = newHeight;
              }
            }
          } else {
            // Free aspect ratio
            const newWidth = relativeX - newArea[0];
            if (newWidth >= MIN_CROP_SIZE) {
              newArea[2] = newWidth;
            }
          }
        }
      }

      // 🔹 Ensure bounds are respected
      if (ratio) {
        // Ensure the crop area stays within bounds
        if (newArea[0] + newArea[2] > size.width * scale) {
          newArea[2] = size.width * scale - newArea[0];
          newArea[3] = newArea[2] / ratio;
        }
        if (newArea[1] + newArea[3] > size.height * scale) {
          newArea[3] = size.height * scale - newArea[1];
          newArea[2] = newArea[3] * ratio;
        }
      }

      setArea(newArea);
    }
  });
  useEffect(() => {
    let updating = true;

    const canvas = canvasPreviewRef.current;
    const context = canvas?.getContext("2d");

    const CANVAS_FRAME_TIME = 1000 / 30;
    let time = Date.now();

    const update = () => {
      if (!updating) return;

      const now = Date.now();
      let shouldDraw = true;
      if (element instanceof HTMLVideoElement) {
        shouldDraw = now - time > CANVAS_FRAME_TIME && element.readyState === 4;
      }

      if (canvas && context && shouldDraw) {
        time = now;
        context.reset();
        context.clearRect(0, 0, canvas.width, canvas.height);

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
            h
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

  // Auto-adjust crop area when aspectRatio changes
  useEffect(() => {
    if (!area || aspectRatio === "free") return;

    // Prevent infinite loop by checking if we've already processed this aspect ratio
    if (lastAspectRatioRef.current === aspectRatio) return;
    lastAspectRatioRef.current = aspectRatio;

    const [w, h] = aspectRatio.split(":").map(Number);
    if (w <= 0 || h <= 0) return;

    const ratio = w / h;
    const currentArea = [...area];

    // Calculate center of current crop area
    const centerX = currentArea[0] + currentArea[2] / 2;
    const centerY = currentArea[1] + currentArea[3] / 2;

    // Calculate new dimensions maintaining aspect ratio
    let newWidth = currentArea[2];
    let newHeight = newWidth / ratio;

    // If height is too large, adjust based on height instead
    if (newHeight > size.height * scale) {
      newHeight = size.height * scale;
      newWidth = newHeight * ratio;
    }

    // Ensure minimum size
    if (newWidth < MIN_CROP_SIZE) {
      newWidth = MIN_CROP_SIZE;
      newHeight = newWidth / ratio;
    }
    if (newHeight < MIN_CROP_SIZE) {
      newHeight = MIN_CROP_SIZE;
      newWidth = newHeight * ratio;
    }

    // Calculate new position to maintain center
    const newX = centerX - newWidth / 2;
    const newY = centerY - newHeight / 2;

    // Clamp to bounds
    const clampedX = Math.max(0, Math.min(newX, size.width * scale - newWidth));
    const clampedY = Math.max(
      0,
      Math.min(newY, size.height * scale - newHeight)
    );

    setArea([clampedX, clampedY, newWidth, newHeight]);
  }, [aspectRatio, size.width, size.height, scale]); // Removed 'area' dependency

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
            height: `${(area[3] / (size.height * scale)) * 100}%`
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
                opacity: isDragging ? 0.5 : 0
              }}
            />
            <line
              x1="60"
              y1="0"
              x2="60"
              y2="90"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: isDragging ? 0.5 : 0
              }}
            />
            <line
              x1="0"
              y1="30"
              x2="90"
              y2="30"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: isDragging ? 0.5 : 0
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
                  area
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
