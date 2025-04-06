import { create } from "zustand";

type Area = [x: number, y: number, width: number, height: number];

interface ICropState {
  area: Area;
  setArea: (area: Area) => void;
  loadVideo: (src: string) => void;
  loadImage: (src: string) => void;
  element: HTMLImageElement | HTMLVideoElement | undefined;
  src: string;
  fileLoading: boolean;
  step: number;
  setStep: (step: number) => void;
  reset: () => void;
  scale: number;
  clear: () => void;
  size: {
    width: number;
    height: number;
  };
}

const useCropStore = create<ICropState>((set) => ({
  area: [0, 0, 0, 0],
  src: "",
  step: 0,
  fileLoading: false,
  scale: 1,
  element: undefined,
  size: {
    width: 0,
    height: 0,
  },
  reset: () => {
    set(({ element, size, scale }) => {
      if (element instanceof HTMLVideoElement) {
        element.currentTime = 0;
        element.pause();
      }
      return {
        area: [0, 0, size.width * scale, size.height * scale],
      };
    });
  },
  clear: () => {
    set({
      area: [0, 0, 0, 0],
      src: "",
      size: {
        width: 0,
        height: 0,
      },
      fileLoading: false,
      element: undefined,
    });
  },
  setArea: (area: Area) => set({ area }),
  setStep: (step: number) => set({ step }),
  loadImage: (src: string) => {
    const image = document.createElement("img");
    image.setAttribute("crossOrigin", "anonymous");
    image.setAttribute("src", src);
    image.addEventListener("load", () => {
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      const maxWidth = 700;
      const maxHeight = 520;

      // Calculate the scale factors for width and height
      const widthScale = maxWidth / imageWidth;
      const heightScale = maxHeight / imageHeight;

      // Choose the smaller scale factor to fit within both dimensions
      const scaleFactor = Math.min(widthScale, heightScale);
      set({
        area: [0, 0, imageWidth * scaleFactor, imageHeight * scaleFactor],
        src,
        size: { width: imageWidth, height: imageHeight },
      });
      set({ element: image, scale: scaleFactor });
    });
    image.src = src;
  },
  loadVideo: (src: string) => {
    set({ area: [0, 0, 0, 0], src });

    const video = document.createElement("video");

    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    video.autoplay = false;

    // Required when using a Service Worker on iOS Safari.
    video.crossOrigin = "anonymous";

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 0.01;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Define the maximum dimensions
      const maxWidth = 520;
      const maxHeight = 400;

      // Calculate the scale factors for width and height
      const widthScale = maxWidth / videoWidth;
      const heightScale = maxHeight / videoHeight;

      // Choose the smaller scale factor to fit within both dimensions
      const scaleFactor = Math.min(widthScale, heightScale);

      set({
        element: video,
        scale: scaleFactor,
        size: {
          width: videoWidth,
          height: videoHeight,
        },
        area: [0, 0, videoWidth * scaleFactor, videoHeight * scaleFactor],
      });
    });

    video.addEventListener("canplay", () => {
      set({
        fileLoading: false,
        step: 1,
      });
    });

    video.addEventListener("ended", () => {
      video.currentTime = 0;
    });

    video.addEventListener("timeupdate", () => {
      const start = 0;
      const end = video.duration;

      if (video.currentTime > end) {
        video.currentTime = start;
      } else if (video.currentTime < start - 1) {
        video.currentTime = start;
      }
    });

    video.src = src;
  },
}));

export default useCropStore;
