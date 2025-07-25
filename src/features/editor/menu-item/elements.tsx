import { Button, buttonVariants } from "@/components/ui/button";
import { HorizontalScroll } from "@/components/ui/horizontal-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dispatch } from "@designcombo/events";
import {
	ADD_LINEAL_AUDIO_BARS,
	ADD_RADIAL_AUDIO_BARS,
	ADD_WAVE_AUDIO_BARS,
	ADD_HILL_AUDIO_BARS,
} from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { useState } from "react";

type VisualizerItem = {
	label: string;
	onClick?: () => void;
};

type VisualizerGroup = {
	category: string;
	label: string;
	items: VisualizerItem[];
};
type ActiveAllState = {
	type: string | null;
	all: string | null;
};
interface ControlAllItemsProps {
	type: ActiveAllState;
	handleAllClick: (type: string | null, all: string | null) => void;
}
const TAGS = [
	{
		id: "stickers",
		name: "Stickers",
	},
	{
		id: "shapes",
		name: "Shapes",
	},
	{
		id: "visualizers",
		name: "Visualizers",
	},
];
const STICKERS_TAGS = [
	{
		id: "featured",
		name: "Featured",
	},
	{
		id: "emoji",
		name: "Emoji",
	},
	{
		id: "social",
		name: "Social",
	},
];

const VISUALIZERS_TAGS = [
	{
		id: "progress",
		name: "Progress",
	},
	{
		id: "soundWaves",
		name: "Sound Waves",
	},
];

const OPTIONS_LINEAL_BARS = [
	{
		label: "Lineal 1",
		id: "bar_1",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#F3B3DC",
			lineThickness: 5,
			gapSize: 7,
			roundness: 2,
		},
	},
	{
		label: "Lineal 2",
		id: "bar_2",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#CBAE9A",
			lineThickness: 7,
			gapSize: 6,
			roundness: 4,
		},
	},
	{
		label: "Lineal 3",
		id: "bar_3",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#A687DF",
			lineThickness: 2,
			gapSize: 4,
			roundness: 2,
		},
	},
	{
		label: "Lineal 4",
		id: "bar_4",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#8DD2DE",
			lineThickness: 6,
			gapSize: 7,
			roundness: 2,
			placement: "under",
		},
	},
	{
		label: "Lineal 5",
		id: "bar_5",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#EB6A65",
			lineThickness: 3,
			gapSize: 5,
			roundness: 2,
			placement: "under",
		},
	},
	{
		label: "Lineal 6",
		id: "bar_6",
		details: {
			height: 1920 / 20,
			width: 1080,
			linealBarColor: "#A9B6C9",
			lineThickness: 16,
			gapSize: 0,
			roundness: 0,
		},
	},
];

const OPTIONS_WAVE_BARS = [
	{
		label: "Wave 1",
		id: "wave_1",
		details: {
			height: 1920 / 20,
			width: 1080,
			offsetPixelSpeed: 100,
			lineColor: ["#EE8482", "teal"],
			lineGap: 70,
			topRoundness: 0.2,
			bottomRoundness: 0.4,
			sections: 10,
		},
	},
	{
		label: "Wave 2",
		id: "wave_2",
		details: {
			height: 1920 / 20,
			width: 1080,
			lineColor: "#EE8482",
			lines: 6,
			lineGap: 6,
			sections: 10,
			offsetPixelSpeed: -100,
		},
	},
];

const OPTIONS_HILL_BARS = [
	{
		label: "Hill 1",
		id: "hill_1",
		details: {
			height: 1920 / 20,
			width: 1080,
			fillColor: "#92E1B0",
		},
	},
	{
		label: "Hill 2",
		id: "hill_2",
		details: {
			height: 1920 / 20,
			width: 1080,
			fillColor: ["#559B59", "#466CF6", "#E54B41"],
			copies: 3,
			blendMode: "screen",
		},
	},
	{
		label: "Hill 3",
		id: "hill_3",
		details: {
			height: 1920 / 20,
			width: 1080,
			strokeColor: "#E9AB6C",
		},
	},
	{
		label: "Hill 4",
		id: "hill_4",
		details: {
			height: 1920 / 20,
			width: 1080,
			strokeColor: "rgb(100, 120, 250, 0.2)",
			strokeWidth: 2,
			fillColor: "rgb(70, 90, 200, 0.2)",
			copies: 5,
		},
	},
];

export const Elements = () => {
	const [selectedCategoryStickers, setSelectedCategoryStickers] = useState<
		string | null
	>(null);

	const [activeAll, setActiveAll] = useState<ActiveAllState | null>(null);

	const handleCategoryStickersClick = async (categoryId: string) => {
		setSelectedCategoryStickers(categoryId);
	};

	const handleAllClick = async (type: string | null, all: string | null) => {
		setActiveAll({ type, all });
	};
	return (
		<>
			{!activeAll?.type ? (
				<div className="flex flex-1 flex-col max-w-full">
					<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
						Elements
					</div>

					<ScrollArea className="flex-1 h-[calc(100%-98px)] max-w-full">
						<div className="flex flex-col space-y-4">
							<div className="px-4">
								<HorizontalScroll className="w-full" debug={false}>
									<div className="flex gap-2 pb-2 min-w-max">
										<Button
											type="button"
											className={cn(
												buttonVariants({
													variant: "default",
												}),
												"h-7 cursor-pointer",
											)}
										>
											All
										</Button>
										{TAGS.map((tag) => (
											<Button
												type="button"
												key={tag.id}
												onClick={() => handleAllClick(tag.id, "all")}
												variant={"outline"}
												size={"sm"}
												className="h-7 cursor-pointer"
											>
												{tag.name}
											</Button>
										))}
									</div>
								</HorizontalScroll>
							</div>

							<div className="flex flex-col">
								<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium justify-between">
									<div>Stickers</div>
									<div
										className="text-xs text-muted-foreground flex cursor-pointer"
										onClick={() => handleAllClick("stickers", "all")}
									>
										View all
										<ChevronRight className="ml-1 h-4 w-4" />
									</div>
								</div>

								<div className="px-4 flex gap-2">
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
								</div>
							</div>

							{/* section shapes */}
							<div className="flex flex-col">
								<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium justify-between">
									<div>Shapes</div>
									<div
										className="text-xs text-muted-foreground flex cursor-pointer"
										onClick={() => handleAllClick("shapes", "all")}
									>
										View all
										<ChevronRight className="ml-1 h-4 w-4" />
									</div>
								</div>
								<div className="px-4 flex gap-2">
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
								</div>
							</div>

							{/* section visualizers */}
							<div className="flex flex-col">
								<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium justify-between">
									<div>Visualizers</div>
									<div
										className="text-xs text-muted-foreground flex cursor-pointer"
										onClick={() => handleAllClick("visualizers", "all")}
									>
										View all
										<ChevronRight className="ml-1 h-4 w-4" />
									</div>
								</div>

								<div className="px-4 flex gap-2">
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
								</div>
							</div>

							{/* section visualizers */}
							<div className="flex flex-col">
								<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium justify-between">
									<div>Progress Bars</div>
									<div
										className="text-xs text-muted-foreground flex cursor-pointer"
										onClick={() => handleAllClick("visualizers", "all")}
									>
										View all
										<ChevronRight className="ml-1 h-4 w-4" />
									</div>
								</div>

								<div className="px-4 flex gap-2">
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
									<div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center" />
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>
			) : (
				<>
					<ControlAllItems type={activeAll} handleAllClick={handleAllClick} />
				</>
			)}
		</>
	);
};

const ControlAllItems: React.FC<ControlAllItemsProps> = ({
	type,
	handleAllClick,
}) => {
	return (
		<>
			{type?.type &&
				{
					visualizers: (
						<AllVisualizers handleAllClick={handleAllClick} type={type} />
					),
				}[type.type]}
		</>
	);
};

const AllVisualizers = ({
	handleAllClick,
	type,
}: {
	handleAllClick: (type: string | null, all: string | null) => void;
	type: ActiveAllState;
}) => {
	const [selectedCategoryVisualizers, setSelectedCategoryVisualizers] =
		useState<string | null>(null);
	const handleCategoryVisualizersClick = async (categoryId: string | null) => {
		setSelectedCategoryVisualizers(categoryId);
	};

	const handleAddLinealAudioBars = (details: any) => {
		dispatch(ADD_LINEAL_AUDIO_BARS, {
			payload: {
				id: generateId(),
				type: "linealAudioBars",
				details,
				display: {
					from: 0,
					to: 10000,
				},
			},
			options: {},
		});
	};
	const handleAddRadialAudioBars = () => {
		dispatch(ADD_RADIAL_AUDIO_BARS, {
			payload: {
				id: generateId(),
				type: "radialAudioBars",
				details: {
					height: 1080,
					width: 1080,
					linealBarColor: "#00a6ff",
				},
				display: {
					from: 0,
					to: 10000,
				},
			},
			options: {},
		});
	};

	const handleAddWaveAudioBars = (details: any) => {
		dispatch(ADD_WAVE_AUDIO_BARS, {
			payload: {
				id: generateId(),
				type: "waveAudioBars",
				details,
				display: {
					from: 0,
					to: 10000,
				},
			},
			options: {},
		});
	};

	const handleAddHillAudioBars = (details: any) => {
		dispatch(ADD_HILL_AUDIO_BARS, {
			payload: {
				id: generateId(),
				type: "hillAudioBars",
				details,
				display: {
					from: 0,
					to: 10000,
				},
			},
			options: {},
		});
	};

	const visualizerGroups: VisualizerGroup[] = [
		{
			category: "progress",
			label: "Progress Bars",
			items: [{ label: "progress" }, { label: "progress1" }],
		},
		{
			category: "soundWaves",
			label: "Sound Waves",
			items: [
				...OPTIONS_LINEAL_BARS.map((bar) => ({
					label: bar.label,
					onClick: () => handleAddLinealAudioBars(bar.details),
				})),
				{
					label: "Radial 1",
					onClick: () => handleAddRadialAudioBars(),
				},
				...OPTIONS_WAVE_BARS.map((bar) => ({
					label: bar.label,
					onClick: () => handleAddWaveAudioBars(bar.details),
				})),
				...OPTIONS_HILL_BARS.map((bar) => ({
					label: bar.label,
					onClick: () => handleAddHillAudioBars(bar.details),
				})),
			],
		},
	];

	const renderItems = (group: (typeof visualizerGroups)[0]) => (
		<div className="flex flex-wrap gap-4">
			{group.items.map((item, idx) => (
				<div
					key={idx}
					className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center cursor-pointer"
					onClick={item.onClick}
				>
					{item.label}
				</div>
			))}
		</div>
	);

	const getHeaderTitle = (typeAll: string) => {
		switch (typeAll) {
			case "progress":
				return "Progress Bars";
			case "soundWaves":
				return "Sound Waves";
			default:
				return "Visualizers";
		}
	};

	const selectedGroup =
		type.all !== "all"
			? visualizerGroups.find((group) => group.category === type.all)
			: null;
	return (
		<div className="flex flex-col gap-4 flex-1 max-w-full">
			<div
				className={`flex justify-between items-center px-4 ${
					type.all === "all" ? "" : "border-b"
				}`}
			>
				<div className="text-md text-text-primary flex h-12 items-center font-medium">
					<div
						className="flex gap-2 cursor-pointer hover:bg-accent rounded-full mr-1"
						onClick={() => handleAllClick(null, null)}
					>
						<ChevronLeft className="h-4 w-4" />
					</div>
					{getHeaderTitle(type.all || "")}
				</div>
			</div>

			{type.all === "all" && (
				<>
					<div className="px-4">
						<HorizontalScroll className="w-full" debug={false}>
							<div className="flex gap-2 pb-2 min-w-max">
								<button
									type="button"
									onClick={() => handleCategoryVisualizersClick(null)}
									className={cn(
										buttonVariants({
											variant:
												selectedCategoryVisualizers === null
													? "default"
													: "outline",
										}),
										"h-7 cursor-pointer",
									)}
								>
									All
								</button>
								{VISUALIZERS_TAGS.map((tag) => (
									<button
										type="button"
										key={tag.id}
										onClick={() => handleCategoryVisualizersClick(tag.id)}
										className={cn(
											buttonVariants({
												variant:
													selectedCategoryVisualizers === tag.id
														? "default"
														: "outline",
											}),
											"h-7 cursor-pointer",
										)}
									>
										{tag.name}
									</button>
								))}
							</div>
						</HorizontalScroll>
					</div>

					<Separator className="mb-4 mt-2" />
				</>
			)}
			<div className="px-4">
				{type.all === "all" ? (
					selectedCategoryVisualizers === null ? (
						<div className="flex flex-col gap-12">
							{visualizerGroups.map((group) => (
								<div key={group.category} className="flex flex-col gap-4">
									<div className="flex justify-between items-center">
										<div className="text-sm font-bold">{group.label}</div>
										<div
											className="text-xs text-muted-foreground flex cursor-pointer"
											onClick={() =>
												handleCategoryVisualizersClick(group.category)
											}
										>
											View all
											<ChevronRight className="ml-1 h-4 w-4" />
										</div>
									</div>
									{renderItems(group)}
								</div>
							))}
						</div>
					) : (
						renderItems(
							visualizerGroups.find(
								(group) => group.category === selectedCategoryVisualizers,
							)!,
						)
					)
				) : (
					selectedGroup && renderItems(selectedGroup)
				)}
			</div>
		</div>
	);
};
