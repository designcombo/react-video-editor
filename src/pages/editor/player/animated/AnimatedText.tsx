import React, { useMemo } from "react";
import { Animated, combine } from "./Animated";
import { Animation } from "./types";

interface AnimationConfig {
  animation: Animation | Animation[];
  overlap?: number; // 0-1, where 1 means full overlap
}

interface AnimatedTextProps {
  children: string;
  durationInFrames: number;
  wordAnimation?: AnimationConfig;
  letterAnimation?: AnimationConfig;
  className?: string;
}

const splitText = (text: string, splitBy: "word" | "letter"): string[] => {
  if (splitBy === "word") {
    return text.split(/\s+/);
  }
  return text.split("");
};

const createStaggeredAnimations = (
  animations: Animation | Animation[],
  count: number,
  overlap: number = 0,
): Animation[][] => {
  const animArray = Array.isArray(animations) ? animations : [animations];
  const totalDuration = Math.max(...animArray.map((a) => a.durationInFrames));

  return Array.from({ length: count }, (_, index) => {
    const delay = (index / (count - 1)) * totalDuration * (1 - overlap);
    return animArray.map((anim) => ({
      ...anim,
      delay: anim.delay ? anim.delay + delay : delay,
    }));
  });
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  durationInFrames,
  wordAnimation,
  letterAnimation,
  className,
}) => {
  const words = useMemo(() => splitText(children, "word"), [children]);
  const allLetters = useMemo(() => splitText(children, "letter"), [children]);

  const createAnimations = (
    config: AnimationConfig | undefined,
    elementCount: number,
  ) =>
    config?.animation
      ? createStaggeredAnimations(
          config.animation,
          elementCount,
          config.overlap || 0,
        )
      : Array(elementCount).fill([]);

  const wordAnimations = createAnimations(wordAnimation, words.length);
  const letterAnimations = createAnimations(letterAnimation, allLetters.length);

  let letterIndex = 0;
  const animatedWords = words.map((word, wordIndex) => {
    const letters = splitText(word, "letter");

    const animatedLetters = letters.map((letter) => {
      const wordAnim = wordAnimations[wordIndex];
      const letterAnim = letterAnimations[letterIndex];

      // Combine word and letter animations
      const combinedAnimation = combine(
        ...(wordAnim || []),
        ...(letterAnim || []),
      );

      letterIndex++;

      return (
        <Animated
          key={letterIndex}
          animationIn={combinedAnimation}
          durationInFrames={durationInFrames}
        >
          <span style={{ display: "inline-block" }}>{letter}</span>
        </Animated>
      );
    });

    return (
      <span
        key={wordIndex}
        style={{
          display: "inline-flex",
          marginRight: "0.25em",
        }}
      >
        {animatedLetters}
      </span>
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        fontSize: 40,
        color: "green",
      }}
      className={className}
    >
      {animatedWords}
    </div>
  );
};
