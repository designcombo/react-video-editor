const BillboardText = ({
  frame,
  fps,
  char
}: {
  char: string;
  frame: number;
  fps: number;
}) => {
  const scale = 1 + 0.2 * Math.sin((2 * Math.PI * frame) / (fps * 1)); // 1 ciclo por segundo

  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${scale})`
      }}
    >
      {char}
    </span>
  );
};

export default BillboardText;
