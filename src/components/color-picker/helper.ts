import tinycolor from "tinycolor2";

import { rgbaToArray, isValidRgba, validGradient } from "./utils";

export const getIndexActiveTag = (value: string) => {
  let tab = "solid";
  const validValue = tinycolor(value).isValid();

  if (value) {
    if (value === "transparent") {
      tab = "solid";
      return tab;
    }
    if (
      validValue &&
      !value.trim().startsWith("radial-gradient") &&
      !value.trim().startsWith("linear-gradient")
    ) {
      tab = "solid";
      return tab;
    }
    const rgba = rgbaToArray(value);
    if (rgba) {
      if (isValidRgba([rgba[0], rgba[1], rgba[2]])) {
        tab = "solid";
        return tab;
      }
    } else {
      tab = "gradient";
      return tab;
    }
  }

  return tab;
};

export const checkValidColorsArray = (
  arr: string[],
  type: "solid" | "grad",
) => {
  if (!arr.length || !Array.isArray(arr)) {
    return [];
  }

  const uniqueArr = [...new Set(arr)];

  switch (type) {
    case "solid":
      return uniqueArr.filter((color: string, index: number) => {
        const tinyColor = tinycolor(color);
        if (
          tinyColor.isValid() &&
          !color.trim().startsWith("radial-gradient") &&
          !color.trim().startsWith("linear-gradient")
        ) {
          return true;
        }

        if (index > 100) {
          return false;
        }

        return false;
      });
    case "grad":
      return uniqueArr.filter((color: string, index: number) => {
        const validColor = validGradient(color);

        if (validColor === "Failed to find gradient") {
          return false;
        }

        if (validColor === "Not correct position") {
          console.warn(
            "Incorrect gradient default value. You need to indicate the location for the colors. We ignore this gradient value",
          );
          return false;
        }

        if (index > 100) {
          return false;
        }

        return true;
      });

    default:
      return [];
  }
};

export const arraysEqual = (a: Array<any>, b: Array<any>) => {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++)
      if (!arraysEqual(a[i], b[i])) return false;
    return true;
  } else {
    return a === b;
  }
};

export const shallowEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};
