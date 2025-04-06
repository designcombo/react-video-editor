import { useRef, useState } from "react";
import useDataState from "../../store/use-data-state";
import { SearchIcon, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";
import useLayoutStore from "../../store/use-layout-store";
import useClickOutside from "../../hooks/useClickOutside";
import { ICompactFont, IFont } from "../../interfaces/editor";
import { loadFonts } from "../../utils/fonts";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";

export default function FontFamilyPicker() {
  const { compactFonts } = useDataState();
  const [search, setSearch] = useState("");
  const { setFloatingControl, trackItem } = useLayoutStore();

  const filteredFonts = compactFonts.filter((font) =>
    font.family.toLowerCase().includes(search.toLowerCase()),
  );

  const onChangeFontFamily = async (font: ICompactFont) => {
    const fontName = font.default.postScriptName;
    const fontUrl = font.default.url;

    await loadFonts([
      {
        name: fontName,
        url: fontUrl,
      },
    ]);

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem!.id]: {
          details: {
            fontFamily: fontName,
            fontUrl: fontUrl,
          },
        },
      },
    });
  };
  const floatingRef = useRef(null);
  useClickOutside(floatingRef, () => setFloatingControl(""));

  return (
    <Draggable handle=".handle">
      <div
        ref={floatingRef}
        className="absolute right-2 top-2 z-[200] w-56 border bg-sidebar p-0"
      >
        <div className="handle flex cursor-grab justify-between px-2 py-4">
          <p className="text-sm font-bold">Fonts</p>
          <div className="h-4 w-4" onClick={() => setFloatingControl("")}>
            <X className="h-4 w-4 cursor-pointer font-extrabold text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center p-2">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search font..."
            className="w-full rounded-md bg-transparent p-1 text-sm text-muted-foreground outline-none"
          />
        </div>
        <ScrollArea className="h-[400px] w-full py-2">
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font, index) => (
              <div
                key={index}
                onClick={() => onChangeFontFamily(font)}
                className="cursor-pointer px-2 py-1 hover:bg-zinc-800/50"
              >
                <img
                  style={{ filter: "invert(100%)" }}
                  src={font.default.preview}
                  alt={font.family}
                />
              </div>
            ))
          ) : (
            <p className="py-2 text-center text-sm text-muted-foreground">
              No font found
            </p>
          )}
        </ScrollArea>
      </div>
    </Draggable>
  );
}
