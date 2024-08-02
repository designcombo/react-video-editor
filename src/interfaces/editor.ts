export interface IFont {
  id: string;
  family: string;
  fullName: string;
  postScriptName: string;
  preview: string;
  style: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

export interface ICompactFont {
  family: string;
  styles: IFont[];
  default: IFont;
}

export interface IDataState {
  fonts: IFont[];
  compactFonts: ICompactFont[];
  setFonts: (fonts: IFont[]) => void;
  setCompactFonts: (compactFonts: ICompactFont[]) => void;
}

export type IPropertyType = 'textContent' | 'fontSize' | 'color';
