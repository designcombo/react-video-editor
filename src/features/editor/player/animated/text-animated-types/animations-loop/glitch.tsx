const GlitchText = ({ text, frame }: { text: string; frame: number }) => {
  const glitchIntensity = Math.sin(frame / 10) * 10;
  const rgbOffset = Math.sin(frame / 5) * 10;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        opacity: 0.8
      }}
    >
      <div
        style={{
          position: "absolute",
          color: "cyan",
          transform: `translate(${rgbOffset}px, ${glitchIntensity}px)`,
          mixBlendMode: "screen"
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          color: "magenta",
          transform: `translate(${-rgbOffset}px, ${-glitchIntensity}px)`,
          mixBlendMode: "screen"
        }}
      >
        {text}
      </div>
      <div style={{ color: "white" }}>
        <span style={{ paddingInline: "10px" }}>{text}</span>
      </div>
    </span>
  );
};

export default GlitchText;
