import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

const Speed = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  // Create local state to manage opacity
  const [localValue, setLocalValue] = useState<string | number>(value);

  // Update local state when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== "") {
      onChange(Number(localValue)); // Propagate as a number
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (localValue !== "") {
        onChange(Number(localValue)); // Propagate as a number
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        Speed
      </Label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 40px",
          gap: "4px",
        }}
      >
        <Slider
          id="opacity"
          value={[Number(localValue)]} // Use local state for slider value
          onValueChange={(e) => {
            setLocalValue(e[0]); // Update local state
          }}
          onValueCommit={() => {
            onChange(Number(localValue)); // Propagate value to parent when user commits change
          }}
          min={0}
          max={4}
          step={0.1}
          aria-label="Opacity"
        />
        <Input
          variant="secondary"
          className="w-11 px-2 text-center text-sm"
          value={localValue}
          onChange={(e) => {
            const newValue = e.target.value;

            // Allow empty string or validate as a number
            if (
              newValue === "" ||
              (!isNaN(Number(newValue)) && Number(newValue) >= 0)
            ) {
              setLocalValue(newValue); // Update local state
            }
          }}
          onBlur={handleBlur} // Trigger onBlur event
          onKeyDown={handleKeyDown} // Trigger onKeyDown event
        />
      </div>
    </div>
  );
};

export default Speed;
