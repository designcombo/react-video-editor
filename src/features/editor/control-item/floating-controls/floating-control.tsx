import useLayoutStore from "../../store/use-layout-store";
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
	return null;
}
