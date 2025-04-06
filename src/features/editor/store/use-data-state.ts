import { IDataState } from "../interfaces/editor";
import { create } from "zustand";

const useDataState = create<IDataState>((set) => ({
  fonts: [],
  compactFonts: [],
  setFonts: (fonts) => set({ fonts }),
  setCompactFonts: (compactFonts) => set({ compactFonts }),
}));

export default useDataState;
