import { ScrollArea } from "@/components/ui/scroll-area";
import useDataState from "../store/use-data-state";
import { loadFonts } from "../utils/fonts";
import { dispatch } from "@designcombo/events";
import { ADD_ANIMATION, EDIT_OBJECT } from "@designcombo/state";
import React, { useEffect, useState } from "react";
import { IBoxShadow, ICaption, ITrackItem } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import CaptionWords from "./common/caption-words";
import CaptionColors from "./common/caption-colors";
import { TextControls } from "./common/text";
import { Animation, presets } from "../player/animated";
import { PresetName } from "../player/animated/presets";
import { X } from "lucide-react";
import { ICompactFont, IFont } from "../interfaces/editor";
import { DEFAULT_FONT } from "../constants/font";

interface ITextControlProps {
  color: string;
  colorDisplay: string;
  appearedColor: string;
  activeColor: string;
  activeFillColor: string;
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

const BasicCaption = ({ trackItem }: { trackItem: ITrackItem & ICaption }) => {
  const [activeModalAnimation, setActiveModalAnimation] =
    useState<boolean>(false);
  const handleModalAnimation = (newState?: boolean) => {
    if (newState !== undefined) {
      setActiveModalAnimation(newState);
    } else {
      setActiveModalAnimation(!activeModalAnimation);
    }
  };
  const [properties, setProperties] = useState<ITextControlProps>({
    color: "#000000",
    colorDisplay: "#000000",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#ffffff",
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

    console.log({
      selectedFont,
      currentFont,
      fontFamily,
    });

    if (selectedFont) {
      setSelectedFont({
        ...selectedFont,
        name: getStyleNameFromFontName(currentFont.postScriptName),
      });
    }

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
      appearedColor: trackItem.details.appearedColor || "#ffffff",
      activeColor: trackItem.details.activeColor || "#ffffff",
      activeFillColor: trackItem.details.activeFillColor || "#ffffff",
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

  const applyAnimation = (presetName: PresetName, type: "in" | "out") => {
    if (!trackItem.id) {
      console.warn("No active ID to apply the animation to.");
      return;
    }
    const presetAnimation = presets[presetName];
    const composition: Animation[] = [presetAnimation];

    dispatch(ADD_ANIMATION, {
      payload: {
        id: trackItem.id,
        animations: {
          [type]: {
            name: presetName,
            composition,
          },
        },
      },
    });
  };
  const createPresetButtons = (
    filter: (key: string) => boolean,
    type: "in" | "out",
  ) =>
    Object.keys(presets)
      .filter(filter)
      .map((presetKey) => {
        const preset = presets[presetKey as "scaleIn"];
        const style = React.useMemo(
          () => ({
            backgroundImage: `url(${preset.previewUrl})`,
            backgroundSize: "cover",
            width: "50px",
            height: "50px",
            borderRadius: "8px",
          }),
          [preset.previewUrl],
        );
        if (
          preset.property?.toLowerCase().includes("text") ||
          preset.property?.toLowerCase().includes("shake")
        )
          return;

        return (
          <div
            key={presetKey}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground"
            onClick={() => applyAnimation(presetKey as PresetName, type)}
          >
            <div style={style} draggable={false} />
            <div>{preset.name}</div>
          </div>
        );
      });

  const presetInButtons = createPresetButtons(
    (key) => key.includes("In"),
    "in",
  );
  return (
    <>
      {activeModalAnimation && (
        <div
          className="absolute right-[275px] top-1/2 z-[200] mt-6 flex h-[calc(100%-180px)] w-[250px] -translate-y-1/2 rounded-lg bg-background/80 shadow-lg transition duration-300 ease-in-out"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex justify-between">
              <p>Animations</p>
              <X
                width={16}
                className="cursor-pointer"
                onClick={() => {
                  handleModalAnimation();
                }}
              />
            </div>
            <div className="h-full overflow-hidden">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-3 gap-2 py-4">
                  {presetInButtons}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-58px)] flex-1 flex-col overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 px-4">
            <CaptionWords
              id={trackItem.id}
              handleModalAnimation={handleModalAnimation}
            />
            <CaptionColors
              id={trackItem.id}
              activeColor={properties.activeColor}
              activeFillColor={properties.activeFillColor}
              appearedColor={properties.appearedColor}
            />

            <TextControls
              trackItem={trackItem}
              properties={properties}
              selectedFont={selectedFont}
              onChangeFontFamily={onChangeFontFamily}
              handleChangeFontStyle={handleChangeFontStyle}
              onChangeFontSize={onChangeFontSize}
              handleColorChange={handleColorChange}
              onChangeTextAlign={onChangeTextAlign}
              onChangeTextDecoration={onChangeTextDecoration}
              handleChangeOpacity={handleChangeOpacity}
              handleBackgroundChange={(v: string) => console.log(v)}
            />

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
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default BasicCaption;
