import {
  CENTER,
  LEFT,
  RIGHT,
  TransformActionHandler,
  controlsUtils,
  isTransformCentered,
  resolveOrigin,
  timeMsToUnits,
  unitsToTimeMs,
  wrapWithFixedAnchor,
} from "@designcombo/timeline";

const { wrapWithFireEvent, getLocalPoint } = controlsUtils;

const EXPAND_STEP = 1; // seconds;
const MAX_EXTENSION = 5; // seconds;
const HALF_STEP = EXPAND_STEP / 2;
const EPSILON = 0.000001; // Add this near other constants at the top

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeVideoWidth: TransformActionHandler = (
  _,
  transform,
  x,
  y,
) => {
  const localPoint = getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y,
  );
  //  make sure the control changes width ONLY from it's side of target
  if (
    resolveOrigin(transform.originX) === resolveOrigin(CENTER) ||
    (resolveOrigin(transform.originX) === resolveOrigin(RIGHT) &&
      localPoint.x < 0) ||
    (resolveOrigin(transform.originX) === resolveOrigin(LEFT) &&
      localPoint.x > 0)
  ) {
    let { target }: { target: any } = transform,
      strokePadding =
        target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth = Math.ceil(
        Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding,
      );

    const fromRight = transform.corner === "mr";

    if (fromRight) {
      const to = target.trim.to; // Ensure 'to' is defined from target.trim.to
      const isShiftKey = target.canvas?.isShiftKey;

      const diffSize = newWidth - oldWidth;

      const diffTime = unitsToTimeMs(
        diffSize,
        target.tScale,
        target.playbackRate,
      );

      const newTo = to + diffTime;
      console.log("from right");
      if (isShiftKey && newTo > target.prevDuration) {
        console.log("from right 2");

        const currentDuration = target.trim.to - target.trim.from;
        const currentSeconds = currentDuration / 1000;

        // Calculate the threshold for next/previous second. +1/2 to account for mid-second changes
        const nextSecondThreshold = (currentSeconds + HALF_STEP) * 1000;
        const prevSecondThreshold = (currentSeconds - HALF_STEP) * 1000;

        // Check if we're exceeding maximum allowed extension (5000ms)
        const maxAllowedDuration = target.prevDuration + MAX_EXTENSION * 1000;
        console.log({ maxAllowedDuration, trim: target.trim });
        let nextDuration;

        if (newTo > nextSecondThreshold) {
          // Snap to next second
          nextDuration = (currentSeconds + EXPAND_STEP) * 1000;

          // Don't allow duration to exceed max allowed
          if (target.trim.from + nextDuration > maxAllowedDuration + EPSILON) {
            return false;
          }
        } else if (newTo < prevSecondThreshold) {
          // Snap to previous second
          nextDuration =
            Math.max(currentSeconds - EXPAND_STEP, EXPAND_STEP) * 1000;
        } else {
          // Keep current second if change is small
          return false;
        }
        const nextWidth = timeMsToUnits(nextDuration, target.tScale);
        target.set("width", nextWidth);
        target.trim.to = target.trim.from + nextDuration;
        console.log("updating trim value", target.trim.to);
        target.duration = nextDuration;

        return true;
      } else if (newTo > target.duration) {
        console.log("duration ", target.duration);
        // If not holding Shift, ensure we don't exceed current duration
        return false;
      }

      console.log({
        duration: target.duration,
        newTo,
      });
      target.set("width", Math.max(newWidth, 0));
      target.trim.to = newTo;
    } else {
      // Check if the object is out of the canvas
      if (target.left < 0) return false;

      const diffPos = oldWidth - newWidth;
      const nextLeft = target.left + diffPos;

      // target.left is not set right away, so we need to check if the object is out of the canvas
      if (nextLeft < 0) {
        const durationInUnits = timeMsToUnits(
          target.duration,
          target.tScale,
          target.playbackRate,
        );

        const totalWidthToLeft = target.width + target.left;

        if (totalWidthToLeft <= durationInUnits) {
          target.set("width", totalWidthToLeft);

          const newTrimFrom = unitsToTimeMs(
            durationInUnits - totalWidthToLeft,
            target.tScale,
            target.playbackRate,
          );

          target.trim.from = newTrimFrom;
          return true;
        }

        return false;
      }

      const diffSize = newWidth - oldWidth;
      const from = target.trim.from;

      const diffTime = unitsToTimeMs(
        diffSize,
        target.tScale,
        target.playbackRate,
      );

      const newTrimFrom = from - diffTime;
      if (newTrimFrom < 0) return false;

      target.set("width", Math.max(newWidth, 0));
      target.trim.from = newTrimFrom;
      if (target.onResize) {
        target.onResize();
      }
    }
    //  check against actual target width in case `newWidth` was rejected
    return oldWidth !== target.width;
  }
  return false;
};

export const resizeMedia = wrapWithFireEvent(
  "resizing",
  wrapWithFixedAnchor(changeVideoWidth),
);
