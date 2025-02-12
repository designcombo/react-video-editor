import {
  Control,
  controlsUtils,
  drawVerticalLine,
} from "@designcombo/timeline";
import { resizeMedia } from "./resize-media";

export const createMediaControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    render: drawVerticalLine,
    actionHandler: resizeMedia,
    cursorStyleHandler: controlsUtils.scaleCursorStyleHandler,
    actionName: "resizing",
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    render: drawVerticalLine,
    actionHandler: resizeMedia,
    cursorStyleHandler: controlsUtils.scaleCursorStyleHandler,
    actionName: "resizing",
  }),
});
