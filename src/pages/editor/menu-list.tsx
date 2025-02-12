import useLayoutStore from "./store/use-layout-store";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MenuList() {
  const { setActiveMenuItem, setShowMenuItem, activeMenuItem, showMenuItem } =
    useLayoutStore();
  return (
    <div
      style={{ zIndex: 201 }}
      className="absolute left-2.5 top-1/2 mt-6 flex w-14 -translate-y-1/2 flex-col items-center rounded-lg bg-background/80 py-2 shadow-lg backdrop-blur-lg backdrop-filter"
    >
      <Button
        onClick={() => {
          setActiveMenuItem("uploads");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "uploads"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.upload width={20} />
      </Button>
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
        <Icons.type width={20} />
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
        <Icons.video width={20} />
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
        <Icons.image width={20} />
      </Button>

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
        <Icons.audio width={20} />
      </Button>
    </div>
  );
}
