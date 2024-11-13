import tinycolor from "tinycolor2";

import { validGradient } from ".";

interface IGradientStop {
  color: string;
  position?: number;
}

const LINEAR_POS = [
  { angle: "0", name: "to top" },
  { angle: "45", name: "to top right" },
  { angle: "45", name: "to right top" },
  { angle: "90", name: "to right" },
  { angle: "135", name: "to right bottom" },
  { angle: "135", name: "to bottom right" },
  { angle: "180", name: "to bottom" },
  { angle: "225", name: "to left bottom" },
  { angle: "225", name: "to bottom left" },
  { angle: "270", name: "to left" },
  { angle: "315", name: "to top left" },
  { angle: "315", name: "to left top" },
];

export default (str: string) => {
  const tinyColor = tinycolor(str);

  const defaultStops = {
    stops: [
      ["rgba(0, 0, 0, 1)", 0, 0],
      ["rgba(183, 80, 174, 0.92)", 1, 1],
    ],
    gradient: `linear-gradient(180deg, rgba(6, 6, 6, 1) 0.0%, rgba(183, 80, 174, 0.92) 100.0%)`,
    modifier: 180,
    type: "linear",
  };

  if (str === "transparent") {
    return defaultStops;
  }

  if (
    tinyColor.isValid() &&
    !str.trim().startsWith("radial-gradient") &&
    !str.trim().startsWith("linear-gradient")
  ) {
    const rgbaStr = tinyColor.toRgbString();

    if (rgbaStr) {
      defaultStops.stops = [
        ["rgba(0, 0, 0, 1)", 0, 0],
        [rgbaStr, 1, 1],
      ];
      defaultStops.gradient = `linear-gradient(180deg, rgba(6, 6, 6, 1) 0.0%, ${rgbaStr} 100.0%)`;
    }

    return defaultStops;
  } else {
    str = str.replace(";", "").replace("background-image:", "");
    const gradient = validGradient(str);

    let stops: Array<IGradientStop> = [];
    let angle: string = "";

    if (
      gradient === "Failed to find gradient" ||
      gradient === "Not correct position"
    ) {
      console.warn("Incorrect gradient value");
      return defaultStops;
    }

    if (typeof gradient !== "string") {
      stops = gradient.stops;
      angle = gradient.angle ? gradient.angle : gradient.line;
    }

    const [, type, content] = str.match(/^(\w+)-gradient\((.*)\)$/i) || [];
    if (!type || !content) {
      console.warn("Incorrect gradient value");
      return defaultStops;
    }

    const findF = LINEAR_POS.find((item) => item.name === angle)?.angle;
    const helperAngle = type === "linear" ? "180" : "circle at center";
    const modifier = findF || angle || helperAngle;

    return {
      gradient: `${type}-gradient(${
        typeof gradient !== "string" ? gradient.original : str
      })`,
      type,
      modifier:
        modifier.match(/\d+/) !== null
          ? Number(modifier.match(/\d+/)?.join(""))
          : modifier,
      stops: stops.map((stop, index: number) => {
        const formatStop = [`${stop.color}`, index];
        if (stop.position || stop.position === 0) {
          formatStop.splice(1, 0, stop.position);
        }
        return formatStop;
      }),
    };
  }
};
