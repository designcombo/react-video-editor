const DragonflyText = ({
  char,
  frame,
  fps
}: {
  char: string;
  frame: number;
  fps: number;
}) => {
  const t = frame / fps;

  const x = 80 * Math.sin(t * 2 * Math.PI); // movimiento lateral
  const y = 80 * Math.sin(t * 2.5 * Math.PI); // movimiento vertical
  const rotate = 5 * Math.sin(t * 3 * Math.PI); // rotación en grados
  const scale = 1 + 0.05 * Math.sin(t * 4 * Math.PI); // pequeño pulso

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
        transition: "transform 0.1s linear"
      }}
    >
      {char}
    </span>
  );
};

export default DragonflyText;
