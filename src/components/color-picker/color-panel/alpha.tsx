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

import { TPropsCompAlpha, TCoords } from "./types";

const rgbaColor = (r: number, g: number, b: number, a: number) => {
  return `rgba(${[r, g, b, a / 100].join(",")})`;
};

// Styled components
const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(to right, transparent, black),
    url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 100%, 6px;
  background-repeat: repeat;
  user-select: none;
`;

const Background = styled.div<{ background: string }>`
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: 4px;
  background: ${(props) => props.background};
`;

const Pointer = styled.span<{ left: number; backgroundColor: string }>`
  position: absolute;
  top: -3px;
  height: 14px;
  width: 14px;
  padding: 1px 0;
  margin-left: -7px;
  border-radius: 50%;
  border: solid 2px white;
  cursor: grab;
  left: ${(props) => props.left}%;
  background-color: ${(props) => props.backgroundColor};
`;

const Alpha: FC<TPropsCompAlpha> = ({ color, alpha, onChange, setChange }) => {
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

  const onDragEnd = (event: any) => {
    const x = event.clientX;
    const y = event.clientY;

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

  const getBackground = () => {
    const { red, green, blue } = color;
    const opacityGradient = `linear-gradient(to right, ${rgbaColor(
      red,
      green,
      blue,
      0,
    )} , ${rgbaColor(red, green, blue, 100)})`;

    return opacityGradient;
  };

  const pointMoveTo = (coords: TCoords) => {
    const rect = node && node.current.getBoundingClientRect();
    const width = rect.width;
    let left = coords.x - rect.left;

    left = Math.max(0, left);
    left = Math.min(left, width);

    const alpha = Math.round((left / width) * 100);

    onChange(alpha);
  };

  const getPointerBackground = () => {
    const { red, green, blue } = color;
    const alphaVal = (alpha || 1) / 100;

    return `rgba(${red}, ${green}, ${blue}, ${alphaVal})`;
  };

  return (
    <Container ref={node} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <Background background={getBackground()} />
      <Pointer left={alpha!} backgroundColor={getPointerBackground()} />
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

export default Alpha;
