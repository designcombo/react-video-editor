/** @jsxImportSource @emotion/react */
import {
  FC,
  useEffect,
  useRef,
  MutableRefObject,
  MouseEvent,
  TouchEvent,
} from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { TinyColor } from "../utils";

import { TPropsComp, TCoords } from "./types";

// Styled components
const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48bGluZWFyR3JhZGllbnQgaWQ9Imxlc3NoYXQtZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAlIiBzdG9wLWNvbG9yPSIjZmY5OTAwIiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjIwJSIgc3RvcC1jb2xvcj0iI2NkZmYwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiMzNWZmMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iNDAlIiBzdG9wLWNvbG9yPSIjMDBmZjY2IiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwZmZmZCIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSI2MCUiIHN0b3AtY29sb3I9IiMwMDY2ZmYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjMzIwMGZmIiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjgwJSIgc3RvcC1jb2xvcj0iI2NkMDBmZiIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSI5MCUiIHN0b3AtY29sb3I9IiNmZjAwOTkiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmMDAwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2xlc3NoYXQtZ2VuZXJhdGVkKSIgLz48L3N2Zz4=);
  background-image: linear-gradient(
    to right,
    #ff0000 0%,
    #ff9900 10%,
    #cdff00 20%,
    #35ff00 30%,
    #00ff66 40%,
    #00fffd 50%,
    #0066ff 60%,
    #3200ff 70%,
    #cd00ff 80%,
    #ff0099 90%,
    #ff0000 100%
  );
`;

const Background = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48bGluZWFyR3JhZGllbnQgaWQ9Imxlc3NoYXQtZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAlIiBzdG9wLWNvbG9yPSIjZmY5OTAwIiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjIwJSIgc3RvcC1jb2xvcj0iI2NkZmYwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiMzNWZmMDAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iNDAlIiBzdG9wLWNvbG9yPSIjMDBmZjY2IiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwZmZmZCIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSI2MCUiIHN0b3AtY29sb3I9IiMwMDY2ZmYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjMzIwMGZmIiBzdG9wLW9wYWNpdHk9IjEiLz48c3RvcCBvZmZzZXQ9IjgwJSIgc3RvcC1jb2xvcj0iI2NkMDBmZiIgc3RvcC1vcGFjaXR5PSIxIi8+PHN0b3Agb2Zmc2V0PSI5MCUiIHN0b3AtY29sb3I9IiNmZjAwOTkiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmMDAwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2xlc3NoYXQtZ2VuZXJhdGVkKSIgLz48L3N2Zz4=);
  background-image: linear-gradient(
    to right,
    #ff0000 0%,
    #ff9900 10%,
    #cdff00 20%,
    #35ff00 30%,
    #00ff66 40%,
    #00fffd 50%,
    #0066ff 60%,
    #3200ff 70%,
    #cd00ff 80%,
    #ff0099 90%,
    #ff0000 100%
  );
`;

const Pointer = styled.span<{ left: number; backgroundColor: string }>`
  position: absolute;
  top: -3px;
  display: block;
  height: 14px;
  width: 14px;
  padding: 1px 0;
  border-radius: 50%;
  margin-left: -7px;
  border: solid 2px #ffffff;
  cursor: grab;
  left: ${(props) => props.left}%;
  background-color: ${(props) => props.backgroundColor};
`;

const Ribbon: FC<TPropsComp> = ({ color, onChange, setChange }) => {
  const node = useRef() as MutableRefObject<HTMLDivElement>;

  const removeListeners = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
  };

  const removeTouchListeners = () => {
    setChange(false);

    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };

  useEffect(() => {
    return () => {
      removeListeners();
      removeTouchListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
  };

  const onDrag = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });
  };

  const onDragEnd = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });

    setChange(false);

    removeListeners();
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (e.touches.length !== 1) {
      return;
    }

    removeTouchListeners();

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;

    pointMoveTo({ x, y });

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
  };

  const onTouchMove = (e: any) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;

    pointMoveTo({
      x,
      y,
    });
  };

  const onTouchEnd = () => {
    removeTouchListeners();
  };

  const pointMoveTo = (coords: TCoords) => {
    const rect = node && node.current.getBoundingClientRect();
    const width = rect.width;
    let left = coords.x - rect.left;
    left = Math.max(0, left);
    left = Math.min(left, width);

    const huePercent = left / width;
    const hue = huePercent * 360;

    color.hue = hue;
    onChange(color);
  };

  const hueHsv = {
    h: color.hue,
    s: 1,
    v: 1,
  };

  const hueColor = new TinyColor(hueHsv).toHexString();

  const hue = color.hue;
  const per = (hue / 360) * 100;

  return (
    <Container ref={node} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <Background />
      <Pointer left={per} backgroundColor={hueColor} />
      <div
        css={css`
          position: absolute;
          height: 100%;
          width: 100%;
          cursor: grab;
        `}
      />
    </Container>
  );
};

export default Ribbon;
