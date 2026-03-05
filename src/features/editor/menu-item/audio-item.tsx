import Draggable from "@/components/shared/draggable";
import { Button } from "@/components/ui/button";
import { IAudio } from "@designcombo/types";
import { Pause, Play } from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";

export const AudioItem = ({
  item,
  onAdd,
  playingId,
  setPlayingId
}: {
  item: Partial<IAudio>;
  onAdd: (payload: Partial<IAudio>) => void;
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<string>("--:--");
  const isPlaying = playingId === item.id;
  const isDraggingOverTimeline = useIsDraggingOverTimeline();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      setPlayingId(null);
    } else {
      setPlayingId(item.id!);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const seconds = Math.round(audioRef.current.duration);
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      setDuration(`${min}:${sec.toString().padStart(2, "0")}`);
    }
  };

  const style = useMemo(
    () => ({
      backgroundImage:
        "url(https://cdn.designcombo.dev/thumbnails/music-preview.png)",
      backgroundSize: "cover",
      width: "70px",
      height: "70px"
    }),
    []
  );

  return (
    <Draggable
      data={item}
      renderCustomPreview={<div style={style} />}
      shouldDisplayPreview={!isDraggingOverTimeline}
    >
      <div className="group relative flex items-center gap-3 p-2 bg-secondary rounded-sm border hover:border-white/10 transition-colors">
        <audio
          ref={audioRef}
          src={item.details?.src}
          onEnded={() => setPlayingId(null)}
          onLoadedMetadata={handleLoadedMetadata}
          className="hidden"
        />

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full bg-black/10 dark:bg-white/5 hover:bg-black/15 dark:hover:bg-white/10 shrink-0"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current ml-0.5" />
          )}
        </Button>

        <div
          onClick={() => onAdd(item)}
          className="flex flex-col min-w-0 flex-1 cursor-pointer"
        >
          <span className="text-xs font-medium truncate mb-0.5 text-zinc-900 dark:text-zinc-300">
            {item.name}
          </span>
          <span className="text-[10px] text-muted-foreground">{duration}</span>
        </div>
      </div>
    </Draggable>
  );
};
