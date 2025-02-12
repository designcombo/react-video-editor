import Timeline from "./timeline";
import useStore from "./store/use-store";
import Navbar from "./navbar";
import MenuList from "./menu-list";
import { MenuItem } from "./menu-item";
import useTimelineEvents from "@/hooks/use-timeline-events";
import Scene from "./scene";
import StateManager, { DESIGN_LOAD } from "@designcombo/state";
import { ControlItem } from "./control-item";
import ControlList from "./control-list";
import { useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { dispatch } from "@designcombo/events";
import { data } from "./data";
 
const stateManager = new StateManager({
  size: {
    width: 1920,
    height: 1080,
  },
  scale: {
    // 1x distance (second 0 to second 5, 5 segments).
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
});

const App = () => {
  const timelinePanelRef = useRef<ImperativePanelHandle>(null);
  const { timeline, playerRef } = useStore();

  useTimelineEvents();

  useEffect(() => {
    if (!timeline) return;
    dispatch(DESIGN_LOAD, {
      payload: data,
    });
  }, [timeline]);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    const desiredHeight = 300;
    const percentage = (desiredHeight / screenHeight) * 100;
    timelinePanelRef.current?.resize(percentage);
  }, []);

  const handleTimelineResize = () => {
    const timelineContainer = document.getElementById("timeline-container");
    if (!timelineContainer) return;

    timeline?.resize(
      {
        height: timelineContainer.clientHeight - 90,
        width: timelineContainer.clientWidth - 40,
      },
      {
        force: true,
      },
    );
  };

  useEffect(() => {
    const onResize = () => handleTimelineResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [timeline]);

  return (
    <ResizablePanelGroup style={{ height: "100vh" }} direction="vertical">
      <ResizablePanel className="relative" defaultSize={70}>
        <Navbar />
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <MenuList />
          <MenuItem />
          <ControlList />
          <ControlItem />
           <Scene stateManager={stateManager} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className="min-h-[50px]"
        ref={timelinePanelRef}
        defaultSize={30}
        onResize={handleTimelineResize}
      >
        {playerRef && <Timeline stateManager={stateManager} />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default App;
