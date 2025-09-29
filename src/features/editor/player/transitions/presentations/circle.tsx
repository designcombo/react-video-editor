import React, { useMemo, useState } from "react";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps
} from "../";
import { AbsoluteFill, random } from "remotion";

export type CustomPresentationProps = {
  width: number;
  height: number;
};

const CirclePresentation: React.FC<
  TransitionPresentationComponentProps<CustomPresentationProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps
}) => {
  const finishedRadius =
    Math.sqrt(passedProps.width ** 2 + passedProps.height ** 2) / 2;
  const radius = finishedRadius * presentationProgress;

  const circlePath = makeCirclePath(
    passedProps.width / 2,
    passedProps.height / 2,
    radius
  );

  const [clipId] = useState(() => String(random(null)));
  const style: React.CSSProperties = useMemo(() => {
    return {
      width: "100%",
      height: "100%",
      clipPath:
        presentationDirection === "exiting" ? undefined : `url(#${clipId})`
    };
  }, [clipId, presentationDirection]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {presentationDirection === "exiting" ? null : (
        <AbsoluteFill>
          <svg width={passedProps.width} height={passedProps.height}>
            <defs>
              <clipPath id={clipId}>
                <path d={circlePath} fill="black" />
              </clipPath>
            </defs>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const circle = (
  props: CustomPresentationProps
): TransitionPresentation<CustomPresentationProps> => {
  return { component: CirclePresentation, props };
};

// Esta función crea un path de círculo
const makeCirclePath = (cx: number, cy: number, radius: number): string => {
  return `M ${cx}, ${cy}
            m -${radius}, 0
            a ${radius},${radius} 0 1,0 ${radius * 2},0
            a ${radius},${radius} 0 1,0 -${radius * 2},0`;
};
