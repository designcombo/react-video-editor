import { interpolate } from "remotion";

export type Orientation = "horizontal" | "vertical" | "bilateral";

// Animation utility functions
export const TranslateAnimationCaption = (
  frame: number,
  orientation: Orientation = "bilateral"
) => {
  const phase1Duration = 15;
  const phase2Duration = 15;
  const totalDuration = phase1Duration + phase2Duration;
  const cycleFrame = frame % totalDuration;

  let translateX = 0;
  let translateY = 0;

  if (cycleFrame < phase1Duration) {
    const progress = cycleFrame / phase1Duration;
    if (orientation === "horizontal") {
      translateX = -40 * progress;
    } else if (orientation === "vertical") {
      translateY = -60 * progress;
    } else if (orientation === "bilateral") {
      translateX = -40 * progress;
      translateY = -60 * progress;
    }
  } else {
    const progress = (cycleFrame - phase1Duration) / phase2Duration;
    if (orientation === "horizontal") {
      translateX = -40 + 40 * progress;
    } else if (orientation === "vertical") {
      translateY = -60 + 60 * progress;
    } else if (orientation === "bilateral") {
      translateX = -40 + 40 * progress;
      translateY = -60 + 60 * progress;
    }
  }

  return { translateX, translateY };
};

export const TranslateOnceAnimation = (
  frame: number,
  duration: number = 30,
  orientation: Orientation = "horizontal"
) => {
  const clampedFrame = Math.min(frame, duration);
  const progress = clampedFrame / duration;

  let translateX = 0;
  let translateY = 0;

  if (orientation === "horizontal") {
    translateX = 100 * (1 - progress);
  } else if (orientation === "vertical") {
    translateY = 100 * (1 - progress);
  } else if (orientation === "bilateral") {
    translateX = 100 * (1 - progress);
    translateY = 100 * (1 - progress);
  }

  return { translateX, translateY };
};

export const ScaleAnimationCaption = (
  frame: number,
  to: number,
  fps: number,
  speedMultiplier: number = 10,
  direction: "min" | "max" = "max"
) => {
  const totalDuration = to / (1000 * speedMultiplier);
  const cycleFrame = Math.min(frame / fps, totalDuration);
  const progress = cycleFrame / totalDuration;

  if (direction === "min") {
    return 1 + (1.2 - 1) * (1 - progress);
  }
  return progress >= 1 ? 1 : progress;
};

export const ScaleAnimationBetween = (
  frame: number,
  to: number,
  fps: number,
  speedMultiplier: number = 10,
  minScale: number = 0.8,
  maxScale: number = 1
) => {
  const totalDuration = to / (1000 * speedMultiplier);
  const cycleFrame = Math.min(frame / fps, totalDuration);
  const progress = cycleFrame / totalDuration;
  return minScale + (maxScale - minScale) * Math.min(progress, 1);
};

export const ScalePulseAnimationCaption = (
  frame: number,
  to: number,
  fps: number
) => {
  const totalDurationSec = to / 1000;
  const currentTime = frame / fps;
  const progress = Math.min(currentTime / totalDurationSec, 1);

  if (progress <= 0.5) {
    return 1 + 0.2 * (progress / 0.5);
  }
  return 1.2 - 0.2 * ((progress - 0.5) / 0.5);
};

export const ScaleAnimationLoop = (
  frame: number,
  phase1Duration: number = 15,
  phase2Duration: number = 15
) => {
  const totalDuration = phase1Duration + phase2Duration;
  const cycleFrame = frame % totalDuration;

  if (cycleFrame < phase1Duration) {
    const progress = cycleFrame / phase1Duration;
    return 1 + 0.2 * progress;
  } else {
    const progress = (cycleFrame - phase1Duration) / phase2Duration;
    return 1.2 - 0.2 * progress;
  }
};

export const OpacityAnimationCaption = (
  frame: number,
  to: number,
  fps: number,
  speedMultiplier: number = 10
) => {
  const totalDuration = to / (1000 * speedMultiplier);
  const cycleFrame = Math.min(frame / fps, totalDuration);
  const progress = cycleFrame / totalDuration;
  return progress >= 1 ? 1 : progress;
};

// Animation configurations
export const ANIMATION_CAPTION_LIST = [
  "captionAnimation1",
  "captionAnimation4",
  "captionAnimation18",
  "captionAnimation19",
  "captionAnimation20",
  "captionAnimation21",
  "captionAnimation22",
  "captionAnimation24",
  "captionAnimation27",
  "captionAnimation28",
  "captionAnimation29",
  "captionAnimation30",
  "captionAnimation31",
  "captionAnimationKeyword13",
  "captionAnimationKeyword15",
  "captionAnimationKeyword17",
  "captionAnimationKeyword25",
  "captionAnimationKeyword39",
  "captionAnimationKeyword45",
  "captionAnimationKeyword49",
  "captionAnimationKeyword60",
  "captionAnimationKeyword65",
  "captionAnimationKeyword71",
  "captionAnimationKeyword73",
  "captionAnimationKeyword95",
  "captionAnimationKeyword96",
  "captionAnimationKeyword9",
  "captionAnimationKeyword19",
  "captionAnimationKeyword20",
  "captionAnimationKeyword21",
  "captionAnimationKeyword22",
  "captionAnimationKeyword23",
  "captionAnimationKeyword24",
  "captionAnimationKeyword28",
  "captionAnimationKeyword29",
  "captionAnimationKeyword30",
  "captionAnimationKeyword33",
  "captionAnimationKeyword34",
  "captionAnimationKeyword35",
  "captionAnimationKeyword46",
  "captionAnimationKeyword62",
  "captionAnimationKeyword63",
  "captionAnimationKeyword87",
  "captionAnimationKeyword98",
  "captionAnimationKeyword100",
  "captionAnimationKeyword101",
  "captionAnimationKeyword103",
  "captionAnimationKeyword104",
  "captionAnimationKeyword105",
  "captionAnimationKeyword107",
  "captionAnimationKeyword108"
];

export type AnimationConfig = {
  scale?: { value?: number; mode?: "min" | "max" };
  translate?: "horizontal" | "vertical" | "bilateral";
  opacity?: number;
  scalePulse?: boolean;
  scaleAnimationLoop?: boolean;
  scaleAnimationBetween?: boolean;
  translateOnceAnimation?: { duration?: number; orientation?: Orientation };
  rotateRandom?: boolean;
  rotateFixed?: number;
  globalOpacity?: number;
  extraStyles?: React.CSSProperties;
};

export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  // Scale animations
  letterHormozi: { scale: { value: undefined } },
  letterBeasty: { scale: { value: 50 } },
  captionAnimation12: { scale: { value: 50 } },

  // Translate animations
  captionAnimation4: { translate: "horizontal" },
  captionAnimation28: { translate: "vertical" },
  letterElla: { translate: "bilateral" },
  captionAnimation36: { translate: "vertical" },
  captionAnimationKeyword21: { translate: "vertical" },
  captionAnimationKeyword27: { translate: "vertical" },
  captionAnimationKeyword29: { translate: "vertical" },

  // Opacity animations
  captionAnimation2: { opacity: undefined },
  captionAnimation9: { opacity: undefined },
  captionAnimation6: { opacity: 2 },
  captionAnimation34: { opacity: 2 },
  captionAnimationKeyword6: { opacity: 2 },
  captionAnimationKeyword18: { opacity: 2 },
  captionAnimationKeyword55: { opacity: 2 },
  captionAnimationKeyword81: { opacity: 2 },
  captionAnimationKeyword88: { opacity: 2 },
  captionAnimationKeyword102: { opacity: 2 },

  // Scale loop animations
  captionAnimationKeyword15: { scaleAnimationLoop: true },
  captionAnimationKeyword22: { scaleAnimationLoop: true },

  // Scale between animations
  customAnimation1: { scaleAnimationBetween: true },

  // Translate once animations
  captionAnimationKeyword56: {
    translateOnceAnimation: { duration: 10, orientation: "vertical" }
  },
  captionAnimationKeyword58: { translateOnceAnimation: { duration: 10 } },

  // Rotate random animations
  captionAnimationKeyword2: { rotateRandom: true },
  captionAnimationKeyword64: { rotateRandom: true },
  captionAnimationKeyword66: { rotateRandom: true },
  captionAnimationKeyword68: { rotateRandom: true },
  captionAnimationKeyword70: { rotateRandom: true },
  captionAnimationKeyword73: { rotateRandom: true },
  captionAnimationKeyword78: { rotateRandom: true },
  captionAnimationKeyword85: { rotateRandom: true },
  captionAnimation37: { rotateRandom: true },
  captionAnimationKeyword51: { rotateRandom: true },
  captionAnimationKeyword53: { rotateRandom: true },
  captionAnimationKeyword57: { rotateRandom: true },

  // Global opacity
  captionAnimation11: { globalOpacity: 5 },

  // Extra styles
  captionAnimation3: {
    extraStyles: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  },
  captionAnimation33: {
    extraStyles: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  },

  // Combined animations
  captionAnimationKeyword14: { opacity: 2, scalePulse: true },
  captionAnimation25: { opacity: 2, scale: { value: 50, mode: "min" } },
  captionAnimation35: { scaleAnimationLoop: true, rotateRandom: true },
  captionAnimationKeyword71: { opacity: 2, scaleAnimationLoop: true },
  captionAnimationKeyword69: { rotateRandom: true, scaleAnimationLoop: true },
  captionAnimationKeyword75: { rotateRandom: true, scaleAnimationLoop: true },
  captionAnimationKeyword11: { scaleAnimationLoop: true, rotateRandom: true },
  captionAnimationKeyword7: { scaleAnimationLoop: true, rotateRandom: true },
  captionAnimation38: { scaleAnimationLoop: true, translate: "bilateral" },
  captionAnimationKeyword90: {
    scaleAnimationLoop: true,
    translate: "bilateral"
  },
  captionAnimationKeyword16: { rotateFixed: 10, translate: "vertical" },
  captionAnimationKeyword26: { rotateFixed: 10 },
  captionAnimationKeyword32: { scaleAnimationLoop: true, rotateRandom: true },
  captionAnimationKeyword43: {
    opacity: 2,
    translateOnceAnimation: { duration: 5 }
  },
  captionAnimationKeyword47: {
    opacity: 2,
    translateOnceAnimation: { duration: 5 }
  }
};

// Cache for rotation values
export const captionRotationCache = new Map<string, number>();
export const rotationOptions = [-10, 0, 10];
