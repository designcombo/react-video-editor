/** @jsxImportSource @emotion/react */
import {
  FC,
  useState,
  useEffect,
  useRef,
  memo,
  MutableRefObject,
  MouseEvent,
  TouchEvent,
} from "react";

import Markers from "./Markers";
import { css } from "@emotion/react";
import { getGradient } from "../utils";
import { arraysEqual, shallowEqual } from "../helper";

import { IPropsPanel, TCoords } from "./types";
import { RADIALS_POS } from "../constants";

const GradientPanel: FC<IPropsPanel> = ({
  color,
  setColor,
  activeColor,
  setActiveColor,
  setInit,
  format = "rgb",

  showGradientAngle = true,
  allowAddGradientStops = true,
}) => {
  const angleNode = useRef() as MutableRefObject<HTMLDivElement>;

  const { stops, gradient, type, modifier } = color;

  const [radialsPosition, setRadialPosition] = useState(RADIALS_POS);

  const onClickMode = () => {
    setInit(false);
    switch (type) {
      case "linear": {
        const activePos = radialsPosition.find((item) => item.active);
        setColor({
          ...color,
          modifier: activePos?.css || modifier,
          gradient: `${getGradient(
            "radial",
            stops,
            activePos?.css || modifier,
            format,
          )}`,
          type: "radial",
        });
        break;
      }

      case "radial": {
        setColor({
          ...color,
          gradient: `${getGradient("linear", stops, 180, format)}`,
          type: "linear",
        });
        break;
      }

      default: {
        break;
      }
    }
  };

  const setActiveRadialPosition = (e: MouseEvent) => {
    setInit(false);
    const target = e.target as HTMLElement;
    const pos = target.getAttribute("data-pos");
    const newRadialsPosition = radialsPosition.map((item) => {
      if (item.pos === pos) {
        return {
          ...item,
          active: true,
        };
      }

      return {
        ...item,
        active: false,
      };
    });

    setRadialPosition(newRadialsPosition);

    const activePos = newRadialsPosition.find((item) => item.active);
    setColor({
      ...color,
      modifier: activePos?.css || modifier,
      gradient: `${getGradient(
        "radial",
        stops,
        activePos?.css || modifier,
        format,
      )}`,
    });
  };

  const removeListeners = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
  };

  const removeTouchListeners = () => {
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };

  const onMouseDown = (e: any) => {
    e.preventDefault();

    setInit(false);

    if (e.button !== 0) return;

    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    if (e.target.className !== "gradient-mode" && type === "linear") {
      pointMoveTo({
        x,
        y,
        shiftKey,
        ctrlKey,
      });

      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onDragEnd);
    }
  };

  const onDrag = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    pointMoveTo({
      x,
      y,
      shiftKey,
      ctrlKey,
    });
  };

  const onDragEnd = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey * 2;

    pointMoveTo({
      x,
      y,
      shiftKey,
      ctrlKey,
    });

    removeListeners();
  };

  const onTouchStart = (e: TouchEvent) => {
    setInit(false);

    if (e.cancelable) {
      e.preventDefault();
    }

    if (e.touches.length !== 1) {
      return;
    }

    removeTouchListeners();

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    const shiftKey = false;
    const ctrlKey = 0;

    pointMoveTo({ x, y, shiftKey, ctrlKey });

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
  };

  const onTouchMove = (e: any) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const x = e.targetTouches[0].clientX;
    const y = e.targetTouches[0].clientY;
    const shiftKey = false;
    const ctrlKey = 0;

    pointMoveTo({
      x,
      y,
      shiftKey,
      ctrlKey,
    });
  };

  const onTouchEnd = () => {
    removeTouchListeners();
  };

  const pointMoveTo = (coords: TCoords) => {
    const rect = angleNode && angleNode.current.getBoundingClientRect();

    const boxcx = rect.left + rect.width / 2;
    const boxcy = rect.top + rect.height / 2;
    const radians = Math.atan2(coords.x - boxcx, coords.y - boxcy) - Math.PI;
    const degrees = Math.abs((radians * 180) / Math.PI);

    const div = [1, 2, 4][Number(coords.shiftKey || coords.ctrlKey)];
    const newAngle = degrees - (degrees % (45 / div));

    setColor({
      ...color,
      gradient: `${getGradient(type, stops, newAngle, format)}`,
      modifier: newAngle,
    });
  };

  useEffect(() => {
    return () => {
      removeListeners();
      removeTouchListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (type === "radial") {
      const activePos = radialsPosition.find((item) => item.css === modifier);
      setColor({
        ...color,
        modifier: activePos?.css || modifier,
        gradient: `${getGradient(
          "radial",
          stops,
          activePos?.css || modifier,
          format,
        )}`,
      });

      setRadialPosition(
        RADIALS_POS.map((item) => {
          if (item.css === modifier) {
            return {
              ...item,
              active: true,
            };
          }

          return {
            ...item,
            active: false,
          };
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifier]);

  return (
    <div
      css={css`
        flex-direction: column;
        display: flex;
        z-index: 1;
        gap: 16px;
      `}
    >
      <div
        className="gradient-result"
        onMouseDown={showGradientAngle ? onMouseDown : undefined}
        onTouchStart={showGradientAngle ? onTouchStart : undefined}
        style={{ background: gradient }}
      >
        <div
          data-mode={type}
          className="gradient-mode"
          onClick={() => onClickMode()}
        />
        <div
          className="gradient-angle"
          ref={angleNode}
          style={{ visibility: type === "linear" ? "visible" : "hidden" }}
        >
          <div
            style={{
              transform: `rotate(${
                typeof modifier === "number" ? modifier - 90 + "deg" : modifier
              })`,
            }}
          ></div>
        </div>
        <div
          className="gradient-pos"
          style={{
            opacity: type === "radial" ? "1" : "0",
            visibility: type === "radial" ? "visible" : "hidden",
          }}
        >
          {radialsPosition.map((item) => {
            return (
              <div
                key={item.pos}
                data-pos={item.pos}
                className={item.active ? "gradient-active" : ""}
                onClick={(e) => setActiveRadialPosition(e)}
              />
            );
          })}
        </div>
      </div>
      <Markers
        color={color}
        setColor={setColor}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        setInit={setInit}
        format={format}
        allowAddGradientStops={allowAddGradientStops}
      />
    </div>
  );
};

const arePropsEqual = (prevProps: any, nextProps: any) => {
  if (
    arraysEqual(prevProps.color.stops, nextProps.color.stops) &&
    prevProps.color.modifier === nextProps.color.modifier &&
    prevProps.color.type === nextProps.color.type &&
    shallowEqual(prevProps.activeColor, nextProps.activeColor)
  ) {
    return true;
  }

  return false;
};

export default memo(GradientPanel, arePropsEqual);
