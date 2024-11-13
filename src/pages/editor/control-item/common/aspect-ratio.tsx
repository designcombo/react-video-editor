import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export default function AspectRatio() {
  const [value, setValue] = useState("locked");
  const onChangeAligment = (value: string) => {
    setValue(value);
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        Aspect ratio
      </Label>
      <div className="flex">
        <ToggleGroup
          value={value}
          size="sm"
          className="grid grid-cols-2 text-sm"
          type="single"
          onValueChange={onChangeAligment}
          variant={"secondary"}
        >
          <ToggleGroupItem value="locked" aria-label="Toggle italic">
            Locked
          </ToggleGroupItem>
          <ToggleGroupItem size="sm" value="unlocked" aria-label="Toggle left">
            Unlocked
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
