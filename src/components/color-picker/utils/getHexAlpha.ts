import tinycolor from "tinycolor2";

export default (value: string) => {
  const defaultObject = {
    hex: "#ffffff",
    alpha: 100,
  };
  const tinyColor = tinycolor(value);

  if (value) {
    if (
      tinyColor.isValid() &&
      !value.trim().startsWith("radial-gradient") &&
      !value.trim().startsWith("linear-gradient")
    ) {
      defaultObject.hex = tinyColor.toHexString();
      defaultObject.alpha = Math.round(tinyColor.getAlpha() * 100);
    } else {
      return defaultObject;
    }
  }

  return defaultObject;
};
