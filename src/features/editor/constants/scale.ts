import { ITimelineScaleState } from "@designcombo/types";

export const TIMELINE_ZOOM_LEVELS: ITimelineScaleState[] = [
  {
    // 1x distance (minute 0 to minute 5, 5 segments).
    index: 0,
    unit: 18000,
    zoom: 1 / 18000,
    segments: 5,
  },
  {
    // 1x distance (minute 0 to minute 3, 3 segments).
    index: 1,
    unit: 10800,
    zoom: 1 / 10800,
    segments: 5,
  },
  {
    // 1x distance (minute 0 to minute 2, 2 segments).
    index: 2,
    unit: 7200,
    zoom: 1 / 7200,
    segments: 5,
  },
  {
    // 1x distance (minute 0 to minute 1, 1 segment).
    index: 3,
    unit: 3600,
    zoom: 1 / 3600,
    segments: 5,
  },
  {
    // 1x distance (second 0 to second 30, 2 segments).
    index: 4,
    unit: 1800,
    zoom: 1 / 1800,
    segments: 5,
  },
  {
    // 1x distance (second 0 to second 15, 3 segments).
    index: 5,
    unit: 900,
    zoom: 1 / 900,
    segments: 5,
  },
  {
    // 1x distance (second 0 to second 10, 2 segments).
    index: 6,
    unit: 600,
    zoom: 1 / 600,
    segments: 5,
  },
  {
    // 1x distance (second 0 to second 5, 5 segments).
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5,
  },
  {
    // 1x distance (second 0 to second 3, 3 segments).
    index: 8,
    unit: 180,
    zoom: 1 / 180,
    segments: 3,
  },
  {
    // 1x distance (second 0 to second 2, 2 segments).
    index: 9,
    unit: 120,
    zoom: 1 / 120,
    segments: 10,
  },
  {
    // 1x distance (second 0 to second 1, 1 segment).
    index: 10,
    unit: 60,
    zoom: 1 / 60,
    segments: 3,
  },

  {
    // 1x distance (second 0 to second 1, 1 segment).
    index: 11,
    unit: 60,
    zoom: 1 / 60,
    segments: 4,
  },
  {
    // 1x distance (frame 0 to frame 30, 2 segments).
    index: 12,
    unit: 30,
    zoom: 1 / 30,
    segments: 5,
  },
  // {
  //   // 1x distance (frame 0 to frame 15, 3 segments).
  //   index: 13,
  //   unit: 15,
  //   zoom: 1 / 15,
  //   segments: 3,
  // },
  // {
  //   // 1x distance (frame 0 to frame 10, 2 segments).
  //   index: 14,
  //   unit: 10,
  //   zoom: 1 / 10,
  //   segments: 2,
  // },
  // {
  //   // 1x distance (frame 0 to frame 5, 5 segments).
  //   index: 15,
  //   unit: 5,
  //   zoom: 1 / 5,
  //   segments: 5,
  // },
  // {
  //   // 1x distance (frame 0 to frame 3, 3 segments).
  //   index: 16,
  //   unit: 3,
  //   zoom: 1 / 3,
  //   segments: 3,
  // },
  // {
  //   // 1x distance (frame 0 to frame 2, 2 segments).
  //   index: 17,
  //   unit: 2,
  //   zoom: 1 / 2,
  //   segments: 5,
  // },
  // {
  //   // 1x distance (frame 0 to frame 1, 1 segment).
  //   index: 18,
  //   unit: 1,
  //   zoom: 1,
  //   segments: 5,
  // },
  // {
  //   // 2x distance (frame 0 to frame 1, 1 segment).
  //   index: 19,
  //   unit: 1,
  //   zoom: 2,
  //   segments: 5,
  // },
  // {
  //   // 4x distance (frame 0 to frame 1, 1 segment).
  //   index: 20,
  //   unit: 1,
  //   zoom: 4,
  //   segments: 10,
  // },
];
