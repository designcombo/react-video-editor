import { CSSProperties, useEffect, useRef, useState } from "react";
import { useCurrentFrame } from "remotion";
import { processAudioFftValue } from "./audio-utils";

export const getBars = ({
  totalWidth,
  itemWidth,
  frequencyData,
  maxDb = -50,
  minDb = -80
}: {
  totalWidth: number;
  itemWidth: number;
  frequencyData: number[];
  maxDb?: number;
  minDb?: number;
}) => {
  const nBars = Math.floor(totalWidth / itemWidth);
  const samples = frequencyData;
  const sampleStep = Math.floor(samples.length / nBars);

  const bars = Array.from({ length: nBars }).map((_, i) => {
    const processed = processAudioFftValue(
      samples[(i * sampleStep) % samples.length],
      { maxDb, minDb }
    );

    return Math.log(1 + processed);
  });

  return bars;
};

interface BarsProps {
  values: number[];
  width?: number;
  height?: number;
  lineThickness?: number;
  gapSize?: number;
  roundness?: number;
  placement?: "over" | "under" | "middle";
  color?: CSSProperties["color"];
  maxAmplitude?: number;
}

const Bars: React.FC<BarsProps> = ({
  values,
  width = 400,
  height = 100,
  lineThickness = 8,
  gapSize = 8,
  roundness = 4,
  placement = "middle",
  color = "white",
  maxAmplitude = 1
}) => {
  const w = width;
  const h = height;

  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div style={{ width, height }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {values.map((v, i) => {
          const barHeight = (v * h) / maxAmplitude;
          const x = i * (lineThickness + gapSize);
          const y =
            placement === "over"
              ? 0
              : placement === "under"
                ? h - barHeight
                : 0.5 * (h - barHeight);

          return (
            <rect
              key={i}
              fill={color}
              x={x || 0}
              y={y || 0}
              width={lineThickness || 0}
              height={barHeight || 0}
              rx={roundness || 0}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const BarsVisualization: React.FC<
  Omit<BarsProps, "values"> & {
    frequencyData: number[];
    maxDb?: number;
    minDb?: number;
  }
> = ({
  width,
  height,
  frequencyData,
  lineThickness = 4,
  gapSize = 6,
  roundness = 2,
  color = "white",
  placement = "middle",
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

  const amplitudes = getBars({
    totalWidth: w,
    itemWidth: lineThickness + gapSize,
    frequencyData,
    maxDb,
    minDb
  });

  return (
    <div ref={containerRef} style={{ width, height }}>
      <Bars
        width={w}
        height={h}
        values={amplitudes}
        lineThickness={lineThickness}
        gapSize={gapSize}
        roundness={roundness}
        color={color}
        placement={placement}
      />
    </div>
  );
};
