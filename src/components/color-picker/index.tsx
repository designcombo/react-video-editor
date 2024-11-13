import { Fragment, FC } from "react";
import Gradient from "./gradient";
import Solid from "./solid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { IPropsMain } from "./types";
import "./colorpicker.css";

const ColorPicker: FC<IPropsMain> = ({
  value = "#ffffff",
  format = "rgb",
  gradient = false,
  solid = true,
  debounceMS = 300,
  debounce = true,
  showInputs = true,
  showGradientResult = true,
  showGradientStops = true,
  showGradientMode = true,
  showGradientAngle = true,
  showGradientPosition = true,
  allowAddGradientStops = true,
  colorBoardHeight = 140,

  onChange = () => ({}),
}) => {
  const onChangeSolid = (value: string) => {
    onChange(value);
  };

  const onChangeGradient = (value: string) => {
    onChange(value);
  };

  if (solid && gradient) {
    return (
      <div className="rounded-lg bg-popover p-4">
        <Tabs defaultValue="solid" className="w-[234px]">
          <TabsList>
            <TabsTrigger value="solid">Solid</TabsTrigger>
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
          </TabsList>
          <TabsContent value="solid">
            <Solid
              onChange={onChangeSolid}
              value={value}
              format={format}
              debounceMS={debounceMS}
              debounce={debounce}
              colorBoardHeight={colorBoardHeight}
            />
          </TabsContent>
          <TabsContent value="gradient">
            <Gradient
              onChange={onChangeGradient}
              value={value}
              format={format}
              debounceMS={debounceMS}
              debounce={debounce}
              showGradientResult={showGradientResult}
              showGradientStops={showGradientStops}
              showGradientMode={showGradientMode}
              showGradientAngle={showGradientAngle}
              showGradientPosition={showGradientPosition}
              allowAddGradientStops={allowAddGradientStops}
              colorBoardHeight={colorBoardHeight}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <>
      {solid || gradient ? (
        <>
          {solid ? (
            <Solid
              onChange={onChangeSolid}
              value={value}
              format={format}
              debounceMS={debounceMS}
              debounce={debounce}
              showInputs={showInputs}
              colorBoardHeight={colorBoardHeight}
            />
          ) : (
            <Fragment />
          )}
          {gradient ? (
            <Gradient
              onChange={onChangeGradient}
              value={value}
              format={format}
              debounceMS={debounceMS}
              debounce={debounce}
              showGradientResult={showGradientResult}
              showGradientStops={showGradientStops}
              showGradientMode={showGradientMode}
              showGradientAngle={showGradientAngle}
              showGradientPosition={showGradientPosition}
              allowAddGradientStops={allowAddGradientStops}
              colorBoardHeight={colorBoardHeight}
            />
          ) : (
            <Fragment />
          )}
        </>
      ) : null}
    </>
  );
};

export default ColorPicker;
