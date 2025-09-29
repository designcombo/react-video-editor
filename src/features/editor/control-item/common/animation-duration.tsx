import { Slider } from "@/components/ui/slider";
import useStore from "../../store/use-store";
import { useEffect, useMemo, useState, useCallback } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";

function formatearNumero(num: number): number {
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
}

export const AnimationDuration = () => {
  const { activeIds, trackItemsMap } = useStore();
  const item = trackItemsMap[activeIds[0]];

  const [itemDuration, setItemDuration] = useState(0);
  const [inDuration, setInDuration] = useState(0);
  const [outDuration, setOutDuration] = useState(0);
  const [loopDuration, setLoopDuration] = useState(0);

  useEffect(() => {
    if (!item) return;

    const duration = item.display?.to - item.display?.from || 0;
    const inFrames = item.animations?.in?.composition[0]?.durationInFrames || 0;
    const outFrames =
      item.animations?.out?.composition[0]?.durationInFrames || 0;
    const loopFrames =
      item.animations?.loop?.composition[0]?.durationInFrames || 0;

    setItemDuration(duration);
    setInDuration((inFrames * 1000) / 30);
    setOutDuration((outFrames * 1000) / 30);
    setLoopDuration((loopFrames * 1000) / 30);
  }, [item]);

  const dispatchAnimationUpdate = useCallback(
    (type: "in" | "out" | "loop", duration: number) => {
      if (!item) return;

      dispatch(EDIT_OBJECT, {
        payload: {
          [activeIds[0]]: {
            animations: {
              [type]: {
                name: item.animations?.[type]?.name,
                composition: [
                  {
                    ...item.animations?.[type]?.composition?.[0],
                    durationInFrames: (duration * 30) / 1000
                  }
                ]
              }
            }
          }
        }
      });
    },
    [activeIds, item]
  );

  const handleInChange = useCallback(
    (value: number[]) => {
      setInDuration(value[0]);
      dispatchAnimationUpdate("in", value[0]);
    },
    [dispatchAnimationUpdate]
  );

  const handleOutChange = useCallback(
    (value: number[]) => {
      setOutDuration(value[0]);
      dispatchAnimationUpdate("out", value[0]);
    },
    [dispatchAnimationUpdate]
  );

  const handleLoopChange = useCallback(
    (value: number[]) => {
      setLoopDuration(value[0]);
      dispatchAnimationUpdate("loop", value[0]);
    },
    [dispatchAnimationUpdate]
  );

  const maxValues = useMemo(
    () => ({
      in: itemDuration - outDuration - loopDuration,
      out: itemDuration - inDuration - loopDuration,
      loop: itemDuration - inDuration - outDuration
    }),
    [itemDuration, inDuration, outDuration, loopDuration]
  );

  const renderSliderSection = (
    label: string,
    value: number,
    max: number,
    onChange: (val: number[]) => void
  ) => (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex w-full items-center gap-2">
        <div>0</div>
        <Slider
          min={0}
          max={Math.max(0, max)}
          value={[value]}
          step={1}
          onValueChange={onChange}
        />
        <div>{formatearNumero(max / 1000)}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      {item?.animations?.in &&
        renderSliderSection(
          "Animation In Duration",
          inDuration,
          maxValues.in,
          handleInChange
        )}
      {item?.animations?.out &&
        renderSliderSection(
          "Animation Out Duration",
          outDuration,
          maxValues.out,
          handleOutChange
        )}
      {item?.animations?.loop &&
        renderSliderSection(
          "Animation Loop Duration",
          loopDuration,
          maxValues.loop,
          handleLoopChange
        )}
    </div>
  );
};
