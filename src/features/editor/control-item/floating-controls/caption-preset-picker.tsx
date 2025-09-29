import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dispatch } from "@designcombo/events";
import { ADD_ITEMS, EDIT_OBJECT, LAYER_DELETE } from "@designcombo/state";
import { ITrackItem, ITrackItemsMap } from "@designcombo/types";
import { CircleOff, XIcon } from "lucide-react";
import useLayoutStore from "../../store/use-layout-store";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useStore from "../../store/use-store";
import { groupBy } from "lodash";
import { loadFonts } from "../../utils/fonts";
import { transformCaptions } from "../common/caption-words";
import { generateId } from "@designcombo/timeline";
import { PresetPicker } from "../common/preset-picker";
interface IBoxShadow {
  color: string;
  x: number;
  y: number;
  blur: number;
}
export interface ICaptionsControlProps {
  type?: "word" | "lines";
  appearedColor: string;
  activeColor: string;
  activeFillColor: string;
  color: string;
  isKeywordColor?: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  boxShadow?: IBoxShadow;
  animation?: string;
  fontFamily?: string;
  fontUrl?: string;
  textTransform?: string;
  previewUrl?: string;
  textAlign?: string;
  preservedColorKeyWord?: boolean;
}

export const NONE_PRESET: ICaptionsControlProps = {
  appearedColor: "#000000",
  activeColor: "#000000",
  activeFillColor: "transparent",
  color: "#000000",
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderWidth: 0,
  boxShadow: { color: "#000000", x: 15, y: 15, blur: 60 }
};
export const STYLE_CAPTION_PRESETS: ICaptionsControlProps[] = [
  {
    appearedColor: "#FFFFFF",
    activeColor: "#50FF12",
    activeFillColor: "#7E12FF",
    color: "#DADADA",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset1.webm"
  },
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#b5b5b8",
    backgroundColor: "#e6e6e5",
    borderColor: "transparent",
    borderWidth: 0,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset2.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    boxShadow: { color: "#ffffff", x: 15, y: 15, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset3.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: { color: "#ffffff", x: 15, y: 15, blur: 60 },
    animation: "typewriterEffect",
    fontFamily: "Cinzel-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/cinzel/v11/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnTYrvDE5ZdqU.ttf",

    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset4.webm"
  },
  {
    appearedColor: "transparent",
    activeColor: "transparent",
    activeFillColor: "transparent",
    color: "rgba(0, 0, 0, 0.6)",
    backgroundColor: "transparent",
    borderColor: "#ffffff",
    borderWidth: 5,
    boxShadow: { color: "#ffffff", x: 15, y: 15, blur: 60 },
    fontFamily: "ChelseaMarket-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/chelseamarket/v8/BCawqZsHqfr89WNP_IApC8tzKBhlLA4uKkWk.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset5.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#fc5a05",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset6.webm"
  },
  {
    appearedColor: "#fcbf03",
    activeColor: "#fcbf03",
    activeFillColor: "transparent",
    color: "#fcbf03",
    backgroundColor: "transparent",
    borderColor: "#fcbe0365",
    borderWidth: 5,
    boxShadow: { color: "#fcbe0365", x: 15, y: 15, blur: 60 },
    fontFamily: "CabinCondensed-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpMtK6mNhBK2err_hqkYhHRqmwaYOjZ5HZl8Q.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset7.webm"
  },
  {
    appearedColor: "#fffd30",
    activeColor: "#fffd30",
    activeFillColor: "transparent",
    color: "#fffd30",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: { color: "#fffd30", x: 15, y: 15, blur: 60 },
    animation: "typewriterEffect",
    fontFamily: "Chivo-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/chivo/v12/va9I4kzIxd1KFoBvS-J3kbDP.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset8.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: { color: "#161616", x: 15, y: 15, blur: 30 },
    animation: "letterElla",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset9.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: { color: "#161616", x: 15, y: 15, blur: 30 },
    animation: "letterHormozi",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset10.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#04f827FF",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "letterKaraoke/scaleAnimationLetterEffect",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset11.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    boxShadow: { color: "#ffffff", x: 15, y: 15, blur: 60 },
    animation: "letterBeasty",
    fontFamily: "Montserrat-SemiBold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_bZF7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset12.webm"
  },
  {
    appearedColor: "#b5b5b8",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#b5b5b8",
    backgroundColor: "#e6e6e5",
    borderColor: "transparent",
    borderWidth: 0,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset13.webm"
  },
  {
    appearedColor: "#827a7f",
    activeColor: "#80eac9",
    activeFillColor: "transparent",
    color: "#827a7f",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset14.webm"
  },
  {
    appearedColor: "#ec41e2",
    activeColor: "#ec41e2",
    activeFillColor: "transparent",
    color: "#ec41e2",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset15.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "letterPopline/underlineEffect/scaleAnimationLetterEffect",
    fontFamily: "Viga-Regular",
    fontUrl: "https://fonts.gstatic.com/s/viga/v9/xMQbuFFdSaiX_QIjD4e2OX8.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset16.webm"
  },
  //new preset
  {
    appearedColor: "#ffffff",
    activeColor: "#059efc",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "letterKaraoke/scaleAnimationLetterEffect",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset17.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation1",
    textTransform: "uppercase",
    fontFamily: "FrancoisOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/francoisone/v15/_Xmr-H4zszafZw3A-KPSZutNxgKQu_avAg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset18.webm"
  },
  {
    appearedColor: "#b7bb62",
    activeColor: "#b7bb62",
    activeFillColor: "transparent",
    color: "#b7bb62",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset19.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation2",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset20.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#b5f026",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset21.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#cbc900",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    animation: "captionAnimation3",
    fontFamily: "Roboto-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset22.webm"
  },
  {
    appearedColor: "#d30dbd",
    activeColor: "#d30dbd",
    activeFillColor: "transparent",
    color: "#e89161",
    backgroundColor: "#e4ff00",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset23.webm"
  },
  {
    type: "word",
    appearedColor: "#07ed09",
    activeColor: "#07ed09",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation4",
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    fontFamily: "EncodeSans-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/encodesans/v8/LDIcapOFNxEwR-Bd1O9uYNmnUQomAgE25imKSbHhROjLsZBWTSrQGGHjZtWP7FJCt2c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset24.webm"
  },
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "transparent",
    borderColor: "#ffffff",
    borderWidth: 5,
    boxShadow: { color: "#000000", x: 1, y: 1, blur: 4 },
    textTransform: "uppercase",
    fontFamily: "FrancoisOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/francoisone/v15/_Xmr-H4zszafZw3A-KPSZutNxgKQu_avAg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset25.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#8ffb9f",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset26.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7d0bdc",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 1, y: 1, blur: 4 },
    fontFamily: "FrancoisOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/francoisone/v15/_Xmr-H4zszafZw3A-KPSZutNxgKQu_avAg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset27.webm"
  },
  //modified
  {
    appearedColor: "#ffffff",
    activeColor: "#2f9bf4",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textTransform: "uppercase",
    animation: "captionAnimation5",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset28.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#16f3f8",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset29.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation6",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset30.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#4fd94c",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation7",
    textTransform: "uppercase",
    fontFamily: "BebasNeue-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXooxW5rygbi49c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset31.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7d0bdc",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 2, y: 2, blur: 40 },
    animation: "animationScaleMinEffect",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset32.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#7d0bdc",
    borderColor: "transparent",
    borderWidth: 0,
    // textTransform: "uppercase",
    animation: "captionAnimation9",
    fontFamily: "EncodeSans-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/encodesans/v8/LDIcapOFNxEwR-Bd1O9uYNmnUQomAgE25imKSbHhROjLsZBWTSrQGGHjZtWP7FJCt2c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset33.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#d20604",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset34.webm"
  },
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "#f0ea00",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset35.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7d0bdc",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    animation: "captionAnimation10",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset36.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#f2e218",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 1 },
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset37.webm"
  },
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "#e4ff00",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    textTransform: "uppercase",
    animation: "captionAnimation11",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset38.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation1",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 10 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset39.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation12",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset40.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffe401",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation3",
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset41.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#58d852",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation13",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset42.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#d769b3",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset43.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#0dfaff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    boxShadow: { color: "#0dfaff", x: 15, y: 15, blur: 60 },
    textTransform: "uppercase",
    animation: "captionAnimation14",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset44.webm"
  },
  {
    appearedColor: "#45efba",
    activeColor: "#45efba",
    activeFillColor: "#000000",
    color: "#45efba",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    textTransform: "uppercase",
    animation: "captionAnimation15",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset45.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#38dc31",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 20,
    fontFamily: "Knewave-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/knewave/v9/sykz-yx0lLcxQaSItSq9-trEvlQ.ttf",
    boxShadow: { color: "#38dc31", x: 15, y: 15, blur: 60 },
    textTransform: "uppercase",
    animation: "captionAnimation14",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset46.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#23f8f9",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation16/scaleAnimationLetterEffect",
    textTransform: "uppercase",
    fontFamily: "Knewave-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/knewave/v9/sykz-yx0lLcxQaSItSq9-trEvlQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset47.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    animation: "captionAnimation1",
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 15, y: 15, blur: 60 },
    fontFamily: "Knewave-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/knewave/v9/sykz-yx0lLcxQaSItSq9-trEvlQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset48.webm"
  },
  {
    appearedColor: "#ddd257",
    activeColor: "#ddd257",
    activeFillColor: "transparent",
    color: "#ddd257",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    textTransform: "uppercase",
    animation: "captionAnimation11",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset49.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#85fc0e",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset50.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#2fd224",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation16/scaleAnimationLetterEffect",
    textTransform: "uppercase",
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset51.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    animation: "animationScaleMinEffect",
    textTransform: "uppercase",
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    boxShadow: { color: "#ffffff", x: 4, y: 4, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset52.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    animation: "captionAnimation18",
    textTransform: "uppercase",
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    boxShadow: { color: "#ffffff", x: 4, y: 4, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset53.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#f70406",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    animation: "captionAnimation19",
    textTransform: "uppercase",
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    boxShadow: { color: "#ffffff", x: 4, y: 4, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset54.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation19",
    fontFamily: "FjallaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fjallaone/v8/Yq6R-LCAWCX3-6Ky7FAFnOZwkxgtUb8.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset55.webm"
  },
  {
    type: "word",
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "#03f237",
    color: "#000000",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    animation: "captionAnimation20",
    textTransform: "uppercase",
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    boxShadow: { color: "#ffffff", x: 4, y: 4, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset56.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation21",
    textTransform: "uppercase",
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset57.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation22",
    textTransform: "uppercase",
    fontFamily: "PermanentMarker-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/permanentmarker/v10/Fh4uPib9Iyv2ucM6pGQMWimMp004HaqIfrT5nlk.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset58.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7d0bdc",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 60 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset59.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "Atma-SemiBold",
    fontUrl:
      "https://fonts.gstatic.com/s/atma/v8/uK_z4rqWc-Eoo7Z1Kjc9PvedRkM.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset60.webm"
  },
  {
    appearedColor: "#26ecea",
    activeColor: "#26ecea",
    activeFillColor: "transparent",
    color: "#26ecea",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset61.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation4",
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 30 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset62.webm"
  },
  {
    appearedColor: "#f7f677",
    activeColor: "#f7f677",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    animation: "captionAnimation23",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset63.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation21",
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset64.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    animation: "captionAnimation21",
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset65.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#aef962",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset66.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset67.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 15,
    animation: "captionAnimation24",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset68.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#00cbd8",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset69.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    animation: "captionAnimation25",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset70.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "AnonymousPro-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/anonymouspro/v14/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
    animation: "captionAnimation26",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset71.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    animation: "captionAnimation27",
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 30 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset72.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    animation: "captionAnimation28",
    textTransform: "uppercase",
    boxShadow: { color: "#ffffff", x: 10, y: 10, blur: 30 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset73.webm"
  },
  {
    appearedColor: "#ffffff",
    activeColor: "#f9861a",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    textTransform: "uppercase",
    boxShadow: { color: "#000000", x: 10, y: 10, blur: 30 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset74.webm"
  },
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    animation: "captionAnimation29",
    textTransform: "uppercase",
    boxShadow: { color: "#ffffff", x: 4, y: 4, blur: 2 },
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset75.webm"
  },
  {
    type: "word",
    appearedColor: "#c2af38",
    activeColor: "#c2af38",
    activeFillColor: "transparent",
    color: "#c2af38",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    animation: "captionAnimation30",
    textTransform: "uppercase",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset76.webm"
  },
  //new presets
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#6c4df7",
    color: "#ffffff",
    backgroundColor: "#41434a",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular", // "font Avenir Next"
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset77.webm"
  },
  //quintessence
  {
    type: "word",
    appearedColor: "#fff600",
    activeColor: "#fff600",
    activeFillColor: "transparent",
    color: "#fff600",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    animation: "captionAnimation31",
    fontFamily: "Imbue10pt-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/imbue/v9/RLpXK5P16Ki3fXhj5cvGrqjocPk4n-gVX3M93TnrnvhoP8iXfOsNNK-Q4xY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset78.webm"
  },
  //nova : scale keyword
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    animation: "captionAnimation32/animationScaleDinamicEffect",
    fontFamily: "Imbue10pt-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/imbue/v9/RLpXK5P16Ki3fXhj5cvGrqjocPk4n-gVX3M93TnrnvhoP8iXfOsNNK-Q4xY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset79.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 28 },
    textTransform: "lowercase"
  },
  //performance : yellow scale keyword
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#f6ff00",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_dJE7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset80.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 28 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword1",
    preservedColorKeyWord: true
  },
  //chase

  {
    appearedColor: "#d8c6b0",
    activeColor: "#d8c6b0",
    activeFillColor: "transparent",
    color: "#6b766e",
    backgroundColor: "#334744",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset81.webm"
  },

  //footprint
  {
    appearedColor: "#ffffff",
    activeColor: "#fcfd00",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "AndadaPro-Medium",
    fontUrl:
      "https://fonts.gstatic.com/s/andadapro/v7/HhyEU5Qi9-SuOEhPe4LtKoVCuWGURPcg3DP7BY8cFLzvIt2S.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset82.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword2"
  },

  //chronicle
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "AndadaPro-Medium",
    fontUrl:
      "https://fonts.gstatic.com/s/andadapro/v7/HhyEU5Qi9-SuOEhPe4LtKoVCuWGURPcg3DP7BY8cFLzvIt2S.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset83.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 }
  },

  //triangulum
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#00000049",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Poppins-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset84.webm"
  },

  //glow
  {
    appearedColor: "transparent",
    activeColor: "transparent",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#ffffff",
    borderWidth: 2,
    textTransform: "uppercase",
    fontFamily: "AlfaSlabOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/alfaslabone/v10/6NUQ8FmMKwSEKjnm5-4v-4Jh6dVretWvYmE.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset85.webm",
    boxShadow: { color: "#ff0089", x: 0, y: 0, blur: 50 },
    animation: "captionAnimation33"
  },

  //impact
  {
    appearedColor: "#00fef8",
    activeColor: "#00fef8",
    activeFillColor: "transparent",
    isKeywordColor: "#e03d1f",
    color: "#00fef8",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textTransform: "uppercase",
    fontFamily: "BebasNeue-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXooxW5rygbi49c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset86.webm",
    animation: "captionAnimationKeyword3"
  },

  //omega green
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#74f94b",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textTransform: "uppercase",
    fontFamily: "Rubik-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/rubik/v14/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-ro-1UE80V4bVkA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset87.webm",
    animation: "captionAnimationKeyword4"
  },

  //epsilon
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#f7ce46",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textTransform: "uppercase",
    fontFamily: "Poppins-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset88.webm",
    animation: "captionAnimationKeyword5"
  },

  //nova
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textTransform: "uppercase",
    fontFamily: "Poppins-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset89.webm"
  },

  //growth

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ff0000",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular", // "font Avenir Next"
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset90.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 100 },
    animation: "captionAnimation34"
  },

  //alycone pink

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#ea3fb2",
    isKeywordColor: "#f7ce46",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset91.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimation35"
  },

  //impact
  {
    appearedColor: "#00fef8",
    activeColor: "#00fef8",
    activeFillColor: "transparent",
    isKeywordColor: "#ff311f",
    color: "#00fef8",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset92.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimationKeyword6"
  },

  //cartwheel blue
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#62d57b",
    color: "#ffffff",
    backgroundColor: "#75fbfd98",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset93.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimation36"
  },

  //runway
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CabinCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpJtK6mNhBK2err_hqkYhHRqmwi3Mf97F15-K1oqQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset94.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimation37"
  },

  //throwback
  {
    appearedColor: "#f8df25",
    activeColor: "#f8df25",
    activeFillColor: "transparent",
    color: "#f8df25",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "CabinCondensed-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpMtK6mNhBK2err_hqkYhHRqmwaYOjZ5HZl8Q.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset95.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 }
  },

  //vinyl
  {
    appearedColor: "#1e1b1b",
    activeColor: "#ff3c00",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "DMSans-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/dmsans/v6/rP2Cp2ywxg089UriASitOB-sClQX6Cg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset96.webm"
  },

  //sky

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#ffffff27",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CabinCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpJtK6mNhBK2err_hqkYhHRqmwi3Mf97F15-K1oqQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset97.webm"
  },

  //magazine cover
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#e7ef4e",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    textAlign: "left",
    fontFamily: "BebasNeue-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXooxW5rygbi49c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset98.webm",
    animation: "captionAnimationKeyword6"
  },

  //runway
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ff0077",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CabinCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpJtK6mNhBK2err_hqkYhHRqmwi3Mf97F15-K1oqQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset99.webm",
    animation: "captionAnimation37"
  },

  //finlay
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#f7ce46",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular", // "font Avenir Next"
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset100.webm",
    animation: "captionAnimation38"
  },

  //freshly
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#6d7780",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-Light",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_cJD7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset101.webm",
    animation: "captionAnimation38"
  },

  //hustle v2

  {
    appearedColor: "#ffffff",
    activeColor: "#ff5446",
    activeFillColor: "transparent",
    isKeywordColor: "#f2ed6b",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_epG7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset102.webm",
    animation: "captionAnimationKeyword7"
  },

  //blueprint

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset103.webm",
    animation: "captionAnimationKeyword8"
  },

  //doodle :implemented 104

  {
    appearedColor: "#ffffff",
    activeColor: "#ffb0bd",
    activeFillColor: "transparent",
    isKeywordColor: "#ffd980",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#c95858",
    borderWidth: 5,
    fontFamily: "FredokaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTmHBA6aF8Bf_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset104.webm",
    boxShadow: { color: "#412424", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword9"
  },

  //apex

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#93f9ff",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Lemonada-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/lemonada/v14/0QI-MXFD9oygTWy_R-FFlwV-bgfR7QJGnex2mfWc3Z2pTg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset105.webm",
    animation: "captionAnimationKeyword10"
  },

  //alycone purple

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#731ef5",
    isKeywordColor: "#f0d060",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset106.webm",
    animation: "captionAnimationKeyword11"
  },

  //cove internal

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "ChelseaMarket-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/chelseamarket/v8/BCawqZsHqfr89WNP_IApC8tzKBhlLA4uKkWk.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset107.webm",
    animation: "captionAnimationKeyword12/animationScaleDinamicEffect"
  },

  //leo

  {
    type: "word",
    appearedColor: "#f5ec00",
    activeColor: "#f5ec00",
    activeFillColor: "transparent",
    color: "#f5ec00",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset108.webm",
    animation: "captionAnimationKeyword13",
    boxShadow: { color: "#f7e848", x: 0, y: 0, blur: 60 }
  },

  //scene

  {
    appearedColor: "#f9e51f",
    activeColor: "#f9e51f",
    activeFillColor: "transparent",
    color: "#f9e51f",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Baskervville-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/baskervville/v5/YA9Ur0yU4l_XOrogbkun3kQgt5OohvbJ9A.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset109.webm",
    animation: "captionAnimationKeyword14/animationScaleDinamicEffect",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 }
  },

  //Drive

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_dJE7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset110.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    textTransform: "uppercase"
  },

  //Neon

  {
    appearedColor: "#ffffff",
    activeColor: "#e8a7bf",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "FredokaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTmHBA6aF8Bf_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset111.webm",
    boxShadow: { color: "#ff00bb", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword20"
  },

  //Contrast

  {
    appearedColor: "#f6ff00",
    activeColor: "#f6ff00",
    activeFillColor: "transparent",
    color: "#f6ff00",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Neuton-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/neuton/v13/UMBTrPtMoH62xUZyyII7civlBw.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset112.webm"
  },

  //Best Performance
  {
    type: "word",
    appearedColor: "#f6ff00",
    activeColor: "#f6ff00",
    activeFillColor: "transparent",
    color: "#f6ff00",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_dJE7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset113.webm",
    textTransform: "uppercase",
    animation: "captionAnimationKeyword15"
  },

  //Neon 3

  {
    appearedColor: "#ffffff",
    activeColor: "#e8a7bf",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset114.webm",
    boxShadow: { color: "#ff00bb", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword20"
  },

  //Orbitar Black

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ffcc02",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "DMSans-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/dmsans/v6/rP2Cp2ywxg089UriASitOB-sClQX6Cg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset115.webm",
    animation: "captionAnimationKeyword16"
  },

  //sepia

  {
    type: "word",
    appearedColor: "#e8d4b8",
    activeColor: "#e8d4b8",
    activeFillColor: "transparent",
    color: "#e8d4b8",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset116.webm",
    animation: "captionAnimationKeyword17",
    textTransform: "lowercase"
  },

  //fuel

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#d6ff42",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Lemonada-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/lemonada/v14/0QI-MXFD9oygTWy_R-FFlwV-bgfR7QJGnex2mfWc3Z2pTg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset117.webm",
    animation: "captionAnimationKeyword18"
  },

  //recipe

  {
    appearedColor: "#ffffff",
    activeColor: "#f6bd60",
    activeFillColor: "transparent",
    isKeywordColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#f24b34",
    borderWidth: 5,
    fontFamily: "LilitaOne",
    fontUrl:
      "https://fonts.gstatic.com/s/lilitaone/v8/i7dPIFZ9Zz-WBtRtedDbUEZ2RFq7AwU.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset118.webm",
    boxShadow: { color: "#f24b34", x: 4, y: 2, blur: 1 },
    animation: "captionAnimationKeyword19"
  },

  //Dimidium

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#f7ce46",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset119.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword21/animationScaleDinamicEffect",
    textAlign: "right",
    preservedColorKeyWord: true
  },

  //Drive

  {
    appearedColor: "#ffffff",
    activeColor: "#fdf146",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "PublicSans-BlackItalic",
    fontUrl:
      "https://fonts.gstatic.com/s/publicsans/v7/ijwAs572Xtc6ZYQws9YVwnNDZpDyNjGolS673tr4hwctfVotfj7j.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset120.webm",
    boxShadow: { color: "#000000", x: 0, y: 10, blur: 60 },
    animation: "captionAnimationKeyword22",
    textTransform: "uppercase"
  },

  //Aries

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#fff994",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "BebasNeue-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bebasneue/v2/JTUSjIg69CK48gW7PXooxW5rygbi49c.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset121.webm",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 60 },
    animation: "captionAnimationKeyword23",
    textTransform: "uppercase",
    preservedColorKeyWord: true
  },

  //Techwave

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "Montserrat-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_epG7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset122.webm",
    animation: "captionAnimationKeyword24",
    textTransform: "uppercase"
  },

  //Essence

  {
    type: "word",
    appearedColor: "#fff600",
    activeColor: "#fff600",
    activeFillColor: "transparent",
    color: "#fff600",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset123.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword25",
    textTransform: "uppercase"
  },

  //Arion Pink

  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    isKeywordColor: "#ffffff",
    color: "#000000",
    backgroundColor: "#e53268",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset124.webm",
    animation: "captionAnimationKeyword26",
    preservedColorKeyWord: true
  },

  //Cartwheel Purple

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#f7ce46",
    color: "#ffffff",
    backgroundColor: "#731ef5",
    borderColor: "#000000",
    borderWidth: 3,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset125.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword27",
    preservedColorKeyWord: true
  },

  //Baseline

  {
    appearedColor: "#ffffff6e",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset126.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword28"
  },

  //Cartwheel Black

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#8d1bf5",
    color: "transparent",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset127.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword29",
    preservedColorKeyWord: true
  },

  //Pulse

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#15c7ff",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "RobotoCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/robotocondensed/v19/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCMSbvtdYyQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset128.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword30",
    textTransform: "uppercase",
    preservedColorKeyWord: true
  },

  //Theta

  {
    appearedColor: "#f7ce46",
    activeColor: "#f7ce46",
    activeFillColor: "transparent",
    isKeywordColor: "#15c7ff",
    color: "#f7ce46",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "Rubik-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/rubik/v14/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-ro-1UE80V4bVkA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset129.webm",
    boxShadow: { color: "#eb4d3d", x: 4, y: 4, blur: 10 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword31",
    preservedColorKeyWord: true
  },

  //Alycone Blue

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#75fbfd",
    isKeywordColor: "#731ef5",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "Bangers-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset130.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword32",
    preservedColorKeyWord: true
  },

  //Messages

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "#1f8aff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular", // "font Avenir Next"
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset131.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    animation: "captionAnimationKeyword33"
  },

  //Clash

  {
    appearedColor: "#ffffff",
    activeColor: "#feff00",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "RobotoSlab-Medium",
    fontUrl:
      "https://fonts.gstatic.com/s/robotoslab/v16/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjovoSWaG5iddG-1A.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset132.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    animation: "captionAnimationKeyword108"
  },

  //Recess

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#ab9de9",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "FredokaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTmHBA6aF8Bf_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset133.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    animation: "captionAnimationKeyword34"
  },

  //Poem

  {
    appearedColor: "#23292a",
    activeColor: "#23292a",
    activeFillColor: "transparent",
    color: "#23292a",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CaveatBrush-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/caveatbrush/v6/EYq0maZfwr9S9-ETZc3fKXtMW7mT03pdQw.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset134.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 }
  },

  //Note

  {
    appearedColor: "#fdf6eb",
    activeColor: "#fdf6eb",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "AguafinaScript-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/aguafinascript/v9/If2QXTv_ZzSxGIO30LemWEOmt1bHqs4pgicOrg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset135.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    textTransform: "lowercase",
    animation: "captionAnimationKeyword35"
  },

  //CNN

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CabinCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpJtK6mNhBK2err_hqkYhHRqmwi3Mf97F15-K1oqQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset136.webm"
  },

  //Marigold

  {
    appearedColor: "#ffffff",
    activeColor: "#fde400",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "DMSerifText-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/dmseriftext/v5/rnCu-xZa_krGokauCeNq1wWyafOPXHIJErY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset137.webm",
    boxShadow: { color: "#fde400", x: 0, y: 0, blur: 30 }
  },

  //Omega Red

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ea3425",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Rubik-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/rubik/v14/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-ro-1UE80V4bVkA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset138.webm",
    boxShadow: { color: "#eb4d3d", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword36"
  },

  //Lyra

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "DMSerifText-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/dmseriftext/v5/rnCu-xZa_krGokauCeNq1wWyafOPXHIJErY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset139.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword37"
  },

  //Courage

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#b73226",
    color: "#ffeecf",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset140.webm",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 10 },
    animation: "captionAnimationKeyword38",
    preservedColorKeyWord: true
  },

  //Suzy

  {
    appearedColor: "#fdc515",
    activeColor: "#fdc515",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#f5c944",
    borderWidth: 2,
    fontFamily: "DMSerifText-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/dmseriftext/v5/rnCu-xZa_krGokauCeNq1wWyafOPXHIJErY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset141.webm",
    boxShadow: { color: "#fd6000", x: 2, y: 2, blur: 4 },
    animation: "captionAnimationKeyword107"
  },

  //Eclipse
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff3a",
    backgroundColor: "rgba(10, 57, 146, 0.41)",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "DMSerifText-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/dmseriftext/v5/rnCu-xZa_krGokauCeNq1wWyafOPXHIJErY.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset142.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 }
  },

  //Daily Mail

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#0000d5",
    borderWidth: 7,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset143.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword39"
  },

  //Magazine

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#e7ef4e",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Chivo-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/chivo/v12/va9F4kzIxd1KFrjTZMZ_uqzGQC_-.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset144.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword40",
    preservedColorKeyWord: true
  },

  //Heat

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ff0000",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset145.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimationKeyword41",
    preservedColorKeyWord: true
  },

  //Alula Ausralis

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#5832e26c",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset146.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimationKeyword42",
    textAlign: "left",
    preservedColorKeyWord: true
  },

  //Citadelle

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    fontFamily: "Staatliches-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/staatliches/v6/HI_OiY8KO6hCsQSoAPmtMbectJG9O9PS.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset147.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimationKeyword43",
    textAlign: "left",
    preservedColorKeyWord: true
  },

  //Ingrid

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ff3a30",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "Staatliches-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/staatliches/v6/HI_OiY8KO6hCsQSoAPmtMbectJG9O9PS.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset148.webm",
    boxShadow: { color: "#000000", x: 2, y: 2, blur: 30 },
    animation: "captionAnimationKeyword44",
    textAlign: "left",
    preservedColorKeyWord: true
  },

  //Grace

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset149.webm",
    boxShadow: { color: "#000000", x: 3, y: 3, blur: 10 },
    animation: "captionAnimationKeyword45"
  },

  //Pollux B

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e52f551",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset150.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword46",
    textAlign: "left",
    preservedColorKeyWord: true
  },

  //Citadelle

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset151.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    animation: "captionAnimationKeyword47",
    preservedColorKeyWord: true
  },

  //Aldebaran

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#32c759",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "FredokaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTmHBA6aF8Bf_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset152.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword48",
    preservedColorKeyWord: true
  },

  //Bette

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 6,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset153.webm",
    boxShadow: { color: "#000000", x: 3, y: 3, blur: 10 },
    animation: "captionAnimationKeyword49"
  },

  //Virgo A

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#d40001",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset154.webm",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 10 },
    animation: "captionAnimationKeyword50",
    preservedColorKeyWord: true
  },

  //Bellatrix

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset155.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword51",
    preservedColorKeyWord: true
  },

  //Claudette

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "FredokaOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTmHBA6aF8Bf_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset156.webm",
    boxShadow: { color: "#412424", x: 0, y: 0, blur: 60 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword52",
    preservedColorKeyWord: true
  },

  //Canopus

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SecularOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/secularone/v5/8QINdiTajsj_87rMuMdKypDlMul7LJpK.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset157.webm"
  },

  //Capella

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#ff3a30",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "JuliusSansOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/juliussansone/v9/1Pt2g8TAX_SGgBGUi0tGOYEga5W-xXEW6aGXHw.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset158.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword53",
    preservedColorKeyWord: true
  },

  //Copernicus

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#5832e2",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-ExtraBold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_c5H7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset159.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword54",
    preservedColorKeyWord: true
  },

  //Mars

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-ExtraBold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_c5H7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset160.webm",
    animation: "captionAnimationKeyword55"
  },

  //Scorpius

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#c2c2c2",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset161.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword56",
    preservedColorKeyWord: true
  },

  //Scorpius

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#fcfd00",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset162.webm",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 10 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword57",
    preservedColorKeyWord: true
  },

  //Draco

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#fcfd00",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset163.webm",
    textAlign: "left",
    animation: "captionAnimationKeyword58",
    preservedColorKeyWord: true
  },

  //Perseus

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "JuliusSansOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/juliussansone/v9/1Pt2g8TAX_SGgBGUi0tGOYEga5W-xXEW6aGXHw.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset164.webm",
    animation: "captionAnimationKeyword59",
    preservedColorKeyWord: true
  },

  //Betelgeuse
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "JuliusSansOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/juliussansone/v9/1Pt2g8TAX_SGgBGUi0tGOYEga5W-xXEW6aGXHw.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset165.webm",
    textTransform: "uppercase"
  },

  //Acrab

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset166.webm",
    boxShadow: { color: "#000000", x: 2, y: 2, blur: 10 },
    animation: "captionAnimationKeyword60"
  },

  //Andromeda

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset167.webm",
    textTransform: "uppercase"
  },

  //Cassiopeia
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#c2c2c2",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "CabinCondensed-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/cabincondensed/v14/nwpMtK6mNhBK2err_hqkYhHRqmwaYOjZ5HZl8Q.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset168.webm",
    textAlign: "left",
    animation: "captionAnimationKeyword61",
    preservedColorKeyWord: true
  },

  //M81
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SecularOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/secularone/v5/8QINdiTajsj_87rMuMdKypDlMul7LJpK.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset169.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    textAlign: "left",
    textTransform: "uppercase",
    animation: "captionAnimationKeyword62",
    preservedColorKeyWord: true
  },

  //Polaris
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset170.webm"
  },

  //Kang
  {
    appearedColor: "#ffffff",
    activeColor: "#fcfd00",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset171.webm",
    boxShadow: { color: "#000000", x: 4, y: 4, blur: 25 },
    textAlign: "left",
    animation: "captionAnimationKeyword63",
    preservedColorKeyWord: true
  },

  //Irena: review
  {
    appearedColor: "#ffffff",
    activeColor: "#05fe00",
    activeFillColor: "transparent",
    isKeywordColor: "#ffef10",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset172.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword64",
    preservedColorKeyWord: true
  },

  //Helix
  {
    type: "word",
    appearedColor: "#fcf400",
    activeColor: "#fcf400",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 8,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset173.webm",
    boxShadow: { color: "#000000", x: -4, y: 4, blur: 10 },
    animation: "captionAnimationKeyword65",
    preservedColorKeyWord: true
  },

  //Electra
  {
    appearedColor: "#ffffff",
    activeColor: "#54ff1d",
    activeFillColor: "transparent",
    isKeywordColor: "#fff207",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset174.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 60 },
    animation: "captionAnimationKeyword66",
    preservedColorKeyWord: true
  },

  //Owl
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 8,
    fontFamily: "Changa-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/changa/v14/2-c79JNi2YuVOUcOarRPgnNGooxCZ0q2QjDp9htf1ZM.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset175.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 40 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword67",
    preservedColorKeyWord: true
  },

  //Haedus

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 3,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset176.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword68",
    preservedColorKeyWord: true
  },

  //Gienah

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Montserrat-ExtraBold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_c5H7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset177.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword69",
    preservedColorKeyWord: true
  },

  //Footprint
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset178.webm",
    boxShadow: { color: "#000000", x: 0, y: 1, blur: 5 },
    animation: "captionAnimationKeyword70",
    preservedColorKeyWord: true
  },

  //Pop

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#00d870",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "Bungee-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/bungee/v6/N0bU2SZBIuF2PU_ECn50Kd_PmA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset179.webm",
    boxShadow: { color: "#000000", x: 3, y: 3, blur: 25 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword71",
    preservedColorKeyWord: true
  },

  //Shift

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "Changa-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/changa/v14/2-c79JNi2YuVOUcOarRPgnNGooxCZ0q2QjDp9htf1ZM.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset180.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 25 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword72",
    preservedColorKeyWord: true
  },

  //Acamar
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset181.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    animation: "captionAnimationKeyword73"
  },

  //Castor
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#01c7fc",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset182.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    animation: "captionAnimationKeyword74",
    preservedColorKeyWord: true
  },

  //Alcyone

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset183.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    animation: "captionAnimationKeyword75"
  },

  //HiLite

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset184.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword76",
    preservedColorKeyWord: true
  },

  //Orion

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset185.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword77",
    preservedColorKeyWord: true
  },

  //Thuban

  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "#fcfd00",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset186.webm",
    animation: "captionAnimationKeyword78"
  },

  //Comic
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    isKeywordColor: "#32c759",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset187.webm",
    textAlign: "left",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword79"
  },

  //Altair
  {
    appearedColor: "#000000",
    activeColor: "#000000",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset188.webm",
    boxShadow: { color: "#000000", x: -4, y: 4, blur: 20 },
    animation: "captionAnimationKeyword80"
  },

  //Lines

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ffcc02",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-SemiBold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset189.webm",
    textTransform: "uppercase",
    textAlign: "left",
    animation: "captionAnimationKeyword81",
    preservedColorKeyWord: true
  },

  //Lobster

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ffcc02",
    color: "#ffffff",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Lobster-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9_oWsMqEzSJQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset190.webm",
    textAlign: "left",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword82"
  },

  //Box

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-SemiBold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset191.webm",
    animation: "captionAnimationKeyword83",
    preservedColorKeyWord: true
  },

  //Sharp

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "RobotoCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/robotocondensed/v19/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCMSbvtdYyQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset192.webm",
    textAlign: "left",
    animation: "captionAnimationKeyword84",
    preservedColorKeyWord: true
  },

  //Cygnus A

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset193.webm",
    animation: "captionAnimationKeyword85",
    preservedColorKeyWord: true
  },

  //Pacific

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#00d870",
    color: "transparent",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Pacifico-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/pacifico/v17/FwZY7-Qmy14u9lezJ96A4sijpFu_.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset194.webm",
    textAlign: "left",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword86",
    preservedColorKeyWord: true
  },

  //Pacific

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SecularOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/secularone/v5/8QINdiTajsj_87rMuMdKypDlMul7LJpK.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset195.webm",
    boxShadow: { color: "#0e2beb", x: 0, y: 0, blur: 10 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword87"
  },

  //Block

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-SemiBold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset196.webm",
    animation: "captionAnimationKeyword88",
    preservedColorKeyWord: true
  },

  //Bold

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "#7e12ff",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset197.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword89",
    preservedColorKeyWord: true
  },

  //Mizar

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#7e12ff",
    borderWidth: 8,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset198.webm",
    boxShadow: { color: "#7e12ff", x: 0, y: 0, blur: 50 },
    animation: "captionAnimationKeyword90"
  },

  //Pollux

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset199.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textAlign: "left",
    animation: "captionAnimationKeyword91",
    preservedColorKeyWord: true
  },

  //Pollux

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 2,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset200.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textAlign: "left",
    animation: "captionAnimationKeyword92",
    preservedColorKeyWord: true
  },

  //Classic

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#6c4df7",
    isKeywordColor: "#ffcc02",
    color: "#ffffff",
    backgroundColor: "#41434a",
    borderColor: "#000000",
    borderWidth: 2,
    fontFamily: "SigmarOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset201.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 30 },
    textAlign: "left",
    animation: "captionAnimationKeyword93",
    preservedColorKeyWord: true
  },

  //Capital
  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Staatliches-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/staatliches/v6/HI_OiY8KO6hCsQSoAPmtMbectJG9O9PS.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset202.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textAlign: "left",
    animation: "captionAnimationKeyword94",
    preservedColorKeyWord: true
  },

  //Monster
  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#75fb4c",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset203.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword95"
  },

  //Alhena

  {
    type: "word",
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#7e12ff",
    color: "#ffffff",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "Montserrat-ExtraBold",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_c5H7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset204.webm",
    boxShadow: { color: "#000000", x: -4, y: 4, blur: 20 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword96",
    preservedColorKeyWord: true
  },

  //Play

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "PlayfairDisplay-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/playfairdisplay/v25/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQZNLo_U2r.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset205.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 50 },
    textTransform: "uppercase",
    textAlign: "left",
    animation: "captionAnimationKeyword97"
  },

  //Milky Way

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#7e12ff",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 4,
    fontFamily: "RobotoCondensed-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/robotocondensed/v19/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCMSbvtdYyQ.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset206.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 20 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword98",
    preservedColorKeyWord: true
  },

  //Buzz

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ea3330",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "Rubik-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/rubik/v14/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-ro-1UE80V4bVkA.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset207.webm",
    boxShadow: { color: "#474747", x: 0, y: 0, blur: 100 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword99",
    preservedColorKeyWord: true
  },

  //Buzz

  {
    appearedColor: "#ffffff",
    activeColor: "#cdbffe",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Inter-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/inter/v7/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset208.webm",
    boxShadow: { color: "#474747", x: 0, y: 0, blur: 10 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword100"
  },

  //Medusa

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#50ff12",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset209.webm",
    boxShadow: { color: "#000000", x: -4, y: -4, blur: 25 },
    animation: "captionAnimationKeyword101",
    preservedColorKeyWord: true
  },

  //Energy

  {
    appearedColor: "#39373a",
    activeColor: "#000000",
    activeFillColor: "transparent",
    color: "#39373a",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "Poppins-Bold",
    fontUrl:
      "https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset210.webm",
    boxShadow: { color: "#474747", x: 0, y: 0, blur: 100 },
    animation: "captionAnimationKeyword102"
  },

  //Hustle

  {
    appearedColor: "#ffffff",
    activeColor: "#ff5446",
    activeFillColor: "transparent",
    isKeywordColor: "#f2ed6b",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "Montserrat-Black",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_epG7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset211.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 15 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword103",
    preservedColorKeyWord: true
  },

  //Focus

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "#000000",
    isKeywordColor: "#ffcc02",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 0,
    fontFamily: "SigmarOne-Regular", // "font Avenir Next"
    fontUrl:
      "https://fonts.gstatic.com/s/sigmarone/v11/co3DmWZ8kjZuErj9Ta3dk6Pjp3Di8U0.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset212.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 8 },
    textTransform: "uppercase",
    animation: "captionAnimationKeyword104",
    preservedColorKeyWord: true
  },

  //Million

  {
    appearedColor: "#b9b1b1",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    isKeywordColor: "#ffffff",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    fontFamily: "Montserrat-Light",
    fontUrl:
      "https://fonts.gstatic.com/s/montserrat/v18/JTURjIg1_i6t8kCHKm45_cJD7g7J_950vCo.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset213.webm",
    boxShadow: { color: "#474747", x: 0, y: 0, blur: 10 },
    animation: "captionAnimationKeyword105",
    preservedColorKeyWord: true
  },

  //cove

  {
    appearedColor: "#ffffff",
    activeColor: "#ffffff",
    activeFillColor: "transparent",
    color: "transparent",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 10,
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset214.webm",
    boxShadow: { color: "#000000", x: 0, y: 0, blur: 10 },
    animation: "captionAnimationKeyword106"
  },
  {
    appearedColor: "#14edf8",
    activeColor: "#14edf8",
    activeFillColor: "transparent",
    color: "#14edf8",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "FrancoisOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/francoisone/v15/_Xmr-H4zszafZw3A-KPSZutNxgKQu_avAg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset215.webm",
    animation: "customAnimation1"
  },
  {
    appearedColor: "##fbfe3c",
    activeColor: "##fbfe3c",
    activeFillColor: "transparent",
    color: "#fbfe3c",
    isKeywordColor: "#20f80a",
    backgroundColor: "transparent",
    borderColor: "#000000",
    borderWidth: 5,
    fontFamily: "FrancoisOne-Regular",
    fontUrl:
      "https://fonts.gstatic.com/s/francoisone/v15/_Xmr-H4zszafZw3A-KPSZutNxgKQu_avAg.ttf",
    previewUrl:
      "https://cdn.designcombo.dev/caption_previews/dynamic-preset216.webm",
    animation: "customAnimation1"
  }
];

export const getTextShadow = (boxShadow?: IBoxShadow): string | undefined => {
  if (!boxShadow) return undefined;
  return `${boxShadow.x / 8}px ${boxShadow.y / 8}px ${boxShadow.blur / 8}px ${
    boxShadow.color
  }`;
};
export const applyPreset = async (
  preset: any,
  captionItemIds: string[],
  captionsData: any[]
) => {
  if (preset.boxShadow === undefined) {
    preset.boxShadow = { color: "transparent", x: 0, y: 0, blur: 0 };
  }
  if (preset.animation === undefined) {
    preset.animation = "";
  }
  if (preset.fontFamily === undefined) {
    preset.fontFamily = "Bangers-Regular";
  }
  if (preset.fontUrl === undefined) {
    preset.fontUrl =
      "https://fonts.gstatic.com/s/bangers/v13/FeVQS0BTqb0h60ACL5la2bxii28.ttf";
  }
  if (preset.textTransform === undefined) {
    preset.textTransform = "none";
  }
  if (preset.textAlign === undefined) {
    preset.textAlign = "center";
  }
  if (preset.isKeywordColor === undefined) {
    preset.isKeywordColor = "transparent";
  }

  if (preset.preservedColorKeyWord === undefined) {
    preset.preservedColorKeyWord = false;
  }

  let newData = transformCaptions(
    captionsData,
    preset.type === "word" ? "singleWord" : "time"
  );

  await loadFonts([
    {
      name: preset.fontFamily,
      url: preset.fontUrl
    }
  ]);

  const { previewUrl, type, ...sanitizedPreset } = preset;
  dispatch(LAYER_DELETE, {
    payload: {
      trackItemIds: captionsData.map((item) => item.id)
    }
  });

  dispatch(ADD_ITEMS, {
    payload: {
      trackItems: newData.map((item) => ({
        ...item,
        details: {
          ...item.details,
          ...sanitizedPreset
        }
      })),
      tracks: [
        {
          id: generateId(),
          items: newData.map((item) => item.id),
          type: "caption"
        }
      ]
    }
  });
};

export const groupCaptionItems = (trackItemsMap: ITrackItemsMap) => {
  const captionTrackItems = Object.values(trackItemsMap).filter(
    ({ type }: ITrackItem) => type === "caption"
  );
  return groupBy(captionTrackItems, "metadata.sourceUrl");
};
export default function CaptionPresetPicker({
  trackItem
}: {
  trackItem: ITrackItem & any;
}) {
  const { trackItemsMap } = useStore();
  const [captionItemIds, setCaptionItemIds] = useState<string[]>([]);
  const [captionsData, setCaptionsData] = useState<any[]>([]);
  const { setFloatingControl } = useLayoutStore();
  const floatingRef = useRef<HTMLDivElement>(null);
  useClickOutside(floatingRef as React.RefObject<HTMLElement>, () =>
    setFloatingControl("")
  );
  useEffect(() => {
    const groupedCaptions = groupCaptionItems(trackItemsMap);

    const currentGroupItems = groupedCaptions[trackItem.metadata.sourceUrl];
    const captionItemIds = currentGroupItems?.map((item) => item.id);
    setCaptionItemIds(captionItemIds);
    setCaptionsData(currentGroupItems);
  }, [trackItemsMap, trackItem]);

  const handlePresetClick = (
    preset: any,
    captionItemIds: string[],
    captionsData: any[]
  ) => {
    applyPreset(preset, captionItemIds, captionsData);
  };

  return (
    <div
      ref={floatingRef}
      className="absolute right-2 top-2 z-[200] w-56 border bg-sidebar p-0"
    >
      <div className="handle flex cursor-grab items-center justify-between px-4 py-3">
        <p className="text-sm font-bold">Presets</p>
        <div className="h-4 w-4" onClick={() => setFloatingControl("")}>
          <XIcon className="h-3 w-3 cursor-pointer font-extrabold text-muted-foreground" />
        </div>
      </div>

      <PresetPicker
        captionItemIds={captionItemIds}
        captionsData={captionsData}
        onPresetClick={handlePresetClick}
      />
    </div>
  );
}
