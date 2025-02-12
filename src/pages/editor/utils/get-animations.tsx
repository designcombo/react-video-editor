import {
  IBasicAnimation,
  ICompositionAnimation,
  IItem,
} from "@designcombo/types";
import { Easing } from "remotion";
import { Animation } from "../player/animated";

export const getAnimations = (
  animation: {
    in: IBasicAnimation;
    out: IBasicAnimation;
  },
  item: IItem,
): {
  animationIn: Animation | Animation[] | null;
  animationOut: Animation | Animation[] | null;
} => {
  let animationIn = null;
  let animationOut = null;
  if (animation?.in) {
    animationIn = [];
    animation.in.composition.forEach((comp) => {
      if (animation.in.name.includes("slide")) {
        animationIn.push(getSlideAnimation(animation.in.name, comp, item));
      } else {
        animationIn.push({
          property: comp.property,
          from: comp.from,
          to: comp.to,
          durationInFrames: comp.durationInFrames,
          ease: Easing[comp.easing as keyof typeof Easing] as (
            t: number,
          ) => number,
        });
      }
    });
  }
  if (animation?.out) {
    animationOut = [];
    animation.out.composition.forEach((comp) => {
      if (animation.out.name.includes("slide")) {
        animationOut.push(getSlideAnimation(animation.out.name, comp, item));
      } else {
        animationOut.push({
          property: comp.property,
          from: comp.from,
          to: comp.to,
          durationInFrames: comp.durationInFrames,
          ease: Easing[comp.easing as keyof typeof Easing] as (
            t: number,
          ) => number,
        });
      }
    });
  }
  return {
    animationIn,
    animationOut,
  };
};

const getSlideAnimation = (
  type: string,
  anim: ICompositionAnimation,
  item: IItem,
) => {
  const transformString = item.details.transform;
  const scaleMatch = /scale\(([^,]+), ([^)]+)\)/.exec(transformString);
  const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
  if (type === "slideInRight" || type === "slideOutLeft") {
    const commonValue =
      -parseFloat(item.details.left) - item.details.width / scale;
    const from = type.includes("In") ? commonValue : anim.from;
    const to = type.includes("In") ? anim.to : commonValue;
    return {
      property: anim.property,
      from,
      to,
      durationInFrames: anim.durationInFrames,
      ease: Easing[anim.easing as keyof typeof Easing],
    };
  } else if (type === "slideInLeft" || type === "slideOutRight") {
    const commonValue =
      parseFloat(item.details.left) + item.details.width / scale;
    const from = type.includes("In") ? commonValue : anim.from;
    const to = type.includes("In") ? anim.to : commonValue;
    return {
      property: anim.property,
      from,
      to,
      durationInFrames: anim.durationInFrames,
      ease: Easing[anim.easing as keyof typeof Easing],
    };
  } else if (type === "slideInBottom" || type === "slideOutTop") {
    const commonValue =
      -parseFloat(item.details.top) - item.details.height / scale;
    const from = type.includes("In") ? commonValue : anim.from;
    const to = type.includes("In") ? anim.to : commonValue;
    return {
      property: anim.property,
      from,
      to,
      durationInFrames: anim.durationInFrames,
      ease: Easing[anim.easing as keyof typeof Easing],
    };
  } else if (type === "slideInTop" || type === "slideOutBottom") {
    const commonValue =
      parseFloat(item.details.top) + item.details.height / scale;
    const from = type.includes("In") ? commonValue : anim.from;
    const to = type.includes("In") ? anim.to : commonValue;

    return {
      property: anim.property,
      from,
      to,
      durationInFrames: anim.durationInFrames,
      ease: Easing[anim.easing as keyof typeof Easing],
    };
  }
};
