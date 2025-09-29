import {
  TransitionPresentation,
  TransitionPresentationComponentProps
} from "../";
import React, { useMemo, useState } from "react";
import { AbsoluteFill, random } from "remotion";

export type CustomPresentationProps = {
  width: number;
  height: number;
};

const WindowTransitionPresentation: React.FC<
  TransitionPresentationComponentProps<CustomPresentationProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps
}) => {
  const { width, height } = passedProps;

  // Calculamos el tamaño de la ventana en función del progreso de la transición
  const windowWidth = width * presentationProgress;

  // Calculamos las coordenadas para la ventana que cubrirá la mitad de la pantalla
  const windowX = width / 2 - windowWidth / 2;

  // Creamos un clipPath único para esta transición
  const [clipId] = useState(() => String(random(null)));

  // Establecemos el clipPath para el elemento que queremos animar
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
          <svg>
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={windowX}
                  y={0}
                  width={windowWidth}
                  height={height}
                  fill="black"
                />
              </clipPath>
            </defs>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const slidingDoors = (
  props: CustomPresentationProps
): TransitionPresentation<CustomPresentationProps> => {
  return { component: WindowTransitionPresentation, props };
};
