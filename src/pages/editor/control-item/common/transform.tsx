import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RotateCw } from "lucide-react";
import { useState } from "react";

const Transform = () => {
  const [_, setValue] = useState([10]);

  return (
    <div className="flex flex-col gap-2">
      <div>Transform</div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-400">Scale</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 40px 24px",
            gap: "4px",
          }}
        >
          <Slider
            id="opacity"
            max={1}
            step={0.1}
            onValueChange={setValue}
            aria-label="Temperature"
          />
          <Input className="w-11 px-2 text-center text-sm" defaultValue={100} />
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-zinc-400"
            >
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-400">Position</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 24px",
            gap: "4px",
          }}
        >
          <div className="relative">
            <Input className="px-2 text-sm" defaultValue={100} />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-zinc-200">
              x
            </div>
          </div>
          <div className="relative">
            <Input className="px-2 text-sm" defaultValue={100} />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 transform text-zinc-200">
              y
            </div>
          </div>

          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-zinc-400"
            >
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-400">Rotate</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 24px",
            gap: "4px",
          }}
        >
          <Input className="px-2 text-sm" defaultValue={100} />
          <div></div>
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-zinc-400"
            >
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transform;
