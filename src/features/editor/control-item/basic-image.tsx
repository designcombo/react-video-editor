import { ScrollArea } from "@/components/ui/scroll-area";
import { IBoxShadow, IImage, ITrackItem } from "@designcombo/types";
import Outline from "./common/outline";
import Shadow from "./common/shadow";
import Opacity from "./common/opacity";
import Rounded from "./common/radius";
import AspectRatio from "./common/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Crop } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dispatch } from "@designcombo/events";
import { EDIT_OBJECT } from "@designcombo/state";
import Blur from "./common/blur";
import Brightness from "./common/brightness";
import useLayoutStore from "../store/use-layout-store";
import { Label } from "@/components/ui/label";

const BasicImage = ({
	trackItem,
	type,
}: {
	trackItem: ITrackItem & IImage;
	type?: string;
}) => {
	const showAll = !type;
	const [properties, setProperties] = useState(trackItem);
	const { setCropTarget } = useLayoutStore();
	useEffect(() => {
		setProperties(trackItem);
	}, [trackItem]);

	const onChangeBorderWidth = (v: number) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						borderWidth: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					borderWidth: v,
				},
			};
		});
	};

	const onChangeBorderColor = (v: string) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						borderColor: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					borderColor: v,
				},
			};
		});
	};

	const handleChangeOpacity = (v: number) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						opacity: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					opacity: v,
				},
			};
		});
	};

	const onChangeBlur = (v: number) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						blur: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					blur: v,
				},
			};
		});
	};
	const onChangeBrightness = (v: number) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						brightness: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					brightness: v,
				},
			};
		});
	};

	const onChangeBorderRadius = (v: number) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						borderRadius: v,
					},
				},
			},
		});
		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					borderRadius: v,
				},
			};
		});
	};

	const onChangeBoxShadow = (boxShadow: IBoxShadow) => {
		dispatch(EDIT_OBJECT, {
			payload: {
				[trackItem.id]: {
					details: {
						boxShadow: boxShadow,
					},
				},
			},
		});

		setProperties((prev) => {
			return {
				...prev,
				details: {
					...prev.details,
					boxShadow,
				},
			};
		});
	};

	const components = [
		{
			key: "crop",
			component: (
				<div className="mb-4">
					<Button
						variant={"secondary"}
						size={"icon"}
						onClick={() => {
							setCropTarget(trackItem);
						}}
					>
						<Crop size={18} />
					</Button>
				</div>
			),
		},
		{
			key: "basic",
			component: (
				<div className="flex flex-col gap-2">
					<Label className="font-sans text-xs font-semibold">Basic</Label>

					<AspectRatio />
					<Rounded
						onChange={(v: number) => onChangeBorderRadius(v)}
						value={properties.details.borderRadius as number}
					/>
					<Opacity
						onChange={(v: number) => handleChangeOpacity(v)}
						value={properties.details.opacity ?? 100}
					/>

					<Blur
						onChange={(v: number) => onChangeBlur(v)}
						value={properties.details.blur ?? 0}
					/>
					<Brightness
						onChange={(v: number) => onChangeBrightness(v)}
						value={properties.details.brightness ?? 100}
					/>
				</div>
			),
		},

		{
			key: "outline",
			component: (
				<Outline
					label="Outline"
					onChageBorderWidth={(v: number) => onChangeBorderWidth(v)}
					onChangeBorderColor={(v: string) => onChangeBorderColor(v)}
					valueBorderWidth={properties.details.borderWidth as number}
					valueBorderColor={properties.details.borderColor as string}
				/>
			),
		},
		{
			key: "shadow",
			component: (
				<Shadow
					label="Shadow"
					onChange={(v: IBoxShadow) => onChangeBoxShadow(v)}
					value={
						properties.details.boxShadow ?? {
							color: "transparent",
							x: 0,
							y: 0,
							blur: 0,
						}
					}
				/>
			),
		},
	];
	return (
		<div className="flex flex-1 flex-col">
			<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
				Image
			</div>
			<ScrollArea className="h-full">
				<div className="flex flex-col gap-2 px-4 py-4">
					{components
						.filter((comp) => showAll || comp.key === type)
						.map((comp) => (
							<React.Fragment key={comp.key}>{comp.component}</React.Fragment>
						))}
				</div>
			</ScrollArea>
		</div>
	);
};

export default BasicImage;
