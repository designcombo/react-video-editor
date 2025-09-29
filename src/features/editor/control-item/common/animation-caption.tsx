import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import useLayoutStore from "../../store/use-layout-store";
import { Label } from "@/components/ui/label";

const AnimationCaption = () => {
  const { setFloatingControl } = useLayoutStore();

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold">Animations</Label>

      <div className="flex gap-2 py-0">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Animation
        </div>
        <div className="relative w-32">
          <Button
            className="flex h-8 w-full items-center justify-between text-sm"
            variant="secondary"
            onClick={() => setFloatingControl("animation-caption")}
          >
            <div className="w-full text-left">
              <p className="truncate">None</p>
            </div>
            <ChevronDown className="text-muted-foreground" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimationCaption;
