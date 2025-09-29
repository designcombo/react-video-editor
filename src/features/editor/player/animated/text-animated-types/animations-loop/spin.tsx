const Spin = ({
  text,
  frame,
  fps
}: {
  text: string;
  frame: number;
  fps: number;
}) => {
  const t = frame / fps;
  const rotateZ = t * 360;

  return (
    <span
      style={{
        display: "inline-block",
        transform: `rotateZ(${rotateZ}deg)`
      }}
    >
      {text}
    </span>
  );
};
export default Spin;
