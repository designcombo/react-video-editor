export interface IUpload {
  id: string;
  name: string;
  originalName: string;
  fileId: string;
  userId?: string;
  previewUrl: string;
  url: string;
  previewData?: string;
}
export interface User {
  id: string;
  email: string;
  avatar: string;
  username: string;
  provider: "github";
}
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
  name?: string;
}

export interface IDataState {
  fonts: IFont[];
  compactFonts: ICompactFont[];
  setFonts: (fonts: IFont[]) => void;
  setCompactFonts: (compactFonts: ICompactFont[]) => void;
}

export type IPropertyType = "textContent" | "fontSize" | "color";

/**
 * Width / height
 */
export type Ratio = number;

export type Area = [x: number, y: number, width: number, height: number];
