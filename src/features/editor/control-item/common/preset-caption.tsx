import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { IText, ITrackItem } from "@designcombo/types";
import { Label } from "@/components/ui/label";
import useLayoutStore from "../../store/use-layout-store";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import {
  applyPreset,
  groupCaptionItems
} from "../floating-controls/caption-preset-picker";
import useStore from "../../store/use-store";
import { PresetPicker } from "./preset-picker";

interface PresetTextProps {
  trackItem: ITrackItem & any;
  properties: any;
}

export const PresetCaption = ({ properties, trackItem }: PresetTextProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-sans text-xs font-semibold">CaptionXX</Label>
      <PresetCaptionContent trackItem={trackItem} />
    </div>
  );
};

const PresetCaptionContent = ({
  trackItem
}: {
  trackItem: ITrackItem & IText;
}) => {
  const { setFloatingControl } = useLayoutStore();
  const [captionItemIds, setCaptionItemIds] = useState<string[]>([]);
  const [captionsData, setCaptionsData] = useState<any[]>([]);
  const { trackItemsMap } = useStore();
  const isLargeScreen = useIsLargeScreen();

  useEffect(() => {
    const groupedCaptions = groupCaptionItems(trackItemsMap);

    const currentGroupItems = groupedCaptions[trackItem.metadata.sourceUrl];
    const captionItemIds = currentGroupItems?.map((item) => item.id);
    setCaptionItemIds(captionItemIds);
    setCaptionsData(currentGroupItems);
  }, [trackItemsMap, trackItem]);

  const handlePresetClick = (
    preset: any,
    captionItemIds: string[],
    captionsData: any[]
  ) => {
    applyPreset(preset, captionItemIds, captionsData);
  };

  return (
    <div className="flex gap-2 py-0 flex-col lg:flex-row">
      <div className="flex flex-1 items-center text-sm text-muted-foreground">
        Preset
      </div>
      {isLargeScreen ? (
        <div className="relative w-32">
          <Button
            className="flex h-8 w-full items-center justify-between text-sm"
            variant="secondary"
            onClick={() => setFloatingControl("caption-preset-picker")}
          >
            <div className="w-full text-left">
              <p className="truncate">None</p>
            </div>
            <ChevronDown className="text-muted-foreground" size={14} />
          </Button>
        </div>
      ) : (
        <PresetPicker
          captionItemIds={captionItemIds}
          captionsData={captionsData}
          onPresetClick={handlePresetClick}
        />
      )}
    </div>
  );
};
