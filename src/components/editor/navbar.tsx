import { Button } from "@/components/ui/button";
import {
  DESIGN_RESIZE,
  HISTORY_UNDO,
  HISTORY_REDO,
  dispatcher,
  useEditorState,
} from "@designcombo/core";
import logoDark from "@/assets/logo-dark.png";
import { Icons } from "../shared/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download } from "lucide-react";

const baseUrl = "https://api.x-eight.xyz";

export default function Navbar() {
  const {
    trackItemIds,
    trackItemsMap,
    transitionIds,
    transitionsMap,
    tracks,
    duration,
  } = useEditorState();
  const handleUndo = () => {
    dispatcher.dispatch(HISTORY_UNDO);
  };

  const handleRedo = () => {
    dispatcher.dispatch(HISTORY_REDO);
  };

  const handleExport = () => {
    const payload = {
      trackItemIds,
      trackItemsMap,
      transitionIds,
      transitionsMap,
      tracks,
      size: {
        width: 1080,
        height: 1080,
      },
      duration: duration,
      fps: 30,
      projectId: "main",
    };

    console.warn("SOMETHING WEIRD WHEN CHANGING FPS");
    fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  const openLink = (url: string) => {
    window.open(url, "_blank"); // '_blank' will open the link in a new tab
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr 320px",
      }}
      className="h-[72px] absolute top-0 left-0 right-0  px-2 z-[205] pointer-events-none flex items-center"
    >
      <div className="flex items-center gap-2 pointer-events-auto h-14">
        <div className="bg-zinc-950 h-12 w-12 flex items-center justify-center rounded-md">
          <img src={logoDark} alt="logo" className="h-5 w-5" />
        </div>
        <div className="bg-zinc-950 px-1.5 h-12 flex  items-center">
          <Button
            onClick={handleUndo}
            className="text-muted-foreground"
            variant="ghost"
            size="icon"
          >
            <Icons.undo width={20} />
          </Button>
          <Button
            onClick={handleRedo}
            className="text-muted-foreground"
            variant="ghost"
            size="icon"
          >
            <Icons.redo width={20} />
          </Button>
        </div>
      </div>

      <div className="pointer-events-auto  h-14 flex items-center gap-2 justify-center">
        <div className="bg-zinc-950 px-2.5 rounded-md h-12 gap-4 flex items-center">
          <div className="font-medium text-sm px-1">Untitled video</div>
          <ResizeVideo />
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto h-14 justify-end">
        <div className="flex items-center gap-2 bg-zinc-950 px-2.5 rounded-md h-12">
          <Button
            className="border border-white/10 flex gap-2"
            size="xs"
            variant="secondary"
          >
            Share
          </Button>
          <Button
            className="flex gap-1 h-8 w-8"
            onClick={handleExport}
            size="icon"
            variant="default"
          >
            <Download width={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ResizeOptionProps {
  label: string;
  icon: string;
  value: ResizeValue;
}
interface ResizeValue {
  width: number;
  height: number;
  name: string;
}
const RESIZE_OPTIONS: ResizeOptionProps[] = [
  {
    label: "16:9",
    icon: "landscape",
    value: {
      width: 1920,
      height: 1080,
      name: "16:9",
    },
  },
  {
    label: "9:16",
    icon: "portrait",
    value: {
      width: 1080,
      height: 1920,
      name: "9:16",
    },
  },
  {
    label: "1:1",
    icon: "square",
    value: {
      width: 1080,
      height: 1080,
      name: "1:1",
    },
  },
];

const ResizeVideo = () => {
  const handleResize = (payload: ResizeValue) => {
    dispatcher.dispatch(DESIGN_RESIZE, {
      payload,
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="border border-white/10"
          size="xs"
          variant="secondary"
        >
          Resize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 z-[250]">
        <div className="grid gap-4 text-sm">
          {RESIZE_OPTIONS.map((option, index) => (
            <ResizeOption
              key={index}
              label={option.label}
              icon={option.icon}
              value={option.value}
              handleResize={handleResize}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ResizeOption = ({
  label,
  icon,
  value,
  handleResize,
}: ResizeOptionProps & { handleResize: (payload: ResizeValue) => void }) => {
  const Icon = Icons[icon];
  return (
    <div
      onClick={() => handleResize(value)}
      className="flex items-center gap-4 hover:bg-zinc-50/10 cursor-pointer"
    >
      <div className="text-muted-foreground">
        <Icon />
      </div>
      <div>
        <div>{label}</div>
        <div className="text-muted-foreground">Tiktok, Instagram</div>
      </div>
    </div>
  );
};
