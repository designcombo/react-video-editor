const Wave = ({
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
  const offset = index * 20;
  const translateY = Math.sin((frame * 8 - offset) / fps) * 20;

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${translateY}px)`
      }}
    >
      {char}
    </span>
  );
};
export default Wave;
