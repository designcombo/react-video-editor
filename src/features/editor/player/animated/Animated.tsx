import React, { useMemo } from "react";
import { combineAnimations, useAnimation } from "./useAnimation";
import { Animation } from "./types";

export interface AnimatedProps {
  animationIn?: Animation | Animation[] | null;
  animationOut?: Animation | Animation[] | null;
  durationInFrames: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Animated: React.FC<AnimatedProps> = ({
  animationIn,
  animationOut,
  durationInFrames,
  children,
  style = {},
}) => {
  const inStyle = useAnimation(
    combineAnimations(animationIn),
    durationInFrames,
    false,
  );
  const outStyle = useAnimation(
    combineAnimations(animationOut),
    durationInFrames,
    true,
  );

  const transformStyle = style?.transform || "";
  const match = transformStyle.match(/rotate\((-?[\d.]+)deg\)/);
  const rotationValue = match ? parseFloat(match[1]) : 0;
  const resetRotationValue = -rotationValue;
  const combinedStyle = React.useMemo(() => {
    const result = { ...inStyle } as { [key: string]: any };
    Object.entries(outStyle).forEach(([key, value]) => {
      if (key === "transform") {
        result[key] = `${result[key] || ""} ${value || ""}`.trim();
      } else if (
        key in result &&
        typeof result[key] === "number" &&
        typeof value === "number"
      ) {
        result[key] = result[key] * value;
      } else {
        result[key] = value;
      }
    });
    return result as React.CSSProperties;
  }, [inStyle, outStyle]);

  const animatedTransform = useMemo(() => {
    const combinedTransform = combinedStyle.transform || "";
    const { translateX, translateY, scale, rotation } =
      extractTransformations(combinedTransform);

    return `${translateX} ${translateY} ${scale} ${rotation || `rotate(${rotationValue}deg)`}`.trim();
  }, [combinedStyle, rotationValue]);

  return (
    <div
      style={{
        transform: `rotate(${resetRotationValue}deg) scale(1)`,
      }}
    >
      <div
        style={{
          ...style,
          ...combinedStyle,
          transform: animatedTransform,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const extractTransformations = (transform: string) => {
  let translateX = "";
  let translateY = "";
  let scale = "scale(1)";
  let rotation = "";

  const translateXMatch = transform.match(/translateX\([^)]+\)/);
  if (translateXMatch) {
    translateX = translateXMatch[0];
  }

  const translateYMatch = transform.match(/translateY\([^)]+\)/);
  if (translateYMatch) {
    translateY = translateYMatch[0];
  }

  const scaleMatch = transform.match(/scale\([^)]+\)/);
  if (scaleMatch) {
    scale = scaleMatch[0];
  }

  const rotationMatch = transform.match(/rotate\([^)]+\)/);
  if (rotationMatch) {
    rotation = rotationMatch[0];
  }

  return { translateX, translateY, scale, rotation };
};

// Export a more flexible combine function
export const combine = (
  ...animations: (Animation | Animation[] | undefined)[]
): Animation[] => {
  return animations
    .flat()
    .filter((anim): anim is Animation => anim !== undefined)
    .reduce((acc, curr) => {
      const existingAnim = acc.find((a) => a.property === curr.property);
      if (existingAnim) {
        // Merge animations for the same property
        return acc.map((a) =>
          a.property === curr.property
            ? {
                ...a,
                from: Math.min(a.from, curr.from),
                to: Math.max(a.to, curr.to),
                durationInFrames: Math.max(
                  a.durationInFrames,
                  curr.durationInFrames,
                ),
                delay: Math.min(a.delay || 0, curr.delay || 0),
                ease: (t: number) => (a.ease(t) + curr.ease(t)) / 2, // Average the easing functions
              }
            : a,
        );
      } else {
        // Add new animation
        return [...acc, curr];
      }
    }, [] as Animation[]);
};
