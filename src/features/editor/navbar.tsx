import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { dispatch } from "@designcombo/events";
import { HISTORY_UNDO, HISTORY_REDO, DESIGN_RESIZE } from "@designcombo/state";
import { Icons } from "@/components/shared/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Download, MenuIcon, ShareIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type StateManager from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IDesign } from "@designcombo/types";
import { useDownloadState } from "./store/use-download-state";
import DownloadProgressModal from "./download-progress-modal";
import AutosizeInput from "@/components/ui/autosize-input";
import { debounce } from "lodash";

export default function Navbar({
  stateManager,
  setProjectName,
  projectName,
}: {
  user: null;
  stateManager: StateManager;
  setProjectName: (name: string) => void;
  projectName: string;
}) {
  const [title, setTitle] = useState(projectName);

  const handleUndo = () => {
    dispatch(HISTORY_UNDO);
  };

  const handleRedo = () => {
    dispatch(HISTORY_REDO);
  };

  const handleCreateProject = async () => {};

  // Create a debounced function for setting the project name
  const debouncedSetProjectName = useCallback(
    debounce((name: string) => {
      console.log("Debounced setProjectName:", name);
      setProjectName(name);
    }, 2000), // 2 seconds delay
    [],
  );

  // Update the debounced function whenever the title changes
  useEffect(() => {
    debouncedSetProjectName(title);
  }, [title, debouncedSetProjectName]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr 320px",
      }}
      className="bg-sidebar pointer-events-none flex h-[58px] items-center border-b border-border/80 px-2"
    >
      <DownloadProgressModal />

      <div className="flex items-center gap-2">
        <div className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-md text-zinc-200">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="hover:bg-background-subtle flex h-8 w-8 items-center justify-center">
                <MenuIcon className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[300] w-56 p-2" align="start">
              <DropdownMenuItem
                onClick={handleCreateProject}
                className="cursor-pointer text-muted-foreground"
              >
                New project
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                My projects
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCreateProject}
                className="cursor-pointer text-muted-foreground"
              >
                Duplicate project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="bg-sidebar pointer-events-auto flex h-12 items-center px-1.5">
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

      <div className="flex h-14 items-center justify-center gap-2">
        <div className="bg-sidebar pointer-events-auto flex h-12 items-center gap-2 rounded-md px-2.5 text-muted-foreground">
          <AutosizeInput
            name="title"
            value={title}
            onChange={handleTitleChange}
            width={200}
            inputClassName="border-none outline-none px-1 bg-background text-sm font-medium text-zinc-200"
          />
        </div>
      </div>

      <div className="flex h-14 items-center justify-end gap-2">
        <div className="bg-sidebar pointer-events-auto flex h-12 items-center gap-2 rounded-md px-2.5">
          <Button
            className="flex h-8 gap-1 border border-border"
            variant="outline"
          >
            <ShareIcon width={18} /> Share
          </Button>
          <DownloadPopover stateManager={stateManager} />
          <Button
            className="flex h-8 gap-1 border border-border"
            variant="default"
            onClick={() => {
              window.open("https://discord.gg/jrZs3wZyM5", "_blank");
            }}
          >
            Discord
          </Button>
        </div>
      </div>
    </div>
  );
}

const DownloadPopover = ({ stateManager }: { stateManager: StateManager }) => {
  const { actions, exportType } = useDownloadState();
  const [isExportTypeOpen, setIsExportTypeOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    const data: IDesign = {
      id: generateId(),
      ...stateManager.getState(),
    };

    actions.setState({ payload: data });
    actions.startExport();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex h-8 gap-1 border border-border"
          variant="outline"
        >
          <Download width={18} /> Export
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-sidebar z-[250] flex w-60 flex-col gap-4"
      >
        <Label>Export settings</Label>

        <Popover open={isExportTypeOpen} onOpenChange={setIsExportTypeOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full justify-between" variant="outline">
              <div>{exportType.toUpperCase()}</div>
              <ChevronDown width={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-background-subtle z-[251] w-[--radix-popover-trigger-width] px-2 py-2">
            <div
              className="flex h-8 items-center rounded-sm px-3 text-sm hover:cursor-pointer hover:bg-zinc-800"
              onClick={() => {
                actions.setExportType("mp4");
                setIsExportTypeOpen(false);
              }}
            >
              MP4
            </div>
            <div
              className="flex h-8 items-center rounded-sm px-3 text-sm hover:cursor-pointer hover:bg-zinc-800"
              onClick={() => {
                actions.setExportType("json");
                setIsExportTypeOpen(false);
              }}
            >
              JSON
            </div>
          </PopoverContent>
        </Popover>

        <div>
          <Button onClick={handleExport} className="w-full">
            Export
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ResizeOptionProps {
  label: string;
  icon: string;
  value: ResizeValue;
  description: string;
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
    description: "YouTube ads",
    value: {
      width: 1920,
      height: 1080,
      name: "16:9",
    },
  },
  {
    label: "9:16",
    icon: "portrait",
    description: "TikTok, YouTube Shorts",
    value: {
      width: 1080,
      height: 1920,
      name: "9:16",
    },
  },
  {
    label: "1:1",
    icon: "square",
    description: "Instagram, Facebook posts",
    value: {
      width: 1080,
      height: 1080,
      name: "1:1",
    },
  },
];

const ResizeVideo = () => {
  const handleResize = (options: ResizeValue) => {
    dispatch(DESIGN_RESIZE, {
      payload: {
        ...options,
      },
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border border-border" variant="secondary">
          Resize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[250] w-60 px-2.5 py-3">
        <div className="text-sm">
          {RESIZE_OPTIONS.map((option, index) => (
            <ResizeOption
              key={index}
              label={option.label}
              icon={option.icon}
              value={option.value}
              handleResize={handleResize}
              description={option.description}
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
  description,
  handleResize,
}: ResizeOptionProps & { handleResize: (payload: ResizeValue) => void }) => {
  const Icon = Icons[icon as "text"];
  return (
    <div
      onClick={() => handleResize(value)}
      className="flex cursor-pointer items-center rounded-md p-2 hover:bg-zinc-50/10"
    >
      <div className="w-8 text-muted-foreground">
        <Icon size={20} />
      </div>
      <div>
        <div>{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
};
