import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBoxShadow } from "@designcombo/types";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";

function Shadow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: IBoxShadow;
  onChange: (v: IBoxShadow) => void;
}) {
  const [localValue, setLocalValue] = useState<IBoxShadow>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
                style={{ backgroundColor: localValue.color }}
                className="h-9 w-9 flex-none cursor-pointer rounded-md border border-border"
              ></div>
            </PopoverTrigger>
            <PopoverContent className="z-[300] w-full p-0">
              <ColorPicker
                value={localValue.color}
                format="hex"
                gradient={true}
                solid={true}
                onChange={(v: string) => {
                  setLocalValue((prev) => ({
                    ...prev,
                    color: v,
                  })); // Update local state
                  if (v !== "") {
                    onChange({
                      ...localValue,
                      color: v,
                    }); // Propagate immediately if not empty
                  }
                }}
                allowAddGradientStops={true}
              />
            </PopoverContent>
          </Popover>

          <div className="relative">
            <Input
              variant="secondary"
              className="h-9"
              value={localValue.color}
              onChange={(e) => {
                const newValue = e.target.value;
                setLocalValue((prev) => ({
                  ...prev,
                  color: newValue,
                })); // Update local state
                if (newValue !== "") {
                  onChange({
                    ...localValue,
                    color: newValue,
                  }); // Propagate immediately if not empty
                }
              }}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
              hex
            </div>
          </div>
        </div>

        {/* X Input */}
        <div className="relative">
          <Input
            variant="secondary"
            className="h-9"
            value={localValue.x}
            onChange={(e) => {
              const newValue = e.target.value;

              // Allow empty string or validate as a number
              if (
                newValue === "" ||
                (!isNaN(Number(newValue)) && Number(newValue) >= 0)
              ) {
                setLocalValue((prev) => ({
                  ...prev,
                  x: (newValue === ""
                    ? ""
                    : Number(newValue)) as unknown as number,
                })); // Update local state

                // Only propagate if it's a valid number and not empty
                if (newValue !== "") {
                  onChange({
                    ...localValue,
                    x: Number(newValue),
                  }); // Propagate as a number
                }
              }
            }}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
            x
          </div>
        </div>

        {/* Y Input */}
        <div className="relative">
          <Input
            variant="secondary"
            className="h-9"
            value={localValue.y}
            onChange={(e) => {
              const newValue = e.target.value;

              // Allow empty string or validate as a number
              if (
                newValue === "" ||
                (!isNaN(Number(newValue)) && Number(newValue) >= 0)
              ) {
                setLocalValue((prev) => ({
                  ...prev,
                  y: (newValue === ""
                    ? ""
                    : Number(newValue)) as unknown as number,
                })); // Update local state

                // Only propagate if it's a valid number and not empty
                if (newValue !== "") {
                  onChange({
                    ...localValue,
                    y: Number(newValue),
                  }); // Propagate as a number
                }
              }
            }}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
            y
          </div>
        </div>

        {/* Blur Input */}
        <div className="relative">
          <Input
            variant="secondary"
            className="h-9"
            value={localValue.blur}
            onChange={(e) => {
              const newValue = e.target.value;

              // Allow empty string or validate as a number
              if (
                newValue === "" ||
                (!isNaN(Number(newValue)) && Number(newValue) >= 0)
              ) {
                setLocalValue((prev) => ({
                  ...prev,
                  blur: (newValue === ""
                    ? ""
                    : Number(newValue)) as unknown as number,
                })); // Update local state

                // Only propagate if it's a valid number and not empty
                if (newValue !== "") {
                  onChange({
                    ...localValue,
                    blur: Number(newValue),
                  }); // Propagate as a number
                }
              }
            }}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
            blur
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shadow;
