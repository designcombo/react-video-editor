function random(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const ShakeText = ({ text, frame }: { text: string; frame: number }) => {
  const offsetX = (random(frame) - 0.5) * 8; // entre -4 y 4 px
  const offsetY = (random(frame + 999) - 0.5) * 8;
  const rotate = (random(frame + 500) - 0.5) * 6; // entre -3 y 3 grados

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`
      }}
    >
      {text}
    </span>
  );
};

export default ShakeText;
