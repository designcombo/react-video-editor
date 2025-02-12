import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Animation } from "./types";

type PropertyHandler = (value: number) => React.CSSProperties;

const createPropertyHandler = (): Record<string, PropertyHandler> => ({
  scale: (value: number) => ({ transform: `scale(${value})` }),
  opacity: (value: number) => ({ opacity: value }),
  translateX: (value: number) => ({ transform: `translateX(${value}px)` }),
  translateY: (value: number) => ({ transform: `translateY(${value}px)` }),
  rotate: (value: number) => ({ transform: `rotate(${value}deg)` }),
  default: () => ({}),
  rotateY: (value: number) => ({ transform: `rotateY(${value}deg)` }),
});

const interpolateValue = (
  frame: number,
  animation: Animation,
  durationInFrames: number,
  isOut: boolean = false,
): number => {
  const { from, to, ease } = animation;
  const animationDurationInFrames = animation.durationInFrames || 30;

  const safeFrom = Number(from);
  const safeTo = Number(to);
  const safeDuration = Math.max(1, Number(animationDurationInFrames || 1));

  if (isNaN(safeFrom) || isNaN(safeTo)) {
    console.error("Invalid animation values:", {
      from,
      to,
      animationDurationInFrames,
      property: animation.property,
    });
    return safeFrom;
  }

  if (animationDurationInFrames === undefined) {
    console.warn(
      `durationInFrames is undefined for animation: ${animation.property}. Using 1 frame as default.`,
    );
  }

  const inputRange = isOut
    ? [durationInFrames - animationDurationInFrames, durationInFrames]
    : [0, safeDuration];

  return interpolate(frame, inputRange, [safeFrom, safeTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};
const calculateStyle = (
  animation: Animation,
  frame: number,
  durationInFrames: number,
  isOut: boolean,
): React.CSSProperties => {
  const { property, durationInFrames: animationDurationInFrames } = animation;
  if (!isOut && frame > animationDurationInFrames) return {};
  // const adjustedFrame = frame - startFrame;
  const value = interpolateValue(frame, animation, durationInFrames, isOut);
  const propertyHandler = createPropertyHandler();
  return (propertyHandler[property] || propertyHandler.default)(value);
};

export const useAnimation = (
  animations: Animation[],
  durationInFrames: number,
  isOut: boolean = false,
): React.CSSProperties => {
  const frame = useCurrentFrame();

  return React.useMemo(() => {
    if (animations.length === 0) return {};

    // Filter out invalid animations at the start
    const validAnimations = animations.filter(
      (anim) => anim.from !== undefined && anim.to !== undefined,
    );
    if (validAnimations.length !== animations.length) {
      console.error("Some animations are invalid and will be ignored");
    }

    const animationArray = validAnimations.map((anim) =>
      calculateStyle(anim, frame, durationInFrames, isOut),
    );

    return animationArray.reduce(
      (acc: React.CSSProperties, style: React.CSSProperties) => {
        Object.keys(style).forEach((key) => {
          if (key === "transform") {
            acc[key] = acc[key] ? `${acc[key]} ${style[key]}` : style[key];
          } else {
            acc[key as "transform"] = style[key as "transform"];
          }
        });
        return acc;
      },
      {},
    );
  }, [animations, frame, durationInFrames, isOut]);
};

export const combineAnimations = (
  animations: Animation | Animation[] | undefined | null,
): Animation[] => {
  if (!animations) return [];
  return Array.isArray(animations) ? animations : [animations];
};
