import checkFormat from "./checkFormat";

export default (
  type: string,
  stops: Array<any>,
  modifier: string | number | undefined,
  format: "rgb" | "hsl" | "hex" = "rgb",
) => {
  let str = "";

  switch (type) {
    case "linear":
      if (typeof modifier === "number") {
        str = `linear-gradient(${modifier}deg, ${stops.map(
          (color: [string, number]) => {
            return `${checkFormat(color[0], format)} ${Math.round(
              color[1] * 100,
            ).toFixed(2)}%`;
          },
        )})`;
      }
      if (typeof modifier === "string") {
        str = `linear-gradient(${modifier}, ${stops.map(
          (color: [string, number]) => {
            return `${checkFormat(color[0], format)} ${Math.round(
              color[1] * 100,
            ).toFixed(2)}%`;
          },
        )})`;
      }
      break;
    case "radial":
      str = `radial-gradient(${modifier}, ${stops.map(
        (color: [string, number]) => {
          return `${checkFormat(color[0], format)} ${Math.round(
            color[1] * 100,
          ).toFixed(2)}%`;
        },
      )})`;
      break;
    default:
      break;
  }

  return str;
};
