import {
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { ElementCrop } from "./element-crop";
import { Button } from "@/components/ui/button";
import useLayoutStore from "../store/use-layout-store";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import useCropStore from "../store/use-crop-store";

const CropModal = () => {
  const { cropTarget, setCropTarget } = useLayoutStore();
  const {
    loadVideo,
    reset,
    area,
    scale: scaled,
    element,
    loadImage,
    clear,
  } = useCropStore();

  const apply = () => {
    if (!cropTarget) return;
    const cropTargetDetails = cropTarget.details;

    const scale = 1 / scaled;

    const oldWidth = parseFloat(cropTargetDetails.width);
    const oldHeight = parseFloat(cropTargetDetails.height);

    // Extract the actual visual scale from the transform property
    const regex = cropTargetDetails.transform?.match(/scale\(([^)]+)\)/);
    const imageScale = regex ? parseFloat(regex[1]) : 1; // Default scale to 1 if missing

    // Calculate crop offsets and new dimensions in original coordinates
    const cropX = (area ? area[0] : 0) * scale;
    const cropY = (area ? area[1] : 0) * scale;

    const newWidth = (area ? area[2] : oldWidth) * scale;
    const newHeight = (area ? area[3] : oldHeight) * scale;

    let prevCropX = cropTargetDetails?.crop?.x || 0;
    let prevCropY = cropTargetDetails?.crop?.y || 0;

    // Calculate the element's center before cropping
    const oldCenterX = parseFloat(cropTargetDetails.left) + oldWidth / 2;
    const oldCenterY = parseFloat(cropTargetDetails.top) + oldHeight / 2;

    const diffWidth = ((oldWidth - newWidth) * imageScale) / 2;
    const diffHeight = ((oldHeight - newHeight) * imageScale) / 2;

    let cropXDiff = (cropX - prevCropX) * imageScale;
    let cropYDiff = (cropY - prevCropY) * imageScale;

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
              height: newHeight,
            },
          },
        },
      },
    });

    clear();
    setCropTarget(null);
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

  let cropTargetDetails = cropTarget.details;

  return (
    <>
      {cropTarget && (
        <Dialog open={!!cropTarget} onOpenChange={() => setCropTarget(null)}>
          <DialogOverlay className="z-[300] bg-zinc-950/80">
            <DialogContent className="z-[300] flex h-[640px] w-[900px] max-w-7xl flex-col bg-zinc-950 px-8">
              <DialogTitle>Crop</DialogTitle>

              {/* <VisuallyHidden.Root> */}
              <DialogDescription>Crop Modal</DialogDescription>
              {/* </VisuallyHidden.Root> */}

              <div className="flex flex-1">
                <div className="w-56">Crop settings</div>
                <div className="flex flex-1 items-center justify-center bg-zinc-800">
                  {element && (
                    <ElementCrop
                      size={{
                        width: cropTargetDetails.width,
                        height: cropTargetDetails.height,
                      }}
                      targetDetails={cropTargetDetails}
                      element={element}
                    />
                  )}
                </div>
              </div>
              <div className="flex h-24 items-center justify-end gap-4">
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
