export interface IPropsComp {
  value: string;
  format?: "rgb" | "hsl" | "hex";
  debounceMS?: number;
  debounce?: boolean;
  showInputs?: boolean;
  showGradientResult?: boolean;
  showGradientStops?: boolean;
  showGradientMode?: boolean;
  showGradientAngle?: boolean;
  showGradientPosition?: boolean;
  allowAddGradientStops?: boolean;
  colorBoardHeight?: number;
  defaultColors?: string[];
  defaultActiveTab?: string | undefined;
  onChangeTabs?: (tab: string) => void;
  onChange: (value: string) => void;
}

export interface IPropsMain extends IPropsComp {
  gradient?: boolean;
  solid?: boolean;
  popupWidth?: number;
}

export type TPropsChange = {
  alpha: number;
  hex: string;
};

export interface IActiveColor {
  hex: string;
  alpha: number;
  loc: any;
  index: any;
}
