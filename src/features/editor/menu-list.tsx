import useLayoutStore from "./store/use-layout-store";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MenuList() {
  const { setActiveMenuItem, setShowMenuItem, activeMenuItem, showMenuItem } =
    useLayoutStore();
  return (
    <div className="flex w-14 flex-col items-center gap-1 border-r border-border/80 py-2">
      <Button
        onClick={() => {
          setActiveMenuItem("texts");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "texts"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.type width={16} />
      </Button>

      <Button
        onClick={() => {
          setActiveMenuItem("videos");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "videos"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.video width={16} />
      </Button>

      <Button
        onClick={() => {
          setActiveMenuItem("images");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "images"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.image width={16} />
      </Button>
      {/* <Button
        onClick={() => {
          setActiveMenuItem("shapes");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "shapes"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.shapes width={16} />
      </Button> */}
      <Button
        onClick={() => {
          setActiveMenuItem("audios");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "audios"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.audio width={16} />
      </Button>
    </div>
  );
}
