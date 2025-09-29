import { ITextDetails } from "@designcombo/types";
import TypeWriterIn from "./text-animated-types/animations-in/type-writer-in";
import TypeWriterOut from "./text-animated-types/animations-out/type-writer-out";
import BackgroundIn from "./text-animated-types/animations-in/background-in";
import BackgroundOut from "./text-animated-types/animations-out/background-out";
import SoundWaveIn from "./text-animated-types/animations-in/sound-wave-in";
import CountDownIn from "./text-animated-types/animations-in/count-down-in";
import Spin from "./text-animated-types/animations-loop/spin";
import Rotate3d from "./text-animated-types/animations-loop/rotate-3d";
import FontChange from "./text-animated-types/animations-loop/font-change";
import ShakeText from "./text-animated-types/animations-loop/shake-text";
import Vintage from "./text-animated-types/animations-loop/vintage";
import GlitchText from "./text-animated-types/animations-loop/glitch";
import { JSX } from "react";

type FullTextAnimationProps = {
  frame: number;
  text: string;
  details: ITextDetails;
  fps: number;
  durationInFrames: number;
  animationTextInFrames: number;
  animationTextOutFrames: number;
  animationTextLoopFrames: number;
  animationFonts: { fontFamily: string; url: string }[];
  validAnimIn: boolean;
  validAnimOut: boolean;
  textAnimationNameIn: string;
  textAnimationNameOut: string;
  textAnimationNameLoop: string;
};

export const renderFullTextAnimation = ({
  frame,
  text,
  details,
  fps,
  durationInFrames,
  animationTextInFrames,
  animationTextOutFrames,
  animationFonts,
  validAnimIn,
  validAnimOut,
  textAnimationNameIn,
  textAnimationNameOut,
  textAnimationNameLoop
}: FullTextAnimationProps): JSX.Element | null => {
  // Animaciones de entrada
  if (validAnimIn) {
    if (textAnimationNameIn === "typeWriterIn") {
      return (
        <TypeWriterIn
          frame={frame}
          durationInFrames={animationTextInFrames}
          text={text}
          style={details}
        />
      );
    }

    if (textAnimationNameIn === "backgroundAnimationIn") {
      return (
        <BackgroundIn
          text={text}
          frame={frame}
          details={details}
          animationTextInFrames={animationTextInFrames}
        />
      );
    }

    if (textAnimationNameIn === "soundWaveIn") {
      return (
        <SoundWaveIn
          text={text}
          frame={frame}
          animationTextInFrames={animationTextInFrames}
          details={details}
        />
      );
    }

    if (textAnimationNameIn === "countDownAnimationIn") {
      return (
        <CountDownIn
          text={text}
          frame={frame}
          animationTextInFrames={animationTextInFrames}
          details={details}
        />
      );
    }
  }

  // Animaciones de salida
  if (validAnimOut) {
    if (textAnimationNameOut === "typeWriterOut") {
      return (
        <TypeWriterOut
          frame={frame}
          durationInFrames={durationInFrames}
          text={text}
          details={details}
          animationDuration={animationTextOutFrames}
        />
      );
    }

    if (textAnimationNameOut === "backgroundAnimationOut") {
      return (
        <BackgroundOut
          text={text}
          frame={frame}
          animationTextOutFrames={animationTextOutFrames}
          details={details}
          durationInFrames={durationInFrames}
          fps={fps}
        />
      );
    }
  }

  // Animaciones en bucle
  if (!validAnimIn && !validAnimOut) {
    if (textAnimationNameLoop === "spinAnimationLoop") {
      return <Spin text={text} frame={frame} fps={fps} />;
    }

    if (textAnimationNameLoop === "rotate3dAnimationLoop") {
      return (
        <Rotate3d
          text={text}
          frame={frame}
          durationInFrames={durationInFrames}
        />
      );
    }

    if (textAnimationNameLoop === "textFontChangeAnimationLoop") {
      return (
        <FontChange
          text={text}
          frame={frame}
          details={details}
          animationFonts={animationFonts}
        />
      );
    }

    if (textAnimationNameLoop === "shakeTextAnimationLoop") {
      return <ShakeText text={text} frame={frame} />;
    }

    if (textAnimationNameLoop === "vintageAnimationLoop") {
      return <Vintage text={text} frame={frame} details={details} fps={fps} />;
    }

    if (textAnimationNameLoop === "glitchAnimationLoop") {
      return <GlitchText text={text} frame={frame} />;
    }
  }

  return null;
};
