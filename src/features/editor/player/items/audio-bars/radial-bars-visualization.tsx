import { CSSProperties } from "react";
import { getBars } from "./bars-visualization";

interface BaseRadialBarsProps {
  innerRadius: number;
  lineThickness?: number;
  barOrigin?: "outer" | "inner" | "middle";
  roundness?: number;
  color?: CSSProperties["color"];
  maxAmplitude?: number;
}

interface RadialBarsProps extends BaseRadialBarsProps {
  values: number[];
  radius: number;
}

export const RadialBars: React.FC<RadialBarsProps> = ({
  values,
  radius,
  lineThickness,
  roundness,
  barOrigin,
  color,
  maxAmplitude = 1,
  innerRadius
}) => {
  if (!values || values.length === 0) {
    return null;
  }

  const diameter = 2 * radius;

  return (
    <div style={{ width: diameter, height: diameter }}>
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        {values.map((v, i) => {
          const barHeight = (v * (radius - innerRadius)) / maxAmplitude;
          const x = radius;
          const y =
            barOrigin === "outer"
              ? radius - barHeight
              : barOrigin === "inner"
                ? radius
                : radius - 0.5 * barHeight;
          const yOffset =
            barOrigin === "outer"
              ? radius
              : barOrigin === "inner"
                ? innerRadius
                : radius - 0.5 * (radius - innerRadius);

          const transform = `rotate(${
            (360 * i) / values.length
          } ${radius} ${radius}) translate(0 ${yOffset})`;

          return (
            <rect
              key={i}
              fill={color}
              x={x}
              y={y}
              width={lineThickness}
              height={barHeight}
              rx={roundness}
              transform={transform}
            />
          );
        })}
      </svg>
    </div>
  );
};

interface RadialBarsVisualizationProps extends BaseRadialBarsProps {
  frequencyData: number[];
  maxDb?: number;
  minDb?: number;
  diameter: number;
  gapSize?: number;
}

export const RadialBarsVisualization: React.FC<
  RadialBarsVisualizationProps
> = ({
  frequencyData,
  maxDb,
  minDb,
  diameter,
  lineThickness = 8,
  roundness = 4,
  barOrigin = "inner",
  color = "white",
  maxAmplitude,
  innerRadius = 0,
  gapSize = 4
}) => {
  const radius = 0.5 * diameter;

  const bars = getBars({
    totalWidth: 2 * Math.PI * innerRadius,
    itemWidth: lineThickness + gapSize,
    frequencyData,
    maxDb,
    minDb
  });

  const highpass = bars.slice(Math.floor(0.5 * bars.length));

  const amplitudes = [...highpass, ...highpass.slice().reverse()];

  return (
    <RadialBars
      values={amplitudes}
      radius={radius}
      lineThickness={lineThickness}
      roundness={roundness}
      barOrigin={barOrigin}
      color={color}
      maxAmplitude={maxAmplitude}
      innerRadius={innerRadius}
    />
  );
};
