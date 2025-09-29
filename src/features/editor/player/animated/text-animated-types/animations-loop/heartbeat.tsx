const Heartbeat = ({
  char,
  frame,
  fps
}: {
  char: string;
  frame: number;
  fps: number;
}) => {
  const time = frame / fps;
  const cycleDuration = 1;
  const cycleTime = time % cycleDuration;

  let scale = 1;
  if (cycleTime < 0.2 || (cycleTime >= 0.3 && cycleTime < 0.5)) {
    scale = 1 + Math.sin((cycleTime % 0.2) * Math.PI * 5) * 0.8;
  }

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
export default Heartbeat;
