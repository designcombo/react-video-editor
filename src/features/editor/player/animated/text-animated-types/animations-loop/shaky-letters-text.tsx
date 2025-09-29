function random(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const ShakyLettersText = ({
  char,
  index,
  frame
}: {
  char: string;
  index: number;
  frame: number;
}) => {
  const seed = frame * 100 + index * 999;
  const offsetX = (random(seed) - 0.5) * 8;
  const offsetY = (random(seed + 1) - 0.5) * 8;
  const rotate = (random(seed + 2) - 0.5) * 6;

  return (
    <span
      key={index}
      style={{
        display: "inline-block",
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`
      }}
    >
      {char}
    </span>
  );
};

export default ShakyLettersText;
