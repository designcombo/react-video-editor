export default (color: any) => {
  if (!color) return;
  if (color.toLowerCase() === "transparent") return [0, 0, 0, 0];
  if (color[0] === "#") {
    if (color.length < 7) {
      color =
        "#" +
        color[1] +
        color[1] +
        color[2] +
        color[2] +
        color[3] +
        color[3] +
        (color.length > 4 ? color[4] + color[4] : "");
    }
    return [
      parseInt(color.substr(1, 2), 16),
      parseInt(color.substr(3, 2), 16),
      parseInt(color.substr(5, 2), 16),
      color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1,
    ];
  }

  if (color.indexOf("rgb") === 0) {
    color += ",1";
    // eslint-disable-next-line
    return color.match(/[\.\d]+/g).map((a: string) => {
      return +a;
    });
  }
};
