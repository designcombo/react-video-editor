export default (hex: string) => {
  const validHex = new RegExp(
    /^#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,
  );

  return validHex.test(hex);
};
