import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { getRMS, processAudioFftValue } from "./audio-utils";

const makePoints: (options: {
  numberOfPoints: number;
  amplitude: number;
  offsetPixels: number;
  width: number;
}) => Array<{ x: number; y: number }> = ({
  numberOfPoints,
  amplitude,
  offsetPixels,
  width
}) => {
  const step = 1 / numberOfPoints;
  const stepOffset = offsetPixels / width;

  return Array.from({ length: numberOfPoints })
    .map((_, i, arr) => {
      const fraction = ((i - 0.5) % arr.length) * step - stepOffset;

      let x = (fraction + 1) % 1;
      x = x * width;

      let y = Math.sin(Math.abs(fraction) * Math.PI);
      // shape the wave
      y = Easing.cubic(y);
      // amplify the wave
      y = y * amplitude;
      // every other point above/below center
      y = y * Math.sin((0.5 + i) * Math.PI);

      return { x, y };
    })
    .sort((a, b) => (a.x > b.x ? 1 : -1));
};

interface BaseWaveProps {
  // how many sections the wave has
  sections?: number;
  // width of bounds
  width: number;
  // height of bounds
  height: number;
  // number of wave lines
  lines?: number;
  // width of gap between lines
  lineGap?: number;
  // string: any CSS-like color string
  // string[]: array of CSS-like color strings
  // colors will repeat if there are more lines than colors
  lineColor?: string | string[];
  // thickness of the lines
  lineThickness?: number;
  // roundness of wave peaks
  // 0-1 (default: 0.4)
  topRoundness?: number;
  // roundness of wave valleys
  // 0-1 (default: 0.4)
  bottomRoundness?: number;
}

interface WaveProps extends BaseWaveProps {
  // move the wave left or right
  offsetPixels: number;
  // big amplitude = big waveform
  amplitude: number;
}

export const Wave: React.FC<WaveProps> = ({
  sections = 12,
  offsetPixels,
  amplitude,
  width,
  height,
  lines = 2,
  lineGap = 20,
  lineColor = ["darkblue", "lightblue"],
  lineThickness = 2,
  topRoundness = 0.4,
  bottomRoundness = 0.4
}) => {
  const w = width;
  const h = height;
  const nPoints = sections;
  const off = offsetPixels % ((2 * width) / sections);

  const linePoints = Array.from({ length: lines }).map((_, i) => {
    const lineShift = i * lineGap;
    return makePoints({
      width: w,
      numberOfPoints: nPoints,
      offsetPixels: lineShift + off,
      amplitude: 0.5 * amplitude
    });
  });

  const sectionWidth = w / nPoints;
  const topControlPointDistance = topRoundness * sectionWidth;
  const bottomControlPointDistance = bottomRoundness * sectionWidth;

  const calcPt = (
    p: { x: number; y: number },
    prevP: { x: number; y: number }
  ) => {
    const isBottomPoint = p.y <= 0;

    const currPointControlDistance = isBottomPoint
      ? topControlPointDistance
      : bottomControlPointDistance;
    const prevPointControlDistance = isBottomPoint
      ? bottomControlPointDistance
      : topControlPointDistance;

    const cp1x = prevP.x + prevPointControlDistance;
    const cp1y = prevP.y;
    const cp2x = p.x - currPointControlDistance;
    const cp2y = p.y;
    const px = p.x;
    const py = p.y;

    return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${px} ${py}`;
  };

  return (
    <div style={{ width, height }}>
      <svg width={w} height={h} viewBox={`0 -${0.5 * h} ${w} ${h}`}>
        {linePoints.map((line, lineIndex) => {
          const lastP = line[line.length - 1];

          // repeat colors if there are too few
          const color = Array.isArray(lineColor)
            ? lineColor[lineIndex % lineColor.length]
            : lineColor;

          return (
            <path
              key={`line-${lineIndex}`}
              d={`M 0 0, ${line
                .map((p, i, pts) => {
                  const prevP = i === 0 ? { x: 0, y: 0 } : pts[i - 1];

                  return calcPt(p, prevP);
                })
                .join(",")}, ${calcPt({ x: w, y: 0 }, lastP)}`}
              stroke={color}
              strokeWidth={lineThickness}
              fill="none"
            />
          );
        })}
      </svg>
    </div>
  );
};

interface WaveVisualizationProps extends BaseWaveProps {
  frequencyData: number[];
  offsetPixelSpeed?: number;
  maxDb?: number;
  minDb?: number;
}

export const WaveVisualization: React.FC<WaveVisualizationProps> = ({
  frequencyData,
  width,
  height,
  offsetPixelSpeed = -200,
  maxDb,
  minDb,
  ...props
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!frequencyData) return null;

  const amplitudes = frequencyData
    .slice(0.25 * frequencyData.length)
    .map((v) => processAudioFftValue(v, { maxDb, minDb }));

  const amplitude = height * getRMS(amplitudes);
  const currentTime = frame / fps;

  return (
    <div style={{ width, height }}>
      <Wave
        width={width}
        height={height}
        offsetPixels={offsetPixelSpeed * currentTime}
        amplitude={amplitude}
        {...props}
      />
    </div>
  );
};
