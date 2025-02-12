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
  | "flipIn";

// Type-safe preset object
export const presets: Record<PresetName, Animation> = {
  rotateIn: {
    property: "rotate",
    from: 0,
    to: 360,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/scaleAndRotate.webp",
    name: "Rotate",
  },

  flipIn: {
    property: "rotateY",
    from: -90,
    to: 0,
    durationInFrames: 30,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/flipIn.webp",
    name: "Flip",
  },

  fadeIn: {
    property: "opacity",
    from: 0,
    to: 1,
    durationInFrames: 15,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/FadeIn.webp",
    name: "Fade",
  },

  fadeOut: {
    property: "opacity",
    from: 1,
    to: 0,
    durationInFrames: 15,
    ease: Easing.linear,
    previewUrl: "https://cdn.designcombo.dev/animations/FadeOut.webp",
    name: "Fade",
  },

  scaleIn: {
    property: "scale",
    from: 0,
    to: 1,
    durationInFrames: 15,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/ScaleIn.webp",
    name: "Scale",
  },

  scaleOut: {
    property: "scale",
    from: 1,
    to: 0,
    durationInFrames: 15,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/ScaleOut.webp",
    name: "Scale",
  },

  slideInRight: {
    property: "translateX",
    from: -900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInRight.webp",
    name: "Slide Right",
  },

  slideInLeft: {
    property: "translateX",
    from: 900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInLeft.webp",
    name: "Slide Left",
  },

  slideInTop: {
    property: "translateY",
    from: 900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInTop.webp",
    name: "Slide Top",
  },

  slideInBottom: {
    property: "translateY",
    from: -900,
    to: 0,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideInBottom.webp",
    name: "Slide Bottom",
  },

  slideOutRight: {
    property: "translateX",
    from: 0,
    to: -50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutRight.webp",
    name: "Slide Right",
  },

  slideOutLeft: {
    property: "translateX",
    from: 0,
    to: 50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutLeft.webp",
    name: "Slide Left",
  },

  slideOutTop: {
    property: "translateY",
    from: 0,
    to: 50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/SlideOutUp.webp",
    name: "Slide Top",
  },

  slideOutBottom: {
    property: "translateY",
    from: 0,
    to: -50,
    durationInFrames: 15,
    delay: 0,
    ease: Easing.ease,
    previewUrl: "https://cdn.designcombo.dev/animations/slideOutDown.webp",
    name: "Slide Bottom",
  },
} as const;

// Export type for external usage
export type AnimationPresets = typeof presets;
