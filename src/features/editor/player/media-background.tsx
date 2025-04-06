const MediaBackground = ({ background }: { background: string }) => {
  return (
    <div
      style={{
        height: "10000px",
        width: "10000px",
        background: background || "#00000",
        top: -2500,
        left: -2500,
        position: "fixed",
        pointerEvents: "none",
      }}
    ></div>
  );
};

export default MediaBackground;
