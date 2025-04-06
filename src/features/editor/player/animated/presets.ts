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
export const presets: Record<any, Animation> = {} as const;

// Export type for external usage
export type AnimationPresets = typeof presets;
