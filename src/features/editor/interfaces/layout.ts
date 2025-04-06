import { ITrackItem } from "@designcombo/types";

export type IMenuItem =
  | "uploads"
  | "templates"
  | "videos"
  | "images"
  | "shapes"
  | "audios"
  | "transitions"
  | "texts"
  | "captions"
  | "voiceOver";
export interface ILayoutState {
  cropTarget: ITrackItem | null;
  trackItem: ITrackItem | null;
  activeMenuItem: IMenuItem | null;
  showMenuItem: boolean;
  showControlItem: boolean;
  showToolboxItem: boolean;
  activeToolboxItem: string | null;
  floatingControl: any; // "font-family-picker" | "text-preset-picker"| "animation-picker"
  setCropTarget: (cropTarget: ITrackItem | null) => void;
  setActiveMenuItem: (showMenu: IMenuItem | null) => void;
  setShowMenuItem: (showMenuItem: boolean) => void;
  setShowControlItem: (showControlItem: boolean) => void;
  setShowToolboxItem: (showToolboxItem: boolean) => void;
  setActiveToolboxItem: (activeToolboxItem: string | null) => void;
  setFloatingControl: (floatingControl: any) => void;
  setTrackItem: (trackItem: ITrackItem | null) => void;
}
