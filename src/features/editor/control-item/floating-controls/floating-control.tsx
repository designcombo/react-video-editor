import useLayoutStore from "../../store/use-layout-store";
import AnimationCaption from "./animation-caption";
import AnimationPicker from "./animation-picker";
import CaptionPresetPicker from "./caption-preset-picker";
import FontFamilyPicker from "./font-family-picker";
import TextPresetPicker from "./text-preset-picker";

export default function FloatingControl() {
  const { floatingControl, trackItem } = useLayoutStore();

  if (!trackItem) return null;

  if (floatingControl === "font-family-picker") {
    return <FontFamilyPicker />;
  }
  if (floatingControl === "text-preset-picker") {
    return <TextPresetPicker trackItem={trackItem} />;
  }
  if (floatingControl === "animation-picker") {
    return (
      <AnimationPicker
        animationType={trackItem.type === "text" ? "text" : undefined}
      />
    );
  }
  if (floatingControl === "animation-caption") {
    return <AnimationCaption />;
  }
  if (floatingControl === "caption-preset-picker") {
    return <CaptionPresetPicker trackItem={trackItem} />;
  }
  return null;
}
