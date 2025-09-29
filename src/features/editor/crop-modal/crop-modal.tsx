import {
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ElementCrop } from "./element-crop";
import { Button } from "@/components/ui/button";
import useLayoutStore from "../store/use-layout-store";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import useCropStore from "../store/use-crop-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

const CropModal = () => {
  const { cropTarget, setCropTarget } = useLayoutStore();
  const [aspectRatio, setAspectRatio] = useState<"free" | string>("free");
  const {
    loadVideo,
    reset,
    area,
    scale: scaled,
    element,
    loadImage,
    clear
  } = useCropStore();

  const apply = () => {
    if (!cropTarget) return;
    const cropTargetDetails = cropTarget.details;

    const scale = 1 / scaled;

    const oldWidth = Number.parseFloat(cropTargetDetails.width);
    const oldHeight = Number.parseFloat(cropTargetDetails.height);

    // Extract the actual visual scale from the transform property
    const regex = cropTargetDetails.transform?.match(/scale\(([^)]+)\)/);
    const imageScale = regex ? Number.parseFloat(regex[1]) : 1; // Default scale to 1 if missing

    // Calculate crop offsets and new dimensions in original coordinates
    const cropX = (area ? area[0] : 0) * scale;
    const cropY = (area ? area[1] : 0) * scale;

    const newWidth = (area ? area[2] : oldWidth) * scale;
    const newHeight = (area ? area[3] : oldHeight) * scale;

    const prevCropX = cropTargetDetails?.crop?.x || 0;
    const prevCropY = cropTargetDetails?.crop?.y || 0;

    // Calculate the element's center before cropping
    const oldCenterX = Number.parseFloat(cropTargetDetails.left) + oldWidth / 2;
    const oldCenterY = Number.parseFloat(cropTargetDetails.top) + oldHeight / 2;

    const diffWidth = ((oldWidth - newWidth) * imageScale) / 2;
    const diffHeight = ((oldHeight - newHeight) * imageScale) / 2;

    const cropXDiff = (cropX - prevCropX) * imageScale;
    const cropYDiff = (cropY - prevCropY) * imageScale;

    // Calculate the new center after cropping
    const newCenterX = oldCenterX - diffWidth + cropXDiff;
    const newCenterY = oldCenterY - diffHeight + cropYDiff;

    // Adjust positions to keep the center consistent
    const adjustedLeft = newCenterX - newWidth / 2;
    const adjustedTop = newCenterY - newHeight / 2;

    dispatch(EDIT_OBJECT, {
      payload: {
        [cropTarget.id]: {
          details: {
            top: adjustedTop,
            left: adjustedLeft,
            crop: {
              x: cropX,
              y: cropY,
              width: newWidth,
              height: newHeight
            }
          }
        }
      }
    });

    clear();
    setCropTarget(null);
    setAspectRatio("free");
  };

  useEffect(() => {
    if (!cropTarget) return;
    const cropTargetDetails = cropTarget.details;
    if (cropTarget.type === "video") {
      loadVideo(cropTargetDetails.src);
    }
    if (cropTarget.type === "image") {
      loadImage(cropTargetDetails.src);
    }
  }, [cropTarget]);

  if (!cropTarget) return;

  const cropTargetDetails = cropTarget.details;

  return (
    <>
      {cropTarget && (
        <Dialog
          open={!!cropTarget}
          onOpenChange={() => {
            setCropTarget(null);
            setAspectRatio("free");
          }}
        >
          <DialogOverlay className="z-[300] bg-zinc-950/80">
            <DialogContent className="z-[300] flex max-h-[800px] w-full sm:max-w-[900px] flex-col bg-zinc-950 px-8">
              <DialogTitle>Crop</DialogTitle>

              <div className="flex gap-4">
                <div className="w-56 flex flex-col gap-2">
                  <Label>Aspect Ratio</Label>
                  <Select
                    value={aspectRatio}
                    onValueChange={setAspectRatio}
                    defaultValue="free"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="2:3">2:3</SelectItem>
                      <SelectItem value="3:2">3:2</SelectItem>
                      <SelectItem value="3:4">3:4</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-1 flex-col gap-4 bg-zinc-900 p-4">
                  <div className="flex flex-1 items-center justify-center ">
                    {element && (
                      <ElementCrop
                        size={{
                          width: cropTargetDetails.width,
                          height: cropTargetDetails.height
                        }}
                        targetDetails={cropTargetDetails}
                        element={element}
                        aspectRatio={aspectRatio}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex h-16 items-center justify-end gap-4">
                <Button variant="secondary" onClick={reset}>
                  Reset
                </Button>
                <Button onClick={apply}>Apply</Button>
              </div>
            </DialogContent>
          </DialogOverlay>
        </Dialog>
      )}
    </>
  );
};

export default CropModal;
