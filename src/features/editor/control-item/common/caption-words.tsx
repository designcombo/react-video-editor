import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import useLayoutStore from "../../store/use-layout-store";

const CaptionWords = ({
  handleModalAnimation,
}: {
  id: string;
  handleModalAnimation: (newState?: boolean) => void;
}) => {
  const { setFloatingControl } = useLayoutStore();

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        popoverRef.current &&
        event.target instanceof Node &&
        !popoverRef.current.contains(event.target)
      ) {
        handleModalAnimation(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-primary">
        Words
      </Label>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Lines
        </div>
        <div className="relative w-32">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="flex h-8 w-full items-center justify-between text-sm"
                variant="secondary"
              >
                <div className="w-full overflow-hidden text-left">
                  <p className="truncate">Two</p>
                </div>
                <ChevronDown className="text-muted-foreground" size={14} />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[300] w-32 p-0">
              <Button size={"sm"} variant="ghost" className="w-full">
                One
              </Button>
              <Button size={"sm"} variant="ghost" className="w-full">
                Two
              </Button>
              <Button size={"sm"} variant="ghost" className="w-full">
                Three
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Words in line
        </div>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-8 w-full items-center justify-between text-sm"
                  variant="secondary"
                >
                  <div className="w-full overflow-hidden text-left">
                    <p className="truncate">Multiple</p>
                  </div>
                  <ChevronDown className="text-muted-foreground" size={14} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-[300] w-32 p-0">
                <Button size={"sm"} variant="ghost" className="w-full">
                  One
                </Button>
                <Button size={"sm"} variant="ghost" className="w-full">
                  Multiple
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center text-sm text-muted-foreground">
          Position
        </div>
        <div className="flex gap-2">
          <div className="relative w-32">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-8 w-full items-center justify-between text-sm"
                  variant="secondary"
                >
                  <div className="w-full overflow-hidden text-left">
                    <p className="truncate">Auto</p>
                  </div>
                  <ChevronDown className="text-muted-foreground" size={14} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-[300] w-32 p-0">
                <Button size={"sm"} variant="ghost" className="w-full">
                  Auto
                </Button>
                <Button size={"sm"} variant="ghost" className="w-full">
                  Top
                </Button>
                <Button size={"sm"} variant="ghost" className="w-full">
                  Center
                </Button>
                <Button size={"sm"} variant="ghost" className="w-full">
                  Bottom
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

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

export default CaptionWords;
