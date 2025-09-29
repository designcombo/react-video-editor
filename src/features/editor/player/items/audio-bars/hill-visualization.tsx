import React from "react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { random, useCurrentFrame } from "remotion";
import { processAudioFftValue } from "./audio-utils";

const rotate = <T extends unknown>(arr: T[], shift: number) => {
  if (!shift || shift === arr.length) return [...arr];
  const n = shift % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
};

const getHills = ({
  numberOfBumps = 8,
  frequencyData,
  maxDb = -30,
  minDb = -80
}: {
  numberOfBumps?: number;
  frequencyData: number[];
  maxDb?: number;
  minDb?: number;
}) => {
  const nPoints = numberOfBumps;

  const start = Math.floor(0.2 * frequencyData.length);
  const end = Math.floor(0.6 * frequencyData.length);
  const samples = frequencyData.slice(start, end);
  const sampleStep = Math.floor(samples.length / nPoints);
  const amplitudes = Array.from({ length: nPoints }).map((_, i) => {
    const processed = processAudioFftValue(
      samples[(i * sampleStep) % samples.length],
      { maxDb, minDb }
    );

    return processed;
  });

  return amplitudes;
};

interface HillsProps {
  values: number[];
  width?: number;
  height?: number;
  fillColor?: CSSProperties["fill"] | Array<CSSProperties["fill"]>;
  strokeWidth?: number;
  strokeColor?: CSSProperties["stroke"] | Array<CSSProperties["stroke"]>;
  blendMode?: CSSProperties["mixBlendMode"];
  placement?: "over" | "under" | "middle";
  copies?: number;
}

export const Hills: React.FC<HillsProps> = ({
  values,
  width = 400,
  height = 100,
  fillColor = "none",
  strokeWidth = 2,
  strokeColor = "none",
  placement = "middle",
  copies = 1,
  blendMode = "normal"
}) => {
  const w = width;
  const h = height;

  if (!values || values.length === 0) {
    return null;
  }

  const { scaling, viewBoxVerticalShift } =
    placement === "over"
      ? {
          viewBoxVerticalShift: -h,
          scaling: 1
        }
      : placement === "under"
        ? {
            viewBoxVerticalShift: 0,
            scaling: 1
          }
        : {
            viewBoxVerticalShift: -0.5 * h,
            scaling: 0.5
          };

  const pad = 0.15;
  const padWidth = pad * w;
  const stepSize = (w - 2 * padWidth) / (values.length - 1);
  const lines = Array.from({ length: copies }).map((_, lineIndex) => {
    const shift = 3 * lineIndex;
    const lineValues = rotate(values, shift);
    return lineValues.map((v, i) => ({
      x: padWidth + i * stepSize,
      y: scaling * h * v * (1.2 - 0.5 * random(lineIndex * values.length + i))
    }));
  });

  return (
    <div style={{ width, height }}>
      <svg width={w} height={h} viewBox={`0 ${viewBoxVerticalShift} ${w} ${h}`}>
        {lines.map((line, lineIndex) => {
          const lastP = line[line.length - 1];

          // repeat colors if there are too few
          const _strokeColor = Array.isArray(strokeColor)
            ? strokeColor[lineIndex % strokeColor.length]
            : strokeColor;
          const _fillColor = Array.isArray(fillColor)
            ? fillColor[lineIndex % fillColor.length]
            : fillColor;

          const pathProps = {
            stroke: _strokeColor,
            strokeWidth,
            fill: _fillColor,
            style: {
              mixBlendMode: blendMode
            }
          };
          return (
            <React.Fragment key={lineIndex}>
              {placement !== "over" && (
                <path
                  {...pathProps}
                  d={`M 0 0, ${line
                    .map((p, i, pts) => {
                      const prevP = i === 0 ? { x: 0, y: 0 } : pts[i - 1];

                      const cp1x = prevP.x + 0.5 * stepSize;
                      const cp1y = prevP.y;
                      const cp2x = p.x - 0.5 * stepSize;
                      const cp2y = p.y;
                      const px = p.x;
                      const py = p.y;
                      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${px} ${py}`;
                    })
                    .join(",")}, C ${lastP.x + 0.5 * stepSize} ${lastP.y}, ${
                    w - 0.5 * stepSize
                  } 0, ${w} 0`}
                />
              )}
              {placement !== "under" && (
                <path
                  {...pathProps}
                  d={`M 0 0, ${line
                    .map((p, i, pts) => {
                      const prevP = i === 0 ? { x: 0, y: 0 } : pts[i - 1];

                      const cp1x = prevP.x + 0.5 * stepSize;
                      const cp1y = -prevP.y;
                      const cp2x = p.x - 0.5 * stepSize;
                      const cp2y = -p.y;
                      const px = p.x;
                      const py = -p.y;
                      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${px} ${py}`;
                    })
                    .join(",")}, C ${lastP.x + 0.5 * stepSize} ${-lastP.y}, ${
                    w - 0.5 * stepSize
                  } 0, ${w} 0`}
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export const HillsVisualization: React.FC<
  Omit<HillsProps, "values"> & {
    frequencyData: number[];
    maxDb?: number;
    minDb?: number;
  }
> = ({
  width,
  height,
  frequencyData,
  strokeColor,
  fillColor,
  copies,
  blendMode,
  strokeWidth,
  maxDb,
  minDb
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const [size, setSize] = useState({ width: 400, height: 100 });

  useEffect(() => {
    setSize((sz) => ({
      width: containerRef.current?.offsetWidth ?? sz.width,
      height: containerRef.current?.offsetHeight ?? sz.height
    }));
  }, [frame, setSize]);

  const { width: w, height: h } = size;

  if (!frequencyData) return null;

  const amplitudes = getHills({ frequencyData, minDb, maxDb });

  return (
    <div ref={containerRef} style={{ width, height }}>
      <Hills
        values={amplitudes}
        width={w}
        height={h}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        copies={copies}
        blendMode={blendMode}
      />
    </div>
  );
};
