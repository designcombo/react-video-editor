import React from "react";
import useLayoutStore from "../store/use-layout-store";
import {
  IAudio,
  IImage,
  IText,
  ITrackItem,
  ITrackItemAndDetails,
  IVideo,
} from "@designcombo/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Presets from "./presets";
import Animations from "./animations";
import Smart from "./smart";
import BasicText from "./basic-text";
import BasicImage from "./basic-image";
import BasicVideo from "./basic-video";
import BasicAudio from "./basic-audio";
import useStore from "../store/use-store";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { activeToolboxItem, setActiveToolboxItem } = useLayoutStore();
  const { activeIds, trackItemsMap, trackItemDetailsMap } = useStore();
  const [trackItem, setTrackItem] = useState<ITrackItem | null>(null);
  const [displayToolbox, setDisplayToolbox] = useState<boolean>(false);

  useEffect(() => {
    if (activeIds.length === 1) {
      const [id] = activeIds;
      const trackItemDetails = trackItemDetailsMap[id];
      const trackItem = {
        ...trackItemsMap[id],
        details: trackItemDetails?.details || {},
      };
      setTrackItem(trackItem);
    } else {
      setTrackItem(null);
      setDisplayToolbox(false);
    }
  }, [activeIds, trackItemsMap]);

  useEffect(() => {
    if (activeToolboxItem) {
      setDisplayToolbox(true);
    } else {
      setDisplayToolbox(false);
    }
  }, [activeToolboxItem]);

  if (!trackItem) {
    return null;
  }

  return (
    <div
      style={{
        right: activeToolboxItem && displayToolbox ? "0" : "-100%",
        transition: "right 0.25s ease-in-out",
        zIndex: 200,
      }}
      className="absolute top-1/2 mt-6 flex h-[calc(100%-32px-64px)] w-[340px] -translate-y-1/2 rounded-lg shadow-lg"
    >
      <div className="relative flex h-full w-[266px] bg-background/80 backdrop-blur-lg backdrop-filter">
        <Button
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
          size="icon"
        >
          <X
            width={16}
            onClick={() => {
              setDisplayToolbox(false);
              setActiveToolboxItem(null);
            }}
          />
        </Button>
        {React.cloneElement(children as React.ReactElement<any>, {
          trackItem,
          activeToolboxItem,
        })}
      </div>
      <div className="w-[74px]"></div>
    </div>
  );
};

const ActiveControlItem = ({
  trackItem,
  activeToolboxItem,
}: {
  trackItem?: ITrackItemAndDetails;
  activeToolboxItem?: string;
}) => {
  if (!trackItem || !activeToolboxItem) {
    return null;
  }
  return (
    <>
      {
        {
          "basic-text": (
            <BasicText trackItem={trackItem as ITrackItem & IText} />
          ),
          "basic-image": (
            <BasicImage trackItem={trackItem as ITrackItem & IImage} />
          ),
          "basic-video": (
            <BasicVideo trackItem={trackItem as ITrackItem & IVideo} />
          ),
          "basic-audio": (
            <BasicAudio trackItem={trackItem as ITrackItem & IAudio} />
          ),
          "preset-text": <Presets />,
          animation: <Animations />,
          smart: <Smart />,
        }[activeToolboxItem]
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
