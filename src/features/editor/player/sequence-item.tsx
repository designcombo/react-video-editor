import React from "react";
import {
  IAudio,
  ICaption,
  IHillAudioBars,
  IIllustration,
  IImage,
  ITrackItem,
  ILinealAudioBars,
  IProgressBar,
  IProgressFrame,
  IRadialAudioBars,
  IShape,
  IText,
  IVideo,
  IWaveAudioBars
} from "@designcombo/types";
import {
  Audio,
  Caption,
  HillAudioBars,
  Illustration,
  Image,
  LinealAudioBars,
  ProgressBar,
  ProgressFrame,
  RadialAudioBars,
  Shape,
  Text,
  Video,
  WaveAudioBars
} from "./items";
import { SequenceItemOptions } from "./base-sequence";

export const SequenceItem: Record<
  string,
  (item: ITrackItem, options: SequenceItemOptions) => React.JSX.Element
> = {
  text: (item, options) => Text({ item: item as IText, options }),
  caption: (item, options) => Caption({ item: item as ICaption, options }),
  shape: (item, options) => Shape({ item: item as IShape, options }),
  video: (item, options) => Video({ item: item as IVideo, options }),
  audio: (item, options) => Audio({ item: item as IAudio, options }),
  image: (item, options) => Image({ item: item as IImage, options }),
  illustration: (item, options) =>
    Illustration({ item: item as IIllustration, options }),
  progressBar: (item, options) =>
    ProgressBar({ item: item as IProgressBar, options }),
  linealAudioBars: (item, options) =>
    LinealAudioBars({ item: item as ILinealAudioBars, options }),
  waveAudioBars: (item, options) =>
    WaveAudioBars({ item: item as IWaveAudioBars, options }),
  hillAudioBars: (item, options) =>
    HillAudioBars({ item: item as IHillAudioBars, options }),
  progressFrame: (item, options) =>
    ProgressFrame({ item: item as IProgressFrame, options }),
  radialAudioBars: (item, options) =>
    RadialAudioBars({ item: item as IRadialAudioBars, options })
};
