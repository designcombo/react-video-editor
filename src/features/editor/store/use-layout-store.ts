import { ILayoutState } from "../interfaces/layout";
import { create } from "zustand";

const useLayoutStore = create<ILayoutState>((set) => ({
  activeMenuItem: "texts",
  showMenuItem: false,
  cropTarget: null,
  showControlItem: false,
  showToolboxItem: false,
  activeToolboxItem: null,
  floatingControl: null,
  setCropTarget: (cropTarget) => set({ cropTarget }),
  setActiveMenuItem: (showMenu) => set({ activeMenuItem: showMenu }),
  setShowMenuItem: (showMenuItem) => set({ showMenuItem }),
  setShowControlItem: (showControlItem) => set({ showControlItem }),
  setShowToolboxItem: (showToolboxItem) => set({ showToolboxItem }),
  setActiveToolboxItem: (activeToolboxItem) => set({ activeToolboxItem }),
  setFloatingControl: (floatingControl) => set({ floatingControl }),
  trackItem: null,
  setTrackItem: (trackItem) => set({ trackItem }),
}));

export default useLayoutStore;
