import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DEFAULT_FONT } from '@/data/fonts';
import { ICompactFont, IFont } from '@/interfaces/editor';
import useDataState from '@/store/use-data-state';
import { loadFonts } from '@/utils/fonts';
import { EDIT_OBJECT, ITrackItem, dispatcher } from '@designcombo/core';
import { ChevronDown, Ellipsis, Strikethrough, Underline } from 'lucide-react';
import { useEffect, useState } from 'react';
import Opacity from './common/opacity';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Transform from './common/transform';

interface ITextControlProps {
  color: string;
  colorDisplay: string;
  fontSize: number;
  fontSizeDisplay: string;
  fontFamily: string;
  fontFamilyDisplay: string;
  opacity: number;
  opacityDisplay: string;
  textAlign: string;
  textDecoration: string;
}

const getStyleNameFromFontName = (fontName: string) => {
  const fontFamilyEnd = fontName.lastIndexOf('-');
  const styleName = fontName
    .substring(fontFamilyEnd + 1)
    .replace('Italic', ' Italic');
  return styleName;
};

const BasicText = ({ trackItem }: { trackItem: ITrackItem }) => {
  const [properties, setProperties] = useState<ITextControlProps>({
    color: '#000000',
    colorDisplay: '#000000',
    fontSize: 12,
    fontSizeDisplay: '12px',
    fontFamily: 'Open Sans',
    fontFamilyDisplay: 'Open Sans',
    opacity: 1,
    opacityDisplay: '100%',
    textAlign: 'left',
    textDecoration: 'none',
  });

  const [selectedFont, setSelectedFont] = useState<ICompactFont>({
    family: 'Open Sans',
    styles: [],
    default: DEFAULT_FONT,
    name: 'Regular',
  });
  const { compactFonts, fonts } = useDataState();

  useEffect(() => {
    const fontFamily =
      trackItem.details.fontFamily || DEFAULT_FONT.postScriptName;
    const currentFont = fonts.find(
      (font) => font.postScriptName === fontFamily,
    );
    const selectedFont = compactFonts.find(
      (font) => font.family === currentFont?.family,
    );

    setSelectedFont({
      ...selectedFont,
      name: getStyleNameFromFontName(currentFont.postScriptName),
    });

    if (trackItem.details.opacityDisplay == undefined) {
      trackItem.details.opacityDisplay = '100';
    }

    if (trackItem.details.fontSizeDisplay == undefined) {
      trackItem.details.fontSizeDisplay = '62';
    }
    setProperties({
      color: trackItem.details.color || '#ffffff',
      colorDisplay: trackItem.details.color || '#ffffff',
      fontSize: trackItem.details.fontSize || 62,
      fontSizeDisplay: (trackItem.details.fontSize || 62) + 'px',
      fontFamily: selectedFont?.family || 'Open Sans',
      fontFamilyDisplay: selectedFont?.family || 'Open Sans',
      opacity: trackItem.details.opacity || 1,
      opacityDisplay: (trackItem.details.opacityDisplay || '100') + '%',
      textAlign: trackItem.details.textAlign || 'left',
      textDecoration: trackItem.details.textDecoration || 'none',
    });
  }, [trackItem.id]);

  const handleChangeFont = async (font: ICompactFont) => {
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

    dispatcher.dispatch(EDIT_OBJECT, {
      payload: {
        details: {
          fontFamily: fontName,
          fontUrl: fontUrl,
        },
      },
    });
  };

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
    dispatcher.dispatch(EDIT_OBJECT, {
      payload: {
        details: {
          fontFamily: fontName,
          fontUrl: fontUrl,
        },
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md text-text-primary font-medium h-12  flex items-center px-4 flex-none">
        Text
      </div>
      <ScrollArea className="h-full">
        <div className="px-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <FontFamily
                handleChangeFont={handleChangeFont}
                fontFamilyDisplay={properties.fontFamilyDisplay}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FontStyle
                selectedFont={selectedFont}
                handleChangeFontStyle={handleChangeFontStyle}
              />
              <div className="relative">
                <Input className="h-9" defaultValue={88} />
                <div className="absolute top-1/2 transform -translate-y-1/2 right-2.5 text-sm text-zinc-200">
                  px
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Alignment />
            <TextDecoration />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="text-sm">Style</div>
          <Fill />
          <Stroke />
          <Shadow />
          <Background />
        </div>

        <div className="p-4">
          <Opacity />
        </div>
        <div className="p-4">
          <Transform />
        </div>
      </ScrollArea>
    </div>
  );
};

const Fill = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 24px 24px',
        gap: '4px',
      }}
    >
      <div className="text-sm text-zinc-500  flex items-center">Fill</div>
      <div>
        <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
      </div>
      <div>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <Ellipsis size={14} />
        </Button>
      </div>
    </div>
  );
};

const Stroke = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 24px 24px',
        gap: '4px',
      }}
    >
      <div className="text-sm text-zinc-500  flex items-center">Stroke</div>
      <div>
        <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
      </div>
      <div>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <Ellipsis size={14} />
        </Button>
      </div>
    </div>
  );
};
const Shadow = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 24px 24px',
        gap: '4px',
      }}
    >
      <div className="text-sm text-zinc-500  flex items-center">Shadow</div>
      <div>
        <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
      </div>
      <div>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <Ellipsis size={14} />
        </Button>
      </div>
    </div>
  );
};
const Background = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 24px 24px',
        gap: '4px',
      }}
    >
      <div className="text-sm text-zinc-500  flex items-center">Background</div>
      <div>
        <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
      </div>
      <div>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <Ellipsis size={14} />
        </Button>
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
          size="sm"
          className="flex items-center justify-between text-sm w-full"
          variant="outline"
        >
          <div className="w-full text-left ">
            <p className="truncate">{fontFamilyDisplay}</p>
          </div>
          <ChevronDown size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-56 z-[300]">
        <ScrollArea className="h-[400px] w-full py-2">
          {compactFonts.map((font, index) => (
            <div
              onClick={() => handleChangeFont(font)}
              className="hover:bg-zinc-800/50 cursor-pointer px-2 py-1"
              key={index}
            >
              <img
                style={{
                  filter: 'invert(100%)',
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
          size="sm"
          className="w-full flex items-center justify-between text-sm"
          variant="outline"
        >
          <div className="w-full text-left overflow-hidden">
            <p className="truncate"> {selectedFont.name}</p>
          </div>
          <ChevronDown size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-28 z-[300]">
        {selectedFont.styles.map((style, index) => {
          const fontFamilyEnd = style.postScriptName.lastIndexOf('-');
          const styleName = style.postScriptName
            .substring(fontFamilyEnd + 1)
            .replace('Italic', ' Italic');
          return (
            <div
              className="text-sm h-6 hover:bg-zinc-800 flex items-center px-2 py-3.5 cursor-pointer text-zinc-300 hover:text-zinc-100"
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
const TextDecoration = () => {
  const [value, setValue] = useState(['left']);
  const onChangeAligment = (value: string[]) => {
    setValue(value);
  };
  return (
    <ToggleGroup
      value={value}
      size="sm"
      className="grid grid-cols-3"
      type="multiple"
      onValueChange={onChangeAligment}
    >
      <ToggleGroupItem size="sm" value="left" aria-label="Toggle left">
        <Underline size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle italic">
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

const Alignment = () => {
  const [value, setValue] = useState('left');
  const onChangeAligment = (value: string) => {
    setValue(value);
  };
  return (
    <ToggleGroup
      value={value}
      size="sm"
      className="grid grid-cols-3"
      type="single"
      onValueChange={onChangeAligment}
    >
      <ToggleGroupItem size="sm" value="left" aria-label="Toggle left">
        <AlignLeft size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <AlignCenter size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <AlignRight size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default BasicText;
