type BaseProps = {
  family: string;
  fontSize: string;
  lineHeight: string;
  text: string;
  fontWeight: string;
  letterSpacing: string;
  textShadow: string;
  webkitTextStroke: string;
  id: string;
};

type TextHeightProps = BaseProps & {
  width: string;
};
export const calculateTextHeight = (props: TextHeightProps) => {
  const {
    family,
    fontSize,
    width,
    lineHeight,
    letterSpacing,
    textShadow,
    webkitTextStroke,
    fontWeight,
    id,
  } = props;

  const div = document.createElement("div");
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.overflowWrap = "break-word";

  div.style.width = width;
  div.style.fontSize = fontSize;
  div.style.fontFamily = family;
  div.style.lineHeight = lineHeight;
  div.style.height = "fit-content";
  div.style.fontWeight = fontWeight;
  div.style.letterSpacing = letterSpacing;

  div.style.position = "absolute";
  div.style.top = "100";
  div.style.left = "100";

  div.style.webkitTextStroke = webkitTextStroke;
  div.style.textShadow = textShadow;

  // const minChars = text.split(' ').reduce((acc, cur) => cur.length > acc.length ? cur : acc).length

  div.style.minWidth = `${1}ch`;

  const compositionLayer = document.querySelector(`[data-text-id="${id}"]`);

  div.innerHTML = compositionLayer!.innerHTML;

  document.body.appendChild(div);

  const newHeight = div.clientHeight;

  document.body.removeChild(div);

  return newHeight;
};
