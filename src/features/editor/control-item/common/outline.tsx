import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";
import Draggable from "react-draggable";
import { X } from "lucide-react";
function Outline({
  label,
  onChageBorderWidth,
  onChangeBorderColor,
  valueBorderWidth,
  valueBorderColor,
}: {
  label: string;
  onChageBorderWidth: (v: number) => void;
  onChangeBorderColor: (v: string) => void;
  valueBorderWidth: number;
  valueBorderColor: string;
}) {
  const [localValueBorderWidth, setLocalValueBorderWidth] = useState<
    string | number
  >(valueBorderWidth);
  const [localValueBorderColor, setLocalValueBorderColor] =
    useState<string>(valueBorderColor); // Allow for string
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalValueBorderWidth(valueBorderWidth);
    setLocalValueBorderColor(valueBorderColor);
  }, [valueBorderWidth, valueBorderColor]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-primary">
        {label}
      </Label>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Color
        </div>

        <div className="relative w-32">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <div
                  style={{
                    backgroundColor: localValueBorderColor,
                  }}
                  className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
                ></div>

                <Input
                  variant="secondary"
                  className="pointer-events-none h-8 pl-10"
                  value={localValueBorderColor}
                  onChange={() => {}}
                />
              </div>
            </PopoverTrigger>

            <Draggable handle=".drag-handle">
              <PopoverContent className="absolute bottom-[-5rem] right-[460px] z-[300] w-full p-0">
                <div className="drag-handle flex w-[266px] cursor-grab justify-between rounded-t-lg bg-popover px-4 pt-4">
                  <p className="text-sm font-bold">Stroke</p>
                  <div
                    className="h-4 w-4"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 cursor-pointer font-extrabold text-muted-foreground" />
                  </div>
                </div>
                <ColorPicker
                  value={localValueBorderColor}
                  format="hex"
                  gradient={true}
                  solid={true}
                  onChange={(v: string) => {
                    setLocalValueBorderColor(v);
                    onChangeBorderColor(v);
                  }}
                  allowAddGradientStops={true}
                />
              </PopoverContent>
            </Draggable>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Size
        </div>
        <div className="relative w-32">
          <Input
            variant="secondary"
            type="text"
            className="h-8"
            onChange={(e) => {
              const newValue = e.target.value;

              // Allow empty string or validate as a number
              if (
                newValue === "" ||
                (!isNaN(Number(newValue)) &&
                  Number(newValue) >= 0 &&
                  Number(newValue) <= 100)
              ) {
                setLocalValueBorderWidth(newValue); // Update local state

                // Only propagate if it's a valid number and not empty
                if (newValue !== "") {
                  onChageBorderWidth(Number(newValue)); // Propagate as a number
                }
              }
            }}
            value={localValueBorderWidth} // Use local state for input value
          />
        </div>
      </div>
    </div>
  );
}

export default Outline;
