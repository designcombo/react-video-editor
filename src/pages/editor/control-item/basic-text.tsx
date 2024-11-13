import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_FONT } from "@/data/fonts";
import { ICompactFont, IFont } from "@/interfaces/editor";
import useDataState from "../store/use-data-state";
import { loadFonts } from "../utils/fonts";
import { EDIT_OBJECT, dispatch } from "@designcombo/events";
import { ChevronDown, Strikethrough, Underline } from "lucide-react";
import { useEffect, useState } from "react";
import Opacity from "./common/opacity";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IBoxShadow, IText, ITrackItem } from "@designcombo/types";
import { Label } from "@/components/ui/label";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import ColorPicker from "@/components/color-picker";

interface ITextControlProps {
  color: string;
  colorDisplay: string;
  fontSize: number;
  fontSizeDisplay: string;
  fontFamily: string;
  fontFamilyDisplay: string;
  opacityDisplay: string;
  textAlign: string;
  textDecoration: string;
  borderWidth: number;
  borderColor: string;
  opacity: number;
  boxShadow: IBoxShadow;
}

const getStyleNameFromFontName = (fontName: string) => {
  const fontFamilyEnd = fontName.lastIndexOf("-");
  const styleName = fontName
    .substring(fontFamilyEnd + 1)
    .replace("Italic", " Italic");
  return styleName;
};

const BasicText = ({ trackItem }: { trackItem: ITrackItem & IText }) => {
  const [properties, setProperties] = useState<ITextControlProps>({
    color: "#000000",
    colorDisplay: "#000000",
    fontSize: 12,
    fontSizeDisplay: "12px",
    fontFamily: "Open Sans",
    fontFamilyDisplay: "Open Sans",
    opacity: 1,
    opacityDisplay: "100%",
    textAlign: "left",
    textDecoration: "none",
    borderWidth: 0,
    borderColor: "#000000",
    boxShadow: {
      color: "#000000",
      x: 0,
      y: 0,
      blur: 0,
    },
  });

  const [selectedFont, setSelectedFont] = useState<ICompactFont>({
    family: "Open Sans",
    styles: [],
    default: DEFAULT_FONT,
    name: "Regular",
  });
  const { compactFonts, fonts } = useDataState();

  useEffect(() => {
    const fontFamily =
      trackItem.details.fontFamily || DEFAULT_FONT.postScriptName;
    const currentFont = fonts.find(
      (font) => font.postScriptName === fontFamily,
    )!;
    const selectedFont = compactFonts.find(
      (font) => font.family === currentFont?.family,
    )!;
    if (!selectedFont) return;

    setSelectedFont({
      ...selectedFont,
      name: getStyleNameFromFontName(currentFont.postScriptName),
    });
    // if (trackItem.details.opacityDisplay == undefined) {
    //   trackItem.details.opa = "100";
    // }
    // if (trackItem.details.fontSizeDisplay == undefined) {
    //   trackItem.details.fontSizeDisplay = "62";
    // }
    setProperties({
      color: trackItem.details.color || "#ffffff",
      colorDisplay: trackItem.details.color || "#ffffff",
      fontSize: trackItem.details.fontSize || 62,
      fontSizeDisplay: (trackItem.details.fontSize || 62) + "px",
      fontFamily: selectedFont?.family || "Open Sans",
      fontFamilyDisplay: selectedFont?.family || "Open Sans",
      opacity: trackItem.details.opacity || 1,
      opacityDisplay: (trackItem.details.opacity.toString() || "100") + "%",
      textAlign: trackItem.details.textAlign || "left",
      textDecoration: trackItem.details.textDecoration || "none",
      borderWidth: trackItem.details.borderWidth || 0,
      borderColor: trackItem.details.borderColor || "#000000",
      boxShadow: trackItem.details.boxShadow || {
        color: "#000000",
        x: 0,
        y: 0,
        blur: 0,
      },
    });
  }, [trackItem.id]);

  const handleChangeFontStyle = async (font: IFont) => {
    const fontName = font.postScriptName;
    const fontUrl = font.url;
    const styleName = getStyleNameFromFontName(fontName);
    await loadFonts([
      {
        name: fontName,
        url: fontUrl,
      },
    ]);
    setSelectedFont({ ...selectedFont, name: styleName });
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontFamily: fontName,
            fontUrl: fontUrl,
          },
        },
      },
    });
  };

  const onChangeBorderWidth = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderWidth: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        borderWidth: v,
      } as ITextControlProps;
    });
  };

  const onChangeBorderColor = (v: string) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            borderColor: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        borderColor: v,
      } as ITextControlProps;
    });
  };

  const handleChangeOpacity = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            opacity: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        opacity: v,
      } as ITextControlProps;
    }); // Update local state
  };

  const onChangeBoxShadow = (boxShadow: IBoxShadow) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            boxShadow: boxShadow,
          },
        },
      },
    });

    setProperties((prev) => {
      return {
        ...prev,
        boxShadow,
      } as ITextControlProps;
    });
  };

  const onChangeFontSize = (v: number) => {
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontSize: v,
          },
        },
      },
    });
    setProperties((prev) => {
      return {
        ...prev,
        fontSize: v,
      } as ITextControlProps;
    });
  };

  const onChangeFontFamily = async (font: ICompactFont) => {
    const fontName = font.default.postScriptName;
    const fontUrl = font.default.url;

    await loadFonts([
      {
        name: fontName,
        url: fontUrl,
      },
    ]);
    setSelectedFont({ ...font, name: getStyleNameFromFontName(fontName) });
    setProperties({
      ...properties,
      fontFamily: font.default.family,
      fontFamilyDisplay: font.default.family,
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            fontFamily: fontName,
            fontUrl: fontUrl,
          },
        },
      },
    });
  };

  const handleColorChange = (color: string) => {
    setProperties((prev) => {
      return {
        ...prev,
        color: color,
      } as ITextControlProps;
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            color: color,
          },
        },
      },
    });
  };

  const onChangeTextAlign = (v: string) => {
    setProperties((prev) => {
      return {
        ...prev,
        textAlign: v,
      } as ITextControlProps;
    });
    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            textAlign: v,
          },
        },
      },
    });
  };

  const onChangeTextDecoration = (v: string) => {
    setProperties({
      ...properties,
      textDecoration: v,
    });

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: {
            textDecoration: v,
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Text
      </div>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-2">
            <FontFamily
              handleChangeFont={onChangeFontFamily}
              fontFamilyDisplay={properties.fontFamilyDisplay}
            />
            <div className="grid grid-cols-2 gap-2">
              <FontStyle
                selectedFont={selectedFont}
                handleChangeFontStyle={handleChangeFontStyle}
              />
              <FontSize
                value={properties.fontSize}
                onChange={onChangeFontSize}
              />
            </div>
            <FontColor
              value={properties.color}
              handleColorChange={handleColorChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Alignment
              value={properties.textAlign}
              onChange={onChangeTextAlign}
            />
            <TextDecoration
              value={properties.textDecoration}
              onChange={onChangeTextDecoration}
            />
          </div>
          <FontCase id={trackItem.id} />
          <Outline
            label="Font stroke"
            onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
            onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
            valueBorderWidth={properties.borderWidth as number}
            valueBorderColor={properties.borderColor as string}
          />
          <Shadow
            label="Font shadow"
            onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
            value={properties.boxShadow!}
          />
          <Opacity
            onChange={(v: number) => handleChangeOpacity(v)}
            value={properties.opacity!}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

const FontColor = ({
  value,
  handleColorChange,
}: {
  value: string;
  handleColorChange: (color: string) => void;
}) => {
  const [localValue, setLocalValue] = useState<string>(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <div
            style={{ background: localValue || "#ffffff" }}
            className="h-9 w-9 flex-none cursor-pointer rounded-md border border-border"
          ></div>
        </PopoverTrigger>
        <PopoverContent className="z-[300] w-full p-0">
          <ColorPicker
            value={localValue}
            format="hex"
            gradient={true}
            solid={true}
            onChange={(v: string) => {
              setLocalValue(v);
              handleColorChange(v);
            }}
            allowAddGradientStops={true}
          />
        </PopoverContent>
      </Popover>
      <div className="relative">
        <Input
          variant="secondary"
          className="h-9"
          value={localValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setLocalValue(newValue); // Update local state
            // Only propagate if it's not empty
            if (newValue !== "") {
              handleColorChange(newValue); // Propagate the value
            }
          }}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
          hex
        </div>
      </div>
    </div>
  );
};

const FontSize = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [localValue, setLocalValue] = useState<string | number>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== "") {
      onChange(Number(localValue)); // Propagate as a number
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (localValue !== "") {
        onChange(Number(localValue)); // Propagate as a number
      }
    }
  };

  return (
    <div className="relative">
      <Input
        variant="secondary"
        className="h-9"
        value={localValue}
        onChange={(e) => {
          const newValue = e.target.value;

          // Allow empty string or validate as a number
          if (
            newValue === "" ||
            (!isNaN(Number(newValue)) && Number(newValue) >= 0)
          ) {
            setLocalValue(newValue); // Update local state
          }
        }}
        onBlur={handleBlur} // Trigger onBlur event
        onKeyDown={handleKeyDown} // Trigger onKeyDown event
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
        px
      </div>
    </div>
  );
};

const FontFamily = ({
  handleChangeFont,
  fontFamilyDisplay,
}: {
  handleChangeFont: (font: ICompactFont) => void;
  fontFamilyDisplay: string;
}) => {
  const { compactFonts } = useDataState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex w-full items-center justify-between text-sm"
          variant="secondary"
        >
          <div className="w-full text-left">
            <p className="truncate">{fontFamilyDisplay}</p>
          </div>
          <ChevronDown className="text-muted-foreground" size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[300] w-56 p-0">
        <ScrollArea className="h-[400px] w-full py-2">
          {compactFonts.map((font, index) => (
            <div
              onClick={() => handleChangeFont(font)}
              className="cursor-pointer px-2 py-1 hover:bg-zinc-800/50"
              key={index}
            >
              <img
                style={{
                  filter: "invert(100%)",
                }}
                src={font.default.preview}
                alt={font.family}
              />
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const FontStyle = ({
  selectedFont,
  handleChangeFontStyle,
}: {
  selectedFont: ICompactFont;
  handleChangeFontStyle: (font: IFont) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex w-full items-center justify-between text-sm"
          variant="secondary"
        >
          <div className="w-full overflow-hidden text-left">
            <p className="truncate"> {selectedFont.name}</p>
          </div>
          <ChevronDown className="text-muted-foreground" size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-[300] w-28 p-0">
        {selectedFont.styles.map((style, index) => {
          const fontFamilyEnd = style.postScriptName.lastIndexOf("-");
          const styleName = style.postScriptName
            .substring(fontFamilyEnd + 1)
            .replace("Italic", " Italic");
          return (
            <div
              className="flex h-6 cursor-pointer items-center px-2 py-3.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              key={index}
              onClick={() => handleChangeFontStyle(style)}
            >
              {styleName}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
const TextDecoration = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  return (
    <ToggleGroup
      value={localValue.split(" ")}
      size="sm"
      className="grid grid-cols-3"
      type="multiple"
      onValueChange={(v) => onChange(v.filter((v) => v !== "none").join(" "))}
      variant={"secondary"}
    >
      <ToggleGroupItem size="sm" value="underline" aria-label="Toggle left">
        <Underline size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="line-through" aria-label="Toggle italic">
        <Strikethrough size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="overline" aria-label="Toggle strikethrough">
        <div>
          <svg
            width={18}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.59996 1.75977C5.43022 1.75977 5.26744 1.82719 5.14741 1.94722C5.02739 2.06724 4.95996 2.23003 4.95996 2.39977C4.95996 2.5695 5.02739 2.73229 5.14741 2.85231C5.26744 2.97234 5.43022 3.03977 5.59996 3.03977H18.4C18.5697 3.03977 18.7325 2.97234 18.8525 2.85231C18.9725 2.73229 19.04 2.5695 19.04 2.39977C19.04 2.23003 18.9725 2.06724 18.8525 1.94722C18.7325 1.82719 18.5697 1.75977 18.4 1.75977H5.59996ZM7.99996 6.79977C7.99996 6.58759 7.91568 6.38411 7.76565 6.23408C7.61562 6.08405 7.41213 5.99977 7.19996 5.99977C6.98779 5.99977 6.7843 6.08405 6.63428 6.23408C6.48425 6.38411 6.39996 6.58759 6.39996 6.79977V15.2798C6.39996 16.765 6.98996 18.1894 8.04016 19.2396C9.09037 20.2898 10.5147 20.8798 12 20.8798C13.4852 20.8798 14.9096 20.2898 15.9598 19.2396C17.01 18.1894 17.6 16.765 17.6 15.2798V6.79977C17.6 6.58759 17.5157 6.38411 17.3656 6.23408C17.2156 6.08405 17.0121 5.99977 16.8 5.99977C16.5878 5.99977 16.3843 6.08405 16.2343 6.23408C16.0842 6.38411 16 6.58759 16 6.79977V15.2798C16 16.3406 15.5785 17.358 14.8284 18.1082C14.0782 18.8583 13.0608 19.2798 12 19.2798C10.9391 19.2798 9.92168 18.8583 9.17153 18.1082C8.42139 17.358 7.99996 16.3406 7.99996 15.2798V6.79977Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

const Alignment = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <ToggleGroup
      value={localValue}
      size="sm"
      className="grid grid-cols-3"
      type="single"
      onValueChange={(v) => {
        onChange(v);
        setLocalValue(v);
      }}
      variant={"secondary"}
    >
      <ToggleGroupItem size="sm" value="left" aria-label="Toggle left">
        <AlignLeft size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Toggle italic">
        <AlignCenter size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle strikethrough">
        <AlignRight size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

const FontCase = ({ id }: { id: string }) => {
  const [value, setValue] = useState("none");
  const onChangeAligment = (value: string) => {
    setValue(value);
    dispatch(EDIT_OBJECT, {
      payload: {
        [id]: {
          details: {
            textTransform: value,
          },
        },
      },
    });
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        Font case
      </Label>
      <div className="flex">
        <ToggleGroup
          value={value}
          size="sm"
          className="grid grid-cols-2 text-sm"
          type="single"
          onValueChange={onChangeAligment}
          variant={"secondary"}
        >
          <ToggleGroupItem size="sm" value="uppercase" aria-label="Toggle left">
            Uppercase
          </ToggleGroupItem>
          <ToggleGroupItem value="none" aria-label="Toggle italic">
            As typed
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default BasicText;
