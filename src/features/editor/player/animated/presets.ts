import { Easing } from "remotion";
import { Animation } from "./types";

// Define preset names
export type PresetName =
  | "fadeIn"
  | "fadeOut"
  | "scaleIn"
  | "scaleOut"
  | "slideInRight"
  | "slideInLeft"
  | "slideInTop"
  | "slideInBottom"
  | "slideOutRight"
  | "slideOutLeft"
  | "slideOutTop"
  | "slideOutBottom"
  | "rotateIn"
  | "flipIn"
  | "shakeHorizontalIn"
  | "shakeVerticalIn"
  | "shakeHorizontalOut"
  | "shakeVerticalOut"
  | "typeWriterIn"
  | "typeWriterOut"
  | "animatedTextIn"
  | "sunnyMorningsAnimationIn"
  | "dominoDreamsIn"
  // | "thursdayIn"
  | "greatThinkersAnimationIn"
  | "beautifulQuestionsAnimationIn"
  | "madeWithLoveAnimationIn"
  // | "risingStrongAnimationIn"
  | "realityIsBrokenAnimationIn"
  | "animatedTextOut"
  | "sunnyMorningsAnimationOut"
  | "dominoDreamsAnimationOut"
  | "beautifulQuestionsAnimationOut"
  | "madeWithLoveAnimationOut"
  | "realityIsBrokenAnimationOut"
  | "greatThinkersAnimationOut"
  | "vogueAnimationLoop"
  | "dragonFlyAnimationLoop"
  | "billboardAnimationLoop"
  | "descompressAnimationIn"
  | "dropAnimationIn"
  | "dropAnimationOut"
  | "descompressAnimationOut"
  | "heartbeatAnimationLoop"
  | "spinAnimationLoop"
  | "waveAnimationLoop"
  | "rotate3dAnimationLoop"
  | "shakeTextAnimationLoop"
  | "shakyLettersTextAnimationLoop"
  | "vintageAnimationLoop"
  | "textFontChangeAnimationLoop"
  | "pulseAnimationLoop"
  | "glitchAnimationLoop"
  | "countDownAnimationIn"
  | "soundWaveIn"
  | "backgroundAnimationOut"
  | "backgroundAnimationIn";

// Type-safe preset object
export const presets: Record<PresetName, Animation> = {
  pulseAnimationLoop: {
    property: "pulseTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Pulse Animation Loop"
  },
  glitchAnimationLoop: {
    property: "glitchTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Glitch Animation Loop"
  },
  countDownAnimationIn: {
    property: "countDownTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Count Down Animation In"
  },
  soundWaveIn: {
    property: "soundWaveTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Sound Wave Animation In"
  },
  backgroundAnimationOut: {
    property: "backgroundTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Background Animation Out"
  },
  backgroundAnimationIn: {
    property: "backgroundTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Background Animation In"
  },
  textFontChangeAnimationLoop: {
    property: "textFontChangeAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Font Change Animation Loop",
    details: {
      fonts: [
        {
          fontFamily: "Bangers-Regular",
          url: "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf"
        },
        {
          fontFamily: "AnonymousPro-BoldItalic",
          url: "https://fonts.gstatic.com/s/anonymouspro/v14/rP2ap2a15UIB7Un-bOeISG3pHl4OTCzc6IG30KqB9Q.ttf"
        },
        {
          fontFamily: "Frijole",
          url: "https://fonts.gstatic.com/s/frijole/v9/uU9PCBUR8oakM2BQ7xPb3vyHmlI.ttf"
        },
        {
          fontFamily: "Bangers-Regular",
          url: "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf"
        },
        {
          fontFamily: "Allura-Regular",
          url: "https://fonts.gstatic.com/s/allura/v15/9oRPNYsQpS4zjuAPjAIXPtrrGA.ttf"
        }
      ]
    }
  },
  vintageAnimationLoop: {
    property: "vintageTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Vintage Animation Loop"
  },
  shakyLettersTextAnimationLoop: {
    property: "shakyLettersTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Shaky Letters Animation Loop"
  },
  shakeTextAnimationLoop: {
    property: "shakeTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Shake Text Animation Loop"
  },
  rotate3dAnimationLoop: {
    property: "rotate3dTextAnimationLoop",
    from: 0,
    to: 360,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Rotate 3D Animation Loop"
  },
  heartbeatAnimationLoop: {
    property: "heartbeatTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Heartbeat Animation Loop"
  },
  spinAnimationLoop: {
    property: "spinTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Spin Animation Loop"
  },
  waveAnimationLoop: {
    property: "waveTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Wave Animation Loop"
  },
  descompressAnimationIn: {
    property: "descompressTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Descompress Animation In"
  },
  dropAnimationIn: {
    property: "dropTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Drop Animation In"
  },
  dropAnimationOut: {
    property: "dropTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Drop Animation Out"
  },
  descompressAnimationOut: {
    property: "descompressTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Descompress Animation Out"
  },
  vogueAnimationLoop: {
    property: "vogueTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Vogue Animation Loop"
  },
  dragonFlyAnimationLoop: {
    property: "dragonFlyTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Dragon Fly Animation Loop"
  },
  billboardAnimationLoop: {
    property: "billboardTextAnimationLoop",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Billboard Animation Loop"
  },
  typeWriterOut: {
    property: "typeWriterTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Type Writer"
  },
  greatThinkersAnimationOut: {
    property: "greatThinkersTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/great-thinker-out.webp",
    name: "Great Thinkers"
  },
  realityIsBrokenAnimationOut: {
    property: "realityIsBrokenTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/realisty-is-broken-out.webp",
    name: "Reality is Broken"
  },
  madeWithLoveAnimationOut: {
    property: "madeWithLoveTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/made-with-love-out.webp",
    name: "Made With Love"
  },
  realityIsBrokenAnimationIn: {
    property: "realityIsBrokenTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/reality-is-broken-in.webp",
    name: "Reality is Broken"
  },
  beautifulQuestionsAnimationOut: {
    property: "beautifulQuestionsTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/beatiful-question-out.webp",
    name: "Beautiful Questions"
  },
  animatedTextOut: {
    property: "animatedTextOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/animated-text-out.webp",
    name: "Animated Text"
  },
  sunnyMorningsAnimationOut: {
    property: "sunnyMorningsTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/sunny-mornings-out.webp",
    name: "Sunny Mornings"
  },
  dominoDreamsAnimationOut: {
    property: "dominoDreamsTextAnimationOut",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/domino-dreams-out.webp",
    name: "Domino Dreams"
  },
  madeWithLoveAnimationIn: {
    property: "madeWithLoveTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/made-with-love-in.webp",
    name: "Made With Love"
  },
  beautifulQuestionsAnimationIn: {
    property: "beautifulQuestionsTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl:
      "https://cdn.designcombo.dev/animations/beautiful-questions-in.webp",
    name: "Beatiful Questions"
  },
  greatThinkersAnimationIn: {
    property: "greatThinkersTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/great-thinker-in.webp",
    name: "Great Thinkers"
  },
  // thursdayIn: {
  //   property: "textThursday",
  //   from: 0,
  //   to: 1,
  //   durationInFrames: 30,
  //   ease: Easing.linear,
  //   previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
  //   name: "TextThursday"
  // },
  dominoDreamsIn: {
    property: "dominoDreamsTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/domino-dreams-in.webp",
    name: "Domino Dreams"
  },
  typeWriterIn: {
    property: "typeWriterTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Type Writer"
  },
  animatedTextIn: {
    property: "animatedTextIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/animated-text-in.webp",
    name: "Animated Text"
  },
  sunnyMorningsAnimationIn: {
    property: "sunnyMorningsTextAnimationIn",
    from: 0,
    to: 1,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/sunny-mornings-in.webp",
    name: "Sunny Mornings"
  },
  shakeHorizontalOut: {
    property: "shakeHorizontalOut",
    from: 0,
    to: -0,
    durationInFrames: 30,
    ease: Easing.elastic(1),
    previewUrl:
      "https://cdn.designcombo.dev/animations/ShakeHorizontalOut.webp",
    name: "Shake Horizontal"
  },

  shakeVerticalOut: {
    property: "shakeVerticalOut",
    from: 0,
    to: -0,
    durationInFrames: 30,
    ease: Easing.elastic(1),
    previewUrl: "https://cdn.designcombo.dev/animations/ShakeVerticalOut.webp",
    name: "Shake Vertical"
  },

  shakeHorizontalIn: {
    property: "shakeHorizontalIn",
    from: 0,
    to: -0,
    durationInFrames: 30,
    ease: Easing.elastic(1),
    previewUrl: "https://cdn.designcombo.dev/animations/ShakeHorizontalIn.webp",
    name: "Shake Horizontal"
  },

  shakeVerticalIn: {
    property: "shakeVerticalIn",
    from: 0,
    to: -0,
    durationInFrames: 30,
    ease: Easing.elastic(1),
    previewUrl: "https://cdn.designcombo.dev/animations/ShakeVerticalIn.webp",
    name: "Shake Vertical"
  },

  rotateIn: {
    property: "rotate",
    from: 0,
    to: 360,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Rotate"
  },

  flipIn: {
    property: "rotateY",
    from: -90,
    to: 0,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/flipIn.webp",
    name: "Flip"
  },

  fadeIn: {
    property: "opacity",
    from: 0,
    to: 1,
    durationInFrames: 15,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/FadeIn.webp",
    name: "Fade"
  },

  fadeOut: {
    property: "opacity",
    from: 1,
    to: 0,
    durationInFrames: 15,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/FadeOut.webp",
    name: "Fade"
  },

  scaleIn: {
    property: "scale",
    from: 0,
    to: 1,
    durationInFrames: 15,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/ScaleIn.webp",
    name: "Scale"
  },

  scaleOut: {
    property: "scale",
    from: 1,
    to: 0,
    durationInFrames: 15,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/ScaleOut.webp",
    name: "Scale"
  },

  slideInRight: {
    property: "translateX",
    from: -900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInRight.webp",
    name: "Slide Right"
  },

  slideInLeft: {
    property: "translateX",
    from: 900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInLeft.webp",
    name: "Slide Left"
  },

  slideInTop: {
    property: "translateY",
    from: 900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInTop.webp",
    name: "Slide Top"
  },

  slideInBottom: {
    property: "translateY",
    from: -900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInBottom.webp",
    name: "Slide Bottom"
  },

  slideOutRight: {
    property: "translateX",
    from: 0,
    to: -50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutRight.webp",
    name: "Slide Right"
  },

  slideOutLeft: {
    property: "translateX",
    from: 0,
    to: 50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutLeft.webp",
    name: "Slide Left"
  },

  slideOutTop: {
    property: "translateY",
    from: 0,
    to: 50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutUp.webp",
    name: "Slide Top"
  },

  slideOutBottom: {
    property: "translateY",
    from: 0,
    to: -50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/slideOutDown.webp",
    name: "Slide Bottom"
  }
} as const;

// Export type for external usage
export type AnimationPresets = typeof presets;
