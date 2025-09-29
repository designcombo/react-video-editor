import { interpolate } from "remotion";

export interface WordAnimationState {
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
}

export const createInterpolationHelpers = (
  currentFrame: number,
  startAtFrame: number,
  endAtFrame: number
) => {
  const interpolateScale = (from: number, to: number) => {
    return interpolate(currentFrame, [startAtFrame, endAtFrame], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
  };

  const interpolateOpacity = (from: number, to: number) => {
    return interpolate(currentFrame, [startAtFrame, endAtFrame], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp"
    });
  };

  const interpolatePulse = () => {
    const midFrame = (startAtFrame + endAtFrame) / 2;

    if (currentFrame <= midFrame) {
      return interpolate(currentFrame, [startAtFrame, midFrame], [1, 1.2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      });
    } else {
      return interpolate(currentFrame, [midFrame, endAtFrame], [1.2, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      });
    }
  };

  const handleMidFrameAnimation = (
    scaleFrom: number,
    scaleTo: number,
    opacityFrom?: number,
    opacityTo?: number
  ) => {
    const midFrame = startAtFrame + (endAtFrame - startAtFrame) / 2;
    const result: Partial<WordAnimationState> = {};

    if (currentFrame <= midFrame) {
      result.scale = interpolate(
        currentFrame,
        [startAtFrame, midFrame],
        [scaleFrom, scaleTo],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        }
      );
      if (opacityFrom !== undefined && opacityTo !== undefined) {
        result.opacity = interpolate(
          currentFrame,
          [startAtFrame, midFrame],
          [opacityFrom, opacityTo],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
          }
        );
      }
    } else {
      result.scale = interpolate(
        currentFrame,
        [midFrame, endAtFrame],
        [scaleTo, scaleFrom],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        }
      );
    }

    return result;
  };

  return {
    interpolateScale,
    interpolateOpacity,
    interpolatePulse,
    handleMidFrameAnimation
  };
};

export const createAnimationFunctions = (
  currentFrame: number,
  startAtFrame: number,
  endAtFrame: number
) => {
  const {
    interpolateScale,
    interpolateOpacity,
    interpolatePulse,
    handleMidFrameAnimation
  } = createInterpolationHelpers(currentFrame, startAtFrame, endAtFrame);

  const fadeIn = (from: number = 0, to: number = 1) => ({
    opacity: interpolateOpacity(from, to)
  });

  const scaleAnim = (from: number, to: number = 1) => ({
    scale: interpolateScale(from, to)
  });

  const translateXAnim = (from: number, to: number = 0) => ({
    translateX: interpolateScale(from, to)
  });

  const translateYAnim = (
    from: number,
    to: number,
    easing?: (t: number) => number
  ) => ({
    translateY: interpolate(
      currentFrame,
      [startAtFrame, endAtFrame],
      [from, to],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easing || ((t) => t)
      }
    )
  });

  const midFrameAnim = (
    scaleFrom: number,
    scaleTo: number,
    opacityFrom?: number,
    opacityTo?: number
  ) => handleMidFrameAnimation(scaleFrom, scaleTo, opacityFrom, opacityTo);

  const pulseAnim = () => ({
    scale: interpolatePulse()
  });

  return {
    fadeIn,
    scaleAnim,
    translateXAnim,
    translateYAnim,
    midFrameAnim,
    pulseAnim
  };
};

export const ANIMATION_CONFIGS: Record<
  string,
  (
    helpers: ReturnType<typeof createAnimationFunctions>
  ) => Partial<WordAnimationState>
> = {
  captionAnimation5: ({ fadeIn }) => fadeIn(0.7),
  captionAnimation7: ({ scaleAnim }) => scaleAnim(0),
  captionAnimation13: ({ scaleAnim }) => scaleAnim(0),
  captionAnimation14: ({ scaleAnim }) => scaleAnim(0.8),
  captionAnimation22: ({ scaleAnim }) => scaleAnim(0.8),
  captionAnimation23: ({ scaleAnim, translateXAnim, translateYAnim }) => ({
    scale: scaleAnim(1.2, 1).scale,
    translateX: translateXAnim(0, 10).translateX,
    translateY: translateYAnim(0, 10, (t) => t * t).translateY
  }),
  captionAnimation11: () => ({ opacity: 0 }),
  captionAnimation18: ({ fadeIn }) => fadeIn(0.5),
  captionAnimation27: ({ scaleAnim }) => scaleAnim(1.4, 1),

  // Fade-in animations
  letteeTracy: ({ fadeIn }) => fadeIn(),
  captionAnimation15: ({ fadeIn }) => fadeIn(),
  captionAnimation20: ({ fadeIn }) => fadeIn(),
  captionAnimation30: ({ fadeIn }) => fadeIn(),
  captionAnimation33: ({ fadeIn }) => fadeIn(),
  captionAnimation62: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword8: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword10: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword17: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword37: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword41: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword44: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword76: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword79: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword82: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword86: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword93: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword94: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword97: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword99: ({ fadeIn }) => fadeIn(),
  captionAnimationKeyword106: ({ fadeIn }) => fadeIn(),

  // Combined animations
  captionAnimationKeyword77: ({ fadeIn, translateXAnim }) => ({
    ...fadeIn(),
    ...translateXAnim(30, 0)
  }),
  captionAnimationKeyword85: ({ fadeIn, translateXAnim }) => ({
    ...fadeIn(),
    ...translateXAnim(30, 0)
  }),
  captionAnimationKeyword24: ({ midFrameAnim }) => midFrameAnim(1, 1.2),
  captionAnimationKeyword30: ({ midFrameAnim }) => midFrameAnim(1, 1.2),
  captionAnimationKeyword34: ({ fadeIn, midFrameAnim }) => ({
    ...fadeIn(),
    ...midFrameAnim(1, 1.2)
  }),
  captionAnimationKeyword38: ({ midFrameAnim }) => midFrameAnim(1, 1.2, 0, 1),
  captionAnimationKeyword95: ({ midFrameAnim }) => midFrameAnim(1, 1.2, 0, 1),
  captionAnimationKeyword89: ({ midFrameAnim }) => midFrameAnim(0, 1.2, 0, 1)
};

export const ANIMATION_FUNCTIONS: Record<
  string,
  (
    helpers: ReturnType<typeof createAnimationFunctions>
  ) => Partial<WordAnimationState>
> = {
  none: () => ({}),
  "fade-in-full": ({ fadeIn }) => fadeIn(),
  "fade-in-partial-05": ({ fadeIn }) => fadeIn(0.5),
  "fade-in-partial-07": ({ fadeIn }) => fadeIn(0.7),
  "scale-up-0": ({ scaleAnim }) => scaleAnim(0),
  "scale-up-08": ({ scaleAnim }) => scaleAnim(0.8),
  "scale-down-12": ({ scaleAnim }) => scaleAnim(1.2),
  "scale-down-14": ({ scaleAnim }) => scaleAnim(1.4),
  "translate-x": ({ translateXAnim }) => translateXAnim(30, 0),
  "translate-y": ({ translateYAnim }) => translateYAnim(0, 10, (t) => t * t),
  jump: ({ scaleAnim, translateXAnim }) => ({
    ...scaleAnim(0.8),
    ...translateXAnim(30, 0)
  }),
  pulse: ({ pulseAnim }) => pulseAnim()
};
