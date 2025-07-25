import { IVideo } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { calculateMediaStyles } from "../styles";
import { OffthreadVideo } from "remotion";

export const Video = ({
	item,
	options,
}: {
	item: IVideo;
	options: SequenceItemOptions;
}) => {
	const { fps } = options;
	const { details, animations } = item;
	const playbackRate = item.playbackRate || 1;
	const crop = details?.crop || {
		x: 0,
		y: 0,
		width: details.width,
		height: details.height,
	};

	const children = (
		<div style={calculateMediaStyles(details, crop)}>
			<OffthreadVideo
				startFrom={(item.trim?.from! / 1000) * fps}
				endAt={(item.trim?.to! / 1000) * fps || 1 / fps}
				playbackRate={playbackRate}
				src={details.src}
				volume={details.volume || 0 / 100}
			/>
		</div>
	);

	return BaseSequence({ item, options, children });
};

export default Video;
