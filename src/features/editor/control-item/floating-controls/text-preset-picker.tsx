import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import { ITrackItem } from "@designcombo/types";
import { CircleOff, XIcon } from "lucide-react";
import useLayoutStore from "../../store/use-layout-store";
import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import Draggable from "react-draggable";

interface IBoxShadow {
  color: string;
  x: number;
  y: number;
  blur: number;
}

interface ITextPreset {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  boxShadow?: IBoxShadow;
}

const NONE_PRESET: ITextPreset = {
  backgroundColor: "transparent",
  color: "#ffffff",
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "transparent",
};

const TEXT_PRESETS: ITextPreset[] = [
  {
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  {
    borderWidth: 12,
    borderColor: "#000",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: "#fff",
  },
  {
    borderWidth: 12,
    borderColor: "#fff",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: "#000",
  },
  {
    backgroundColor: "#8120fd",
    color: "#fff",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  {
    backgroundColor: "#ffde00",
    color: "#000",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  {
    backgroundColor: "transparent",
    color: "#6eb5d6",
    borderRadius: 10,
    borderWidth: 12,
    borderColor: "#0f1fac",
    boxShadow: { color: "#0f1fac", x: -12, y: 12, blur: 0 },
  },
  {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: 10,
    borderWidth: 12,
    borderColor: "#000",
    boxShadow: { color: "#000", x: -12, y: 12, blur: 0 },
  },
  {
    backgroundColor: "#000",
    color: "#6af1af",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: 10,
    borderWidth: 12,
    borderColor: "#dd4882",
    boxShadow: { color: "#dd4882", x: 0, y: 0, blur: 100 },
  },
  {
    backgroundColor: "transparent",
    color: "#000000",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    boxShadow: { color: "#5ed869", x: 8, y: 8, blur: 0 },
  },
  {
    backgroundColor: "transparent",
    color: "#f5be36",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    boxShadow: { color: "#b12019", x: 8, y: 8, blur: 0 },
  },
  {
    backgroundColor: "transparent",
    color: "#eed955",
    borderRadius: 10,
    borderWidth: 12,
    borderColor: "#000000",
  },
  {
    backgroundColor: "transparent",
    color: "#5ba2eb",
    borderRadius: 10,
    borderWidth: 12,
    borderColor: "#ffffff",
  },
];

const getTextShadow = (boxShadow?: IBoxShadow): string | undefined => {
  if (!boxShadow) return undefined;
  return `${boxShadow.x / 8}px ${boxShadow.y / 8}px ${boxShadow.blur / 8}px ${boxShadow.color}`;
};
export default function TextPresetPicker({
  trackItem,
}: {
  trackItem: ITrackItem & any;
}) {
  const applyPreset = (preset: any) => {
    console.log(preset);
    const overrides: any = {};
    if (preset.boxShadow === undefined) {
      preset.boxShadow = { color: "transparent", x: 0, y: 0, blur: 0 };
    }

    dispatch(EDIT_OBJECT, {
      payload: {
        [trackItem.id]: {
          details: { ...preset, ...overrides },
        },
      },
    });
  };

  const { setFloatingControl } = useLayoutStore();
  const floatingRef = useRef(null);
  useClickOutside(floatingRef, () => setFloatingControl(""));

  return (
    <Draggable handle=".handle">
      <div
        ref={floatingRef}
        className="absolute right-2 top-2 z-[200] w-56 border bg-sidebar p-0"
      >
        <div className="handle flex cursor-grab items-center justify-between px-4 py-3">
          <p className="text-sm font-bold">Presets</p>
          <div className="h-4 w-4" onClick={() => setFloatingControl("")}>
            <XIcon className="h-3 w-3 cursor-pointer font-extrabold text-muted-foreground" />
          </div>
        </div>

        <ScrollArea className="h-[400px] w-full py-0">
          <div className="grid grid-cols-3 gap-2 px-4">
            <div
              onClick={() => applyPreset(NONE_PRESET)}
              className="flex h-[70px] cursor-pointer items-center justify-center bg-zinc-800"
            >
              <CircleOff />
            </div>

            {TEXT_PRESETS.map((preset, index) => (
              <div
                key={index}
                onClick={() => applyPreset(preset)}
                className="text-md flex h-[70px] cursor-pointer items-center justify-center bg-zinc-800"
              >
                <div
                  style={{
                    backgroundColor: preset.backgroundColor,
                    color: preset.color,
                    borderRadius: `${preset.borderRadius}px`,
                    WebkitTextStroke: `2px ${preset.borderColor}`,
                    paintOrder: "stroke fill",
                    fontWeight: "bold",
                    textShadow: getTextShadow(preset.boxShadow),
                  }}
                  className="h-6 place-content-center px-2"
                >
                  Text
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Draggable>
  );
}
