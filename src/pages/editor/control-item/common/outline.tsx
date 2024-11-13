import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";
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

  useEffect(() => {
    setLocalValueBorderWidth(valueBorderWidth);
    setLocalValueBorderColor(valueBorderColor);
  }, [valueBorderWidth, valueBorderColor]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <div
                style={{
                  backgroundColor: localValueBorderColor,
                }}
                className="h-9 w-9 flex-none cursor-pointer rounded-md border border-border"
              ></div>
            </PopoverTrigger>
            <PopoverContent className="z-[300] w-full p-0">
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
          </Popover>

          <div className="relative">
            <Input
              variant="secondary"
              className="h-9"
              onChange={(e) => {
                const newValue = e.target.value;
                setLocalValueBorderColor(newValue); // Update local state

                // Only propagate if it's not empty
                if (newValue !== "") {
                  onChangeBorderColor(newValue); // Propagate the value
                }
              }}
              value={localValueBorderColor} // Use local state for input value
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
              hex
            </div>
          </div>
        </div>
        <div className="relative">
          <Input
            variant="secondary"
            type="text"
            className="h-9"
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
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
            thickness
          </div>
        </div>
      </div>
    </div>
  );
}

export default Outline;
