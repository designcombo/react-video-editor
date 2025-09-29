export default (params: Array<string | number>) => {
  if (!Array.isArray(params)) return "";

  if (params.length < 3 || params.length > 4) return "";

  const parts = params.map(function (e: string | number) {
    let r = (+e).toString(16);
    r.length === 1 && (r = "0" + r);
    return r;
  }, []);

  return !~parts.indexOf("NaN") ? "#" + parts.join("") : "";
};
