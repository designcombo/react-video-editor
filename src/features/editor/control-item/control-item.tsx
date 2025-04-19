import type {
  IAudio,
  ICaption,
  IImage,
  IText,
  ITrackItem,
  ITrackItemAndDetails,
  IVideo,
} from "@designcombo/types";
import { LassoSelect } from "lucide-react";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import useLayoutStore from "../store/use-layout-store";
import useStore from "../store/use-store";
import BasicAudio from "./basic-audio";
import BasicCaption from "./basic-caption";
import BasicImage from "./basic-image";
import BasicText from "./basic-text";
import BasicVideo from "./basic-video";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { activeIds, trackItemsMap, trackItemDetailsMap, transitionsMap } =
    useStore();
  const [trackItem, setTrackItem] = useState<ITrackItem | null>(null);
  const { setTrackItem: setLayoutTrackItem } = useLayoutStore();

  const updateTrackItem = useCallback(
    (ids: string[]) => {
      if (ids.length === 1) {
        const [id] = ids;
        const trackItemDetails = trackItemDetailsMap[id];
        const currentTrackItem = {
          ...trackItemsMap[id],
          details: trackItemDetails?.details || {},
        };
        if (trackItemDetails) {
          setTrackItem(currentTrackItem);
          setLayoutTrackItem(currentTrackItem);
        } else {
          console.log('No trackItemDetails', transitionsMap[id]);
        }
      } else {
        setTrackItem(null);
        setLayoutTrackItem(null);
      }
    },
    [trackItemsMap, trackItemDetailsMap, setLayoutTrackItem, transitionsMap]
  );

  useEffect(() => {
    updateTrackItem(activeIds);
  }, [activeIds, updateTrackItem]);

  return (
    <div className='flex w-[272px] flex-none border-border/80order/80l bg-sidebar'>
      {React.cloneElement(children as React.ReactElement<any>, {
        trackItem,
      })}
    </div>
  );
};

const ActiveControlItem = ({
  trackItem,
}: {
  trackItem?: ITrackItemAndDetails;
}) => {
  if (!trackItem) {
    console.log("No item selected");
    return (
      <div className="mb-32 flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
        <LassoSelect />
        <span className="text-zinc-500">No item selected</span>
      </div>
    );
  }
  return (
    <>
      {
        {
          text: <BasicText trackItem={trackItem as ITrackItem & IText} />,
          caption: (
            <BasicCaption trackItem={trackItem as ITrackItem & ICaption} />
          ),
          image: <BasicImage trackItem={trackItem as ITrackItem & IImage} />,
          video: <BasicVideo trackItem={trackItem as ITrackItem & IVideo} />,
          audio: <BasicAudio trackItem={trackItem as ITrackItem & IAudio} />,
        }[trackItem.type as "text"]
      }
    </>
  );
};

export const ControlItem = () => {
  return (
    <Container>
      <ActiveControlItem />
    </Container>
  );
};
