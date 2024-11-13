import {
  SlideDirection,
  circle,
  clockWipe,
  fade,
  flip,
  linearTiming,
  rectangle,
  slide,
  slidingDoors,
  star,
  wipe,
} from "@designcombo/transitions";
import { TransitionSeries } from "@remotion/transitions";

interface TransitionOptions {
  width: number;
  height: number;
  durationInFrames: number;
  id: string;
  direction?: SlideDirection;
}

export const Transitions: Record<
  string,
  (options: TransitionOptions) => JSX.Element
> = {
  none: ({ id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 1 })}
    />
  ),
  fade: ({ durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={fade()}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  slide: ({ durationInFrames, id, direction }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={slide({ direction: direction })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  wipe: ({ durationInFrames, id, direction }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={wipe({ direction: direction })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  flip: ({ durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={flip()}
      timing={linearTiming({ durationInFrames })}
    />
  ),

  clockWipe: ({ width, height, durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={clockWipe({ width, height })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  star: ({ width, height, durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={star({ width, height })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  circle: ({ width, height, durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={circle({ width, height })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  rectangle: ({ width, height, durationInFrames, id }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={rectangle({ width, height })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
  slidingDoors: ({
    width,
    height,
    durationInFrames,
    id,
  }: TransitionOptions) => (
    <TransitionSeries.Transition
      key={id}
      presentation={slidingDoors({ width, height })}
      timing={linearTiming({ durationInFrames })}
    />
  ),
};
