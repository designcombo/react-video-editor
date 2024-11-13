import { IAudio } from "@designcombo/types";

export const AUDIOS = [
  {
    id: "1",
    details: {
      src: "https://cdn.designcombo.dev/audio/Dawn%20of%20change.mp3",
    },
    name: "Dawn of change",
    type: "audio",
    metadata: {
      author: "Roman Senyk",
    },
  },
  {
    id: "2",
    details: {
      src: "https://cdn.designcombo.dev/audio/Hope.mp3",
    },
    name: "Hope",
    type: "audio",
    metadata: {
      author: "Hugo Dujardin",
    },
  },
  {
    id: "3",
    details: {
      src: "https://cdn.designcombo.dev/audio/Tenderness.mp3",
    },
    name: "Tenderness",
    type: "audio",
    metadata: {
      author: "Benjamin Tissot",
    },
  },
  {
    id: "4",
    details: {
      src: "https://cdn.designcombo.dev/audio/Piano%20Moment.mp3",
    },
    name: "Piano moment",
    type: "audio",
    metadata: {
      author: "Benjamin Tissot",
    },
  },
] as Partial<IAudio>[];
