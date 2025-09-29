const VogueLetterByLetter = ({
  char,
  frame,
  fps,
  index
}: {
  char: string;
  frame: number;
  fps: number;
  index: number;
}) => {
  const delay = index * 4; // desfase por letra
  const t = (frame - delay) / fps;

  // Loop suave con rotación más notoria
  const scale = 1 + 0.25 * Math.sin(t * 2 * Math.PI);
  const rotateY = 40 * Math.sin(t * 2 * Math.PI);

  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${scale}) rotateY(${rotateY}deg)`
      }}
    >
      {char}
    </span>
  );
};
export default VogueLetterByLetter;
