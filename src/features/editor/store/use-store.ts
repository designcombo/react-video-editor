import type Timeline from '@designcombo/timeline';
import type {
  ISize,
  ITimelineScaleState,
  ITimelineScrollState,
  ITrack,
  ITrackItem,
  ITransition,
} from '@designcombo/types';
import type Moveable from '@interactify/moveable';
import type { PlayerRef } from '@remotion/player';
import type { RefObject } from 'react';
import { create } from 'zustand';

interface ITimelineStore {
  duration: number;
  fps: number;
  scale: ITimelineScaleState;
  scroll: ITimelineScrollState;
  size: ISize;
  tracks: ITrack[];
  trackItemIds: string[];
  transitionIds: string[];
  transitionsMap: Record<string, ITransition>;
  trackItemsMap: Record<string, ITrackItem>;
  trackItemDetailsMap: Record<string, any>;
  activeIds: string[];
  timeline: Timeline | null;
  setTimeline: (timeline: Timeline) => void;
  setScale: (scale: ITimelineScaleState) => void;
  setScroll: (scroll: ITimelineScrollState) => void;
  playerRef: RefObject<PlayerRef> | null;
  setPlayerRef: (playerRef: RefObject<PlayerRef> | null) => void;

  sceneMoveableRef: RefObject<Moveable> | null;
  setSceneMoveableRef: (ref: RefObject<Moveable>) => void;
  setState: (state: any) => Promise<void>;
}

const useStore = create<ITimelineStore>((set) => ({
  size: {
    width: 1080,
    height: 1920,
  },

  timeline: null,
  duration: 1000,
  fps: 30,
  scale: {
    // 1x distance (second 0 to second 5, 5 segments).
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
  scroll: {
    left: 0,
    top: 0,
  },
  playerRef: null,
  trackItemDetailsMap: {},
  activeIds: [],
  targetIds: [],
  tracks: [],
  trackItemIds: [],
  transitionIds: [],
  transitionsMap: {},
  trackItemsMap: {},
  sceneMoveableRef: null,

  setTimeline: (timeline: Timeline) =>
    set(() => ({
      timeline: timeline,
    })),
  setScale: (scale: ITimelineScaleState) =>
    set(() => ({
      scale: scale,
    })),
  setScroll: (scroll: ITimelineScrollState) =>
    set(() => ({
      scroll: scroll,
    })),
  setState: async (state) => {
    return set({ ...state });
  },
  setPlayerRef: (playerRef: RefObject<PlayerRef> | null) => set({ playerRef }),
  setSceneMoveableRef: (ref) => set({ sceneMoveableRef: ref }),
}));

export default useStore;
