import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

const Volume = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  // Create local state to manage opacity
  const [localValue, setLocalValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        Volume
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
          value={[localValue]} // Use local state for slider value
          onValueChange={(e) => {
            setLocalValue(e[0]); // Update local state
          }}
          onValueCommit={() => {
            onChange(localValue); // Propagate value to parent when user commits change
          }}
          max={100}
          step={1}
          aria-label="Temperature"
        />
        <Input
          variant="secondary"
          className="w-11 px-2 text-center text-sm"
          type="number"
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (newValue >= 0 && newValue <= 100) {
              setLocalValue(newValue); // Update local state
              onChange(newValue); // Optionally propagate immediately, or adjust as needed
            }
          }}
          value={localValue} // Use local state for input value
        />
      </div>
    </div>
  );
};

export default Volume;
