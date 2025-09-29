import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleOff } from "lucide-react";
import {
  ICaptionsControlProps,
  NONE_PRESET,
  STYLE_CAPTION_PRESETS,
  getTextShadow
} from "../floating-controls/caption-preset-picker";

interface PresetGridProps {
  presets: ICaptionsControlProps[];
  captionItemIds: string[];
  captionsData: any[];
  onPresetClick: (
    preset: ICaptionsControlProps,
    captionItemIds: string[],
    captionsData: any[]
  ) => void;
}

const PresetGrid = ({
  presets,
  captionItemIds,
  captionsData,
  onPresetClick
}: PresetGridProps) => (
  <div className="grid gap-4 p-4">
    <div
      onClick={() => onPresetClick(NONE_PRESET, captionItemIds, captionsData)}
      className="flex h-[70px] cursor-pointer items-center justify-center bg-zinc-800 rounded-lg"
    >
      <CircleOff />
    </div>

    {presets.map((preset, index) => (
      <div
        key={index}
        onClick={() => onPresetClick(preset, captionItemIds, captionsData)}
        className="text-md flex h-[70px] cursor-pointer items-center justify-center bg-zinc-800 rounded-lg overflow-hidden"
      >
        {preset.previewUrl ? (
          <video
            src={preset.previewUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-40 place-content-center rounded-lg"
          />
        ) : (
          <div
            style={{
              backgroundColor:
                preset.backgroundColor !== "transparent"
                  ? preset.backgroundColor
                  : preset.activeFillColor,
              color: preset.activeColor,
              paintOrder: "stroke fill",
              fontWeight: "bold",
              textShadow: getTextShadow(preset.boxShadow),
              WebkitTextStroke: `1px ${preset.borderColor}`
            }}
            className="h-6 place-content-center rounded-lg px-2"
          >
            Text
          </div>
        )}
      </div>
    ))}
  </div>
);

interface PresetPickerProps {
  captionItemIds: string[];
  captionsData: any[];
  onPresetClick: (
    preset: ICaptionsControlProps,
    captionItemIds: string[],
    captionsData: any[]
  ) => void;
  className?: string;
}

export const PresetPicker = ({
  captionItemIds,
  captionsData,
  onPresetClick,
  className = ""
}: PresetPickerProps) => {
  const wordPresets = STYLE_CAPTION_PRESETS.filter(
    (preset) => preset.type === "word"
  );
  const linePresets = STYLE_CAPTION_PRESETS.filter(
    (preset) => preset.type !== "word"
  );

  return (
    <Tabs defaultValue="words" className={`w-full ${className}`}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="words">Words</TabsTrigger>
        <TabsTrigger value="lines">Lines</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[400px] w-full">
        <TabsContent value="words" className="mt-0">
          <PresetGrid
            presets={wordPresets}
            captionItemIds={captionItemIds}
            captionsData={captionsData}
            onPresetClick={onPresetClick}
          />
        </TabsContent>

        <TabsContent value="lines" className="mt-0">
          <PresetGrid
            presets={linePresets}
            captionItemIds={captionItemIds}
            captionsData={captionsData}
            onPresetClick={onPresetClick}
          />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
