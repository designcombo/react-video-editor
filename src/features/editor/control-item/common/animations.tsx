import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { IText, ITrackItem } from "@designcombo/types";
import { Label } from "@/components/ui/label";
import useLayoutStore from "../../store/use-layout-store";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "../../store/use-store";
import { createPresetButtons } from "../floating-controls/animation-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimationDuration } from "./animation-duration";
interface PresetTextProps {
  trackItem: ITrackItem & any;
  properties: any;
}

export const Animations = ({ properties, trackItem }: PresetTextProps) => {
  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold">Animations</Label>
      <SelectaAnimation trackItem={trackItem} />
    </div>
  );
};

const SelectaAnimation = ({ trackItem }: { trackItem: ITrackItem & IText }) => {
  const { setFloatingControl } = useLayoutStore();
  const isLargeScreen = useIsLargeScreen();
  const { activeIds, trackItemsMap } = useStore();

  const presetInButtons = createPresetButtons(
    (key) => key.includes("In"),
    "in",
    activeIds,
    trackItem.type === "text" ? "text" : "media",
    trackItemsMap
  );
  const presetOutButtons = createPresetButtons(
    (key) => key.includes("Out"),
    "out",
    activeIds,
    trackItem.type === "text" ? "text" : "media",
    trackItemsMap
  );
  const presetLoopButtons = createPresetButtons(
    (key) => key.includes("Loop"),
    "loop",
    activeIds,
    trackItem.type === "text" ? "text" : "media",
    trackItemsMap
  );
  return (
    <div className="flex gap-2 py-0 flex-col lg:flex-row">
      <div className=" flex-1 items-center text-sm text-muted-foreground hidden lg:flex">
        Animation
      </div>
      {isLargeScreen ? (
        <div className="relative w-32">
          <Button
            className="flex h-8 w-full items-center justify-between text-sm"
            variant="secondary"
            onClick={() => setFloatingControl("animation-picker")}
          >
            <div className="w-full text-left">
              <p className="truncate">None</p>
            </div>
            <ChevronDown className="text-muted-foreground" size={14} />
          </Button>
        </div>
      ) : (
        <div className="flex w-full  flex-col gap-6">
          <Tabs defaultValue="in" className="w-full">
            <TabsList className="p-0 grid w-full grid-cols-3">
              <TabsTrigger value="in">In</TabsTrigger>
              <TabsTrigger value="loop">Loop</TabsTrigger>
              <TabsTrigger value="out">Out</TabsTrigger>
            </TabsList>
            <TabsContent value="in">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 py-4">
                  {presetInButtons}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="loop">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 py-4">
                  {presetLoopButtons}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="out">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 py-4">
                  {presetOutButtons}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <AnimationDuration />
        </div>
      )}
    </div>
  );
};
