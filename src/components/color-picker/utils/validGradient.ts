/* eslint no-useless-escape: off */
/* eslint prefer-const: off */
/* eslint no-prototype-builtins: off */
import tinycolor from "tinycolor2";

interface IGradientStop {
  color: string;
  position?: number;
}

interface IParsedGraient {
  stops: IGradientStop[];
  angle: string;
  original: string;
  line: string;
  side?: string;
  sideCorner?: string;
  parseWarning?: boolean;
}

interface IGradientReg {
  gradientSearch: RegExp;
  colorStopSearch: RegExp;
}

const combineRegExp = (
  regexpList: ReadonlyArray<string | RegExp>,
  flags: string,
): RegExp => {
  return new RegExp(
    regexpList.reduce<string>(
      (result, item) =>
        result + (typeof item === "string" ? item : item.source),
      "",
    ),
    flags,
  );
};

const generateRegExp = () => {
  const searchFlags = "gi";
  const rAngle = /(?:[+-]?\d*\.?\d+)(?:deg|grad|rad|turn)/;
  const rSideCornerCapture = /to\s+((?:(?:left|right)(?:\s+(?:top|bottom))?))/;
  const rRadial =
    /circle at\s+((?:(?:left|right|center|top|bottom)(?:\s+(?:left|right|center|top|bottom))?))/;
  const rComma = /\s*,\s*/;
  const rColorHex = /\#(?:[a-f0-9]{6,8}|[a-f0-9]{3})/;
  const rDigits3 = /\(\s*(?:\d{1,3}%?\s*,\s*){2}%?\d{1,3}%?\s*\)/;
  const rDigits4 = /\(\s*(?:\d{1,3}%?\s*,\s*){2}%?\d{1,3}%?\s*,\s*\d*\.?\d+\)/;
  const rValue = /(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?/;
  const rKeyword = /[_a-z-][_a-z0-9-]*/;
  const rColor = combineRegExp(
    [
      "(?:",
      rColorHex,
      "|",
      "(?:rgb|hsl)",
      rDigits3,
      "|",
      "(?:rgba|hsla)",
      rDigits4,
      "|",
      rKeyword,
      ")",
    ],
    "",
  );
  const rColorStop = combineRegExp(
    [rColor, "(?:\\s+", rValue, "(?:\\s+", rValue, ")?)?"],
    "",
  );
  const rColorStopList = combineRegExp(
    ["(?:", rColorStop, rComma, ")*", rColorStop],
    "",
  );
  const rLineCapture = combineRegExp(
    ["(?:(", rAngle, ")|", rSideCornerCapture, "|", rRadial, ")"],
    "",
  );
  const rGradientSearch = combineRegExp(
    ["(?:(", rLineCapture, ")", rComma, ")?(", rColorStopList, ")"],
    searchFlags,
  );
  const rColorStopSearch = combineRegExp(
    [
      "\\s*(",
      rColor,
      ")",
      "(?:\\s+",
      "(",
      rValue,
      "))?",
      "(?:",
      rComma,
      "\\s*)?",
    ],
    searchFlags,
  );

  return {
    gradientSearch: rGradientSearch,
    colorStopSearch: rColorStopSearch,
  };
};

const parseGradient = (regExpLib: IGradientReg, input: string) => {
  let result: IParsedGraient = {
    stops: [],
    angle: "",
    line: "",
    original: "",
  };
  let matchGradient, matchColorStop, stopResult: IGradientStop;

  regExpLib.gradientSearch.lastIndex = 0;

  matchGradient = regExpLib.gradientSearch.exec(input);
  if (matchGradient !== null) {
    result = {
      ...result,
      original: matchGradient[0],
    };

    if (matchGradient[1]) {
      result.line = matchGradient[1];
    }

    if (matchGradient[2]) {
      result.angle = matchGradient[2];
    }

    if (matchGradient[3]) {
      result.sideCorner = matchGradient[3];
    }

    regExpLib.colorStopSearch.lastIndex = 0;

    matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[5]);
    while (matchColorStop !== null) {
      const tinyColor = tinycolor(matchColorStop[1]);
      stopResult = {
        color: tinyColor.toRgbString(),
      };

      if (matchColorStop[2]) {
        stopResult.position = Number(
          (parseInt(matchColorStop[2], 10) / 100).toFixed(2),
        );
      }
      result.stops.push(stopResult);

      matchColorStop = regExpLib.colorStopSearch.exec(matchGradient[5]);
    }
  }

  return result;
};

export default (input: string) => {
  const regExpLib = generateRegExp();
  let result;
  const rGradientEnclosedInBrackets =
    /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/;
  const match = rGradientEnclosedInBrackets.exec(input);

  if (match !== null) {
    result = parseGradient(regExpLib, match[1]);

    if (result.original.trim() !== match[1].trim()) {
      result.parseWarning = true;
    }

    if (
      result.stops.every((item) => item.hasOwnProperty("position")) === false
    ) {
      result = "Not correct position";
    }
  } else {
    result = "Failed to find gradient";
  }

  return result;
};
