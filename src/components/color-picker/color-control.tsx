import { FC, useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { checkFormat } from "./utils";
import { getAlphaValue, onlyDigits, onlyLatins } from "./helpers";
// import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "../ui/input";

interface IChange {
  hex: string;
  alpha: number;
}

type TProps = {
  hex: string;
  alpha: number;
  format?: "rgb" | "hsl" | "hex";
  onChange: ({ hex, alpha }: IChange) => void;
  onSubmitChange?: (rgba: string) => void;
};

const InputRgba: FC<TProps> = ({
  hex,
  alpha,
  format = "rgb",
  onChange,
  onSubmitChange,
}) => {
  const [color, setColor] = useState({
    alpha,
    hex,
  });

  const onChangeAlpha = (alpha: string) => {
    const validAlpha = getAlphaValue(alpha);

    setColor({
      ...color,
      alpha: Number(validAlpha),
    });
  };

  const onChangeHex = (hex: string) => {
    setColor({
      ...color,
      hex,
    });
  };

  const onHandleSubmit = () => {
    const rgba = tinycolor(color.hex[0] === "#" ? color.hex : "#" + color.hex);
    rgba.setAlpha(Number(color.alpha) / 100);

    if (rgba && (color.alpha !== alpha || color.hex !== hex)) {
      onChange({
        hex: color.hex[0] === "#" ? color.hex : "#" + color.hex,
        alpha: Number(color.alpha),
      });
      if (onSubmitChange) {
        onSubmitChange(checkFormat(rgba.toRgbString(), format, color.alpha));
      }
    } else {
      setColor({
        hex,
        alpha,
      });
      onChange({
        hex,
        alpha,
      });
    }
  };

  useEffect(() => {
    setColor({
      hex,
      alpha,
    });
  }, [hex, alpha]);

  return (
    <div
      style={{
        gridTemplateColumns: "5fr 2fr",
      }}
      className="grid gap-2"
    >
      <div className="relative">
        <Popover>
          <PopoverTrigger className="absolute left-3 top-0 flex h-full items-center gap-1 border-r border-black/15 pr-2 text-sm font-medium">
            Hex
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
              width={12}
              className="text-muted-foreground"
            >
              <path d="M39.6 17.443 24.043 33 8.487 17.443"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent className="w-16">
            <div>Hex</div>
          </PopoverContent>
        </Popover>
        <Input
          variant="secondary"
          value={color.hex}
          onChange={(e) => onChangeHex(onlyLatins(e.target.value))}
          onBlur={onHandleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onHandleSubmit();
            }
          }}
          className="pl-[70px]"
        />
      </div>
      <div className="relative">
        <Input
          variant="secondary"
          value={color.alpha}
          onChange={(e) => onChangeAlpha(onlyDigits(e.target.value))}
          onBlur={onHandleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onHandleSubmit();
            }
          }}
          className="pl-2"
        />
        <div className="pointer-events-none absolute bottom-0 right-3 top-0 flex w-2.5 items-center justify-center pt-0.5">
          %
        </div>
      </div>
    </div>
  );
};

export default InputRgba;
