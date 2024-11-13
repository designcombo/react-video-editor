import { FC, useEffect, useRef, useState } from "react";
import tinycolor from "tinycolor2";

import ColorPickerPanel from "../color-panel";
import InputRgba from "../color-control";

import { getHexAlpha, useDebounce, checkFormat } from "../utils";

import { IPropsComp, TPropsChange } from "../types";

const ColorPickerSolid: FC<IPropsComp> = ({
  value = "#ffffff",
  onChange = () => ({}),
  format = "rgb",
  debounceMS = 300,
  debounce = true,
  colorBoardHeight = 180,
}) => {
  const node = useRef<HTMLDivElement | null>(null);

  const [init, setInit] = useState<boolean>(true);
  const [color, setColor] = useState(getHexAlpha(value));

  const debounceColor = useDebounce(color, debounceMS);

  useEffect(() => {
    if (debounce && debounceColor && init === false) {
      if (value === "transparent" && color.alpha === 0) {
        color.alpha = 100;
      }

      const rgba = tinycolor(color.hex);
      rgba.setAlpha(color.alpha / 100);
      if (tinycolor(rgba).toRgbString() === tinycolor(value).toRgbString()) {
        return;
      }

      onChange(checkFormat(rgba.toRgbString(), format, debounceColor.alpha));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceColor]);

  // Issue https://github.com/undind/react-gcolor-picker/issues/6
  useEffect(() => {
    setColor(getHexAlpha(value));
  }, [value]);

  const onCompleteChange = (value: TPropsChange) => {
    setInit(false);
    setColor({
      hex: value.hex,
      alpha: Math.round(value.alpha),
    });
  };

  return (
    <div ref={node} className="flex flex-col gap-4">
      <ColorPickerPanel
        hex={color.hex}
        alpha={color.alpha}
        colorBoardHeight={colorBoardHeight}
        onChange={onCompleteChange}
      />
      <InputRgba
        hex={color.hex}
        alpha={color.alpha}
        format={format}
        onChange={setColor}
        onSubmitChange={onChange}
      />
    </div>
  );
};

export default ColorPickerSolid;
