import rgbaToHex from "./rgbaToHex";

export default (rgba: Array<string | number>) => {
  return !!rgbaToHex(rgba);
};
