import { useIsSmallScreen } from "../../../hooks/use-media-query";
import {
	TIMELINE_OFFSET_X_SMALL,
	TIMELINE_OFFSET_X_LARGE,
} from "../constants/constants";

export function useTimelineOffsetX(): number {
	const isSmallScreen = useIsSmallScreen();
	return isSmallScreen ? TIMELINE_OFFSET_X_SMALL : TIMELINE_OFFSET_X_LARGE;
}
