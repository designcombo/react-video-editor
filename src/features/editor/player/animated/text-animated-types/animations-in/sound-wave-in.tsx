import { ITextDetails } from "@designcombo/types";
import { interpolate } from "remotion";

const SoundWaveIn = ({
  text,
  frame,
  animationTextInFrames,
  details
}: {
  text: string;
  frame: number;
  animationTextInFrames: number;
  details: ITextDetails;
}) => {
  const waveDisappearStart = animationTextInFrames * 0.5;
  const waveDisappearEnd = animationTextInFrames;
  const trailCount = 8;
  const baseScale = interpolate(frame, [0, waveDisappearStart], [0.5, 1], {
    extrapolateRight: "clamp"
  });
  const mainScale = baseScale;
  const mainBlur = 0;
  const mainOpacity = 1;
  const waveScaleX = interpolate(frame, [0, waveDisappearStart], [2, 1], {
    extrapolateRight: "clamp"
  });
  const waveBlur =
    frame < waveDisappearStart
      ? interpolate(frame, [0, waveDisappearStart], [20, 0], {
          extrapolateRight: "clamp"
        })
      : interpolate(frame, [waveDisappearStart, waveDisappearEnd], [0, 40], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });
  // Opacidad: de 0.7 a 1, luego a 0
  const waveOpacity =
    frame < waveDisappearStart
      ? interpolate(frame, [0, waveDisappearStart], [0.7, 1], {
          extrapolateRight: "clamp"
        })
      : interpolate(frame, [waveDisappearStart, waveDisappearEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp"
        });

  const trails = [];
  for (let i = trailCount; i > 0; i--) {
    // Cada trail está más atrás en el tiempo
    const trailFrame = Math.max(frame - i * 2, 0);

    // Escalado y estiramiento X para el efecto de eco
    const trailScale = interpolate(
      trailFrame,
      [0, waveDisappearStart],
      [0.5, 1],
      { extrapolateRight: "clamp" }
    );
    // const trailScaleX = interpolate(
    //   trailFrame,
    //   [0, waveDisappearStart],
    //   [2.5, 1],
    //   { extrapolateRight: "clamp" },
    // );

    // Opacidad más baja para los trails lejanos
    const trailOpacity = interpolate(
      trailFrame,
      [0, waveDisappearStart],
      [0.15, 0],
      { extrapolateRight: "clamp" }
    );

    trails.push(
      <span
        key={i}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: trailOpacity,
          transform: `scale(${trailScale * 2})`,
          pointerEvents: "none"
        }}
      >
        {text}
      </span>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        width: details.width,
        height: details.height,
        transform: `scale(${baseScale})`,
        position: "relative"
      }}
    >
      {/* Texto wave */}

      <span
        style={{
          width: details.width,
          height: details.height,
          background: "transparent",
          transform: `scale(${mainScale})`
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: "absolute",
          opacity: waveOpacity,
          width: details.width,
          height: details.height,
          transform: `scaleX(${waveScaleX})`,
          filter: `blur(${waveBlur * 3}px)`
        }}
      >
        {text}
      </span>
      {/* </span> */}
      <span
        style={{
          opacity: mainOpacity,
          filter: `blur(${mainBlur}px)`,
          transform: `scale(${mainScale})`,
          fontSize: parseFloat(details.fontSize.toString()),
          position: "absolute",
          width: details.width,
          height: details.height
        }}
      >
        <div
          style={{
            width: details.width,
            height: details.height,
            position: "relative"
          }}
        >
          {trails}
        </div>
      </span>
    </div>
  );
};

export default SoundWaveIn;
