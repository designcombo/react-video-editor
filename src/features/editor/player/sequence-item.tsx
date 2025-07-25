import React from "react";
import { IAudio, IImage, ITrackItem, IText, IVideo } from "@designcombo/types";
import { Audio, Image, Text, Video } from "./items";
import { SequenceItemOptions } from "./base-sequence";

export const SequenceItem: Record<
	string,
	(item: ITrackItem, options: SequenceItemOptions) => React.JSX.Element
> = {
	text: (item, options) => Text({ item: item as IText, options }),
	video: (item, options) => Video({ item: item as IVideo, options }),
	audio: (item, options) => Audio({ item: item as IAudio, options }),
	image: (item, options) => Image({ item: item as IImage, options }),
};
