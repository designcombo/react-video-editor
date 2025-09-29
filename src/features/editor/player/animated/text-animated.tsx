import { ITextDetails } from "@designcombo/types";
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import AnimatedTextIn from "./text-animated-types/animations-in/text-animated-in";
import SunnyMorningsAnimationIn from "./text-animated-types/animations-in/sunny-mornings-in";
import DominoDreamsIn from "./text-animated-types/animations-in/domino-dreams-in";
import GetThinkersAnimationIn from "./text-animated-types/animations-in/great-thinkers-in";
import BeatifulQuestionAnimationIn from "./text-animated-types/animations-in/beatiful-question-in";
import MadeWithLoveAnimationIn from "./text-animated-types/animations-in/made-with-love-in";
import AnimatedTextOut from "./text-animated-types/animations-out/text-animated-out";
import SunnyMorningsAnimationOut from "./text-animated-types/animations-out/sunny-mornings-out";
import DominoDreamsAnimationOut from "./text-animated-types/animations-out/domino-dreams-out";
import BeatifulQuestionAnimationOut from "./text-animated-types/animations-out/beatiful-question-out";
import RealityIsBrokenAnimationIn from "./text-animated-types/animations-in/reality-is-broken-in";
import MadeWithLoveAnimationOut from "./text-animated-types/animations-out/made-with-love-out";
import RealityIsBrokenAnimationOut from "./text-animated-types/animations-out/reality-is-broken-out";
import GreatThinkersAnimationOut from "./text-animated-types/animations-out/great-thinkers-out";
import VogueLetterByLetter from "./text-animated-types/animations-loop/vogue";
import DragonflyText from "./text-animated-types/animations-loop/dragonfly";
import BillboardText from "./text-animated-types/animations-loop/billboard";
import DropAnimationIn from "./text-animated-types/animations-in/drop-in";
import DescompressAnimationIn from "./text-animated-types/animations-in/descompress-in";
import DescompressAnimationOut from "./text-animated-types/animations-out/descompress-out";
import DropAnimationOut from "./text-animated-types/animations-out/drop-out";
import Heartbeat from "./text-animated-types/animations-loop/heartbeat";
import Wave from "./text-animated-types/animations-loop/wave";
import ShakyLettersText from "./text-animated-types/animations-loop/shaky-letters-text";
import PulseText from "./text-animated-types/animations-loop/pulse";
import { renderFullTextAnimation } from "./text-animated-full";

const animationsIn: { [key: string]: React.FC<any> } = {
  animatedTextIn: AnimatedTextIn,
  sunnyMorningsAnimationIn: SunnyMorningsAnimationIn,
  dominoDreamsIn: DominoDreamsIn,
  greatThinkersAnimationIn: GetThinkersAnimationIn,
  beautifulQuestionsAnimationIn: BeatifulQuestionAnimationIn,
  madeWithLoveAnimationIn: MadeWithLoveAnimationIn,
  realityIsBrokenAnimationIn: RealityIsBrokenAnimationIn,
  dropAnimationIn: DropAnimationIn,
  descompressAnimationIn: DescompressAnimationIn
};

const animationsOut: { [key: string]: React.FC<any> } = {
  animatedTextOut: AnimatedTextOut,
  sunnyMorningsAnimationOut: SunnyMorningsAnimationOut,
  dominoDreamsAnimationOut: DominoDreamsAnimationOut,
  beautifulQuestionsAnimationOut: BeatifulQuestionAnimationOut,
  madeWithLoveAnimationOut: MadeWithLoveAnimationOut,
  realityIsBrokenAnimationOut: RealityIsBrokenAnimationOut,
  greatThinkersAnimationOut: GreatThinkersAnimationOut,
  descompressAnimationOut: DescompressAnimationOut,
  dropAnimationOut: DropAnimationOut
};

const animationsLoop: { [key: string]: React.FC<any> } = {
  vogueAnimationLoop: VogueLetterByLetter,
  dragonFlyAnimationLoop: DragonflyText,
  billboardAnimationLoop: BillboardText,
  heartbeatAnimationLoop: Heartbeat,
  waveAnimationLoop: Wave,
  shakyLettersTextAnimationLoop: ShakyLettersText,
  pulseAnimationLoop: PulseText
};

const getTextLines = (
  text: string,
  width: number,
  fontSize: number
): string[] => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) return [];

  context.font = `${fontSize}px Arial`;
  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = context.measureText(testLine).width;

    if (textWidth > width) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines;
};

export const TextAnimated: React.FC<{
  text: string;
  fps: number;
  textAnimationNameIn: string;
  textAnimationNameOut: string;
  textAnimationNameLoop: string;
  details: ITextDetails;
  animationTextInFrames: number;
  animationTextOutFrames: number;
  animationTextLoopFrames: number;
  durationInFrames: number;
  animationFonts: { fontFamily: string; url: string }[];
}> = ({
  text,
  fps,
  textAnimationNameIn,
  textAnimationNameOut,
  textAnimationNameLoop,
  details,
  animationTextInFrames,
  animationTextOutFrames,
  animationTextLoopFrames,
  durationInFrames,
  animationFonts
}) => {
  const frame = useCurrentFrame();
  const animInFrom = animationTextInFrames;
  const animOut = durationInFrames - animationTextOutFrames;
  const validAnimIn = textAnimationNameIn ? animInFrom >= frame : false;
  const validAnimOut = textAnimationNameOut ? animOut < frame : false;
  if (!validAnimOut && !validAnimIn) {
    return (
      <div
        style={{
          whiteSpace: "pre-line",
          maxWidth: "100%"
        }}
      >
        {text}
      </div>
    );
  }

  const lines = getTextLines(text, details.width, details.fontSize);

  const fullTextAnimation = renderFullTextAnimation({
    frame,
    text,
    details,
    fps,
    durationInFrames,
    animationTextInFrames,
    animationTextOutFrames,
    animationTextLoopFrames,
    animationFonts,
    validAnimIn,
    validAnimOut,
    textAnimationNameIn,
    textAnimationNameOut,
    textAnimationNameLoop
  });

  if (fullTextAnimation) {
    return fullTextAnimation;
  }

  const maxTextLengthInLine = lines.reduce(
    (max, line) => Math.max(max, line.length),
    0
  );

  const AnimationComponentIn = animationsIn[textAnimationNameIn];
  const AnimationComponentOut = animationsOut[textAnimationNameOut];
  const AnimationComponentLoop = animationsLoop[textAnimationNameLoop];

  return (
    <>
      {lines.map((line, rowIndex) => (
        <div key={rowIndex}>
          {line.split("").map((char, index) => {
            if (validAnimIn && AnimationComponentIn) {
              return (
                <AnimationComponentIn
                  key={index}
                  char={char}
                  index={index}
                  frame={frame}
                  textLength={maxTextLengthInLine}
                  fps={fps}
                  animationTextInFrames={animationTextInFrames}
                  details={details}
                />
              );
            }
            if (validAnimOut && AnimationComponentOut) {
              return (
                <AnimationComponentOut
                  key={index}
                  char={char}
                  index={index}
                  frame={frame}
                  textLength={maxTextLengthInLine}
                  fps={fps}
                  animationTextOutFrames={animationTextOutFrames}
                  durationInFrames={durationInFrames}
                  details={details}
                />
              );
            }
            if (textAnimationNameLoop && !validAnimIn && !validAnimOut) {
              return (
                <AnimationComponentLoop
                  key={index}
                  char={char}
                  index={index}
                  frame={frame}
                  textLength={maxTextLengthInLine}
                  fps={fps}
                  animationTextLoopFrames={animationTextLoopFrames}
                  details={details}
                />
              );
            }
            return <span key={index}>{char}</span>;
          })}
        </div>
      ))}
    </>
  );
};
