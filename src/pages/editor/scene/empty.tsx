import useStore from "../store/use-store";
import { useEffect, useRef, useState } from "react";
import { Droppable } from "@/components/ui/droppable";
import { PlusIcon } from "lucide-react";
import { DroppableArea } from "./droppable";

const SceneEmpty = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [desiredSize, setDesiredSize] = useState({ width: 0, height: 0 });
  const { size } = useStore();

  useEffect(() => {
    const container = containerRef.current!;
    const PADDING = 96;
    const containerHeight = container.clientHeight - PADDING;
    const containerWidth = container.clientWidth - PADDING;
    const { width, height } = size;

    const desiredZoom = Math.min(
      containerWidth / width,
      containerHeight / height,
    );
    setDesiredSize({
      width: width * desiredZoom,
      height: height * desiredZoom,
    });
  }, [size]);

  const onSelectFiles = (files: File[]) => {
    console.log({ files });
  };

  return (
    <div
      ref={containerRef}
      className="relative z-50 h-full w-full flex-1 bg-zinc-900"
    >
      <Droppable
        maxFileCount={4}
        maxSize={4 * 1024 * 1024}
        disabled={false}
        onValueChange={onSelectFiles}
        className="h-full w-full bg-zinc-900"
      >
        <DroppableArea
          onDragStateChange={setIsDraggingOver}
          className={`absolute left-1/2 top-1/2 mt-3.5 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center border border-dashed text-center transition-colors duration-200 ease-in-out ${
            isDraggingOver
              ? "border-white bg-white/10"
              : "border-white/15 bg-transparent"
          }`}
          style={{
            width: desiredSize.width,
            height: desiredSize.height,
          }}
        >
          <div className="flex flex-col items-center justify-center gap-4 pb-12">
            <div className="hover:bg-primary-dark cursor-pointer rounded-md border bg-primary p-2 text-secondary transition-colors duration-200">
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-px">
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground/70">
                Or drag and drop files here
              </p>
            </div>
          </div>
        </DroppableArea>
      </Droppable>
    </div>
  );
};

export default SceneEmpty;
