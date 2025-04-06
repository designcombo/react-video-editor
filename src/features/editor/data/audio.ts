import { IAudio } from "@designcombo/types";

export const AUDIOS = [
  // https://ik.imagekit.io/pablituuu/like_a_player.mp3?updatedAt=1722278521488
  {
    id: "xxx0",
    details: {
      src: "https://cdn.designcombo.dev/audio/OpenAI%20CEO%20on%20Artificial%20Intelligence%20Changing%20Society.mp3",
    },
    name: "Open AI",
    type: "audio",
    metadata: {
      author: "Open AI",
    },
  },
  {
    id: "xx1",
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
    id: "xx2",
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
    id: "xx3",
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
    id: "xx4",
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
