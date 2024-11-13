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

const WIDTH = 200;
const HEIGHT = 150;

// Styled components
const Container = styled.div`
  position: relative;
  margin-bottom: 16px;
  user-select: none;
`;

const ValueLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48bGluZWFyR3JhZGllbnQgaWQ9Imxlc3NoYXQtZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9InJnYigwLDAsMCkiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2xlc3NoYXQtZ2VuZXJhdGVkKSIgLz48L3N2Zz4=);
  background-image: linear-gradient(to bottom, transparent 0%, #000000 100%);
`;

const SaturationLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48bGluZWFyR3JhZGllbnQgaWQ9Imxlc3NoYXQtZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0icmdiKDAsMCwwKSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2xlc3NoYXQtZ2VuZXJhdGVkKSIgLz48L3N2Zz4=);
  background-image: linear-gradient(to right, #ffffff 0%, transparent 100%);
`;

const Pointer = styled.span<{
  left: string;
  top: string;
  backgroundColor: string;
}>`
  position: absolute;
  border-radius: 10px;
  width: 14px;
  height: 14px;
  border: solid 2px #ffffff;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  z-index: 2;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Overlay = styled.div`
  cursor: grab;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
`;

const Board: FC<TPropsComp> = ({ color, onChange, setChange }) => {
  const node = useRef() as MutableRefObject<HTMLDivElement>;

  const removeListeners = () => {
    setChange(false);

    window.removeEventListener("mousemove", onBoardDrag);
    window.removeEventListener("mouseup", onBoardDragEnd);
  };

  const removeTouchListeners = () => {
    setChange(false);

    window.removeEventListener("touchmove", onBoardTouchMove);
    window.removeEventListener("touchend", onBoardTouchEnd);
  };

  useEffect(() => {
    return () => {
      removeListeners();
      removeTouchListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBoardMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const buttons = e.buttons;

    if (buttons !== 1) return;

    removeListeners();

    const x = e.clientX;
    const y = e.clientY;
    pointMoveTo({ x, y });

    window.addEventListener("mousemove", onBoardDrag);
    window.addEventListener("mouseup", onBoardDragEnd);
  };

  const onBoardTouchStart = (e: TouchEvent) => {
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

    window.addEventListener("touchmove", onBoardTouchMove, { passive: false });
    window.addEventListener("touchend", onBoardTouchEnd, { passive: false });
  };

  const onBoardTouchMove = (e: any) => {
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

  const onBoardTouchEnd = () => {
    removeTouchListeners();
  };

  const onBoardDrag = (e: any) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });
  };

  const onBoardDragEnd = (e: any) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    pointMoveTo({
      x,
      y,
    });
    removeListeners();
  };

  const pointMoveTo = (pos: TCoords) => {
    const rect = node && node.current.getBoundingClientRect();
    let left = pos.x - rect.left;
    let top = pos.y - rect.top;

    const rWidth = rect.width || WIDTH;
    const rHeight = rect.height || HEIGHT;

    left = Math.max(0, left);
    left = Math.min(left, rWidth);
    top = Math.max(0, top);
    top = Math.min(top, rHeight);

    color.saturation = left / rWidth;
    color.brightness = 1 - top / rHeight;

    onChange(color);
  };

  const hueHsv = {
    h: color.hue,
    s: 1,
    v: 1,
  };

  const hueColor = new TinyColor(hueHsv).toHexString();

  const xRel = color.saturation * 100;
  const yRel = (1 - color.brightness) * 100;

  return (
    <Container ref={node}>
      <div
        css={css`
          width: 100%;
          height: 120px;
          position: relative;
          z-index: 1;
          background-color: ${hueColor};
        `}
        style={{
          height: `${154}px`,
          minHeight: `${154}px`,
        }}
      >
        <ValueLayer />
        <SaturationLayer />
      </div>
      <Pointer
        left={`calc(${xRel}% - 7px)`}
        top={`calc(${yRel}% - 7px)`}
        backgroundColor={color.toHexString()}
      />

      <Overlay
        onMouseDown={onBoardMouseDown}
        onTouchStart={onBoardTouchStart}
      />
    </Container>
  );
};

export default Board;
