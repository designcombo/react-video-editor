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
          setActiveMenuItem("captions");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "captions"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <Icons.captions width={20} />
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
        <Icons.shapes width={20} />
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

      <Button
        onClick={() => {
          setActiveMenuItem("transitions");
          setShowMenuItem(true);
        }}
        className={cn(
          showMenuItem && activeMenuItem === "transitions"
            ? "bg-secondary"
            : "text-muted-foreground",
        )}
        variant={"ghost"}
        size={"icon"}
      >
        <svg
          width={20}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5.30359C3 3.93159 4.659 3.24359 5.629 4.21359L11.997 10.5826L10.583 11.9966L5 6.41359V17.5856L10.586 11.9996L10.583 11.9966L11.997 10.5826L12 10.5856L18.371 4.21459C19.341 3.24459 21 3.93159 21 5.30359V18.6956C21 20.0676 19.341 20.7556 18.371 19.7856L12 13.5L13.414 11.9996L19 17.5866V6.41359L13.414 11.9996L13.421 12.0056L12.006 13.4206L12 13.4136L5.629 19.7846C4.659 20.7546 3 20.0676 3 18.6956V5.30359Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
  );
}
