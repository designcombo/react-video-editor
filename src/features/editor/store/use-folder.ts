import { create } from "zustand";

interface IFolderStore {
	valueFolder: string;
	setValueFolder: (valueFolder: string) => void;
	videos: any[];
	setVideos: (videos: any[] | ((prev: any[]) => any[])) => void;
}

const useFolderStore = create<IFolderStore>((set) => ({
	valueFolder: "",
	setValueFolder: (valueFolder) => set({ valueFolder }),
	videos: [],
	setVideos: (videosOrUpdater) =>
		set((state) => ({
			videos:
				typeof videosOrUpdater === "function"
					? videosOrUpdater(state.videos)
					: videosOrUpdater,
		})),
}));

export default useFolderStore;
