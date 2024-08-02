import { ILayoutState } from '@/interfaces/layout';
import { create } from 'zustand';

const useLayoutStore = create<ILayoutState>((set) => ({
  activeMenuItem: null,
  showMenuItem: false,
  showControlItem: false,
  showToolboxItem: false,
  activeToolboxItem: null,
  setActiveMenuItem: (showMenu) => set({ activeMenuItem: showMenu }),
  setShowMenuItem: (showMenuItem) => set({ showMenuItem }),
  setShowControlItem: (showControlItem) => set({ showControlItem }),
  setShowToolboxItem: (showToolboxItem) => set({ showToolboxItem }),
  setActiveToolboxItem: (activeToolboxItem) => set({ activeToolboxItem }),
}));

export default useLayoutStore;
