// types.ts

export interface Animation {
  property: string;
  from: number;
  to: number;
  durationInFrames: number;
  ease: (t: number) => number;
  delay?: number;
  previewUrl?: string;
  name?: string;
}

export interface StaggerConfig {
  amount: number;
  overlap?: number; // 0-1, where 1 means full overlap
}

export interface AnimationConfig {
  in?: Animation | Animation[];
  out?: Animation | Animation[];
  stagger?: StaggerConfig;
}

export interface AnimatedElementProps {
  animationIn?: Animation | Animation[];
  animationOut?: Animation | Animation[];
  durationInFrames: number;
  children: React.ReactNode;
  className?: string;
}

export interface AnimatedTextProps {
  children: string;
  durationInFrames: number;
  wordAnimation?: AnimationConfig;
  letterAnimation?: AnimationConfig;
  className?: string;
}

// You might want to export these utility types as well
export type CombineAnimations = (
  ...animations: (Animation | Animation[] | undefined)[]
) => Animation[];

export type CreateStaggeredAnimations = (
  animations: Animation | Animation[] | undefined,
  count: number,
  stagger: StaggerConfig,
  durationInFrames: number,
  isOut: boolean,
) => Animation[];
