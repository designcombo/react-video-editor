import { Button } from "@/components/button";
import { Label } from "@/components/ui/label";
import { EDIT_OBJECT, dispatch } from "@designcombo/events";
import { IImage, ITrackItem, IVideo } from "@designcombo/types";
import { useState } from "react";

export default function Flip({
  trackItem,
}: {
  trackItem: ITrackItem & (IImage | IVideo);
}) {
  const [flip, setFlip] = useState({
    flipX: trackItem.details.flipX,
    flipY: trackItem.details.flipY,
  });

  const handleFlip = (value: string) => {
    if (value === "x") {
      dispatch(EDIT_OBJECT, {
        payload: {
          [trackItem.id]: {
            details: {
              flipX: !flip.flipX,
            },
          },
        },
      });
      setFlip({ ...flip, flipX: !flip.flipX });
    } else if (value === "y") {
      dispatch(EDIT_OBJECT, {
        payload: {
          [trackItem.id]: {
            details: {
              flipY: !flip.flipY,
            },
          },
        },
      });
      setFlip({ ...flip, flipY: !flip.flipY });
    }
  };
  return (
    <div className="flex flex-col gap-2 py-4">
      <Label className="font-sans text-xs font-semibold text-muted-foreground">
        Flip
      </Label>
      <div className="flex">
        <Button variant="outline" onClick={() => handleFlip("x")}>
          Flip X
        </Button>
        <Button variant="outline" onClick={() => handleFlip("y")}>
          Flip Y
        </Button>
      </div>
    </div>
  );
}
