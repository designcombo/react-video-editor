import Draggable from "@/components/shared/draggable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { ADD_VIDEO } from "@designcombo/state";
import { generateId } from "@designcombo/timeline";
import { IVideo } from "@designcombo/types";
import React, { useState, useEffect } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, PlusIcon } from "lucide-react";
import { usePexelsVideos } from "@/hooks/use-pexels-videos";
import { ImageLoading } from "@/components/ui/image-loading";

export const Videos = () => {
	const isDraggingOverTimeline = useIsDraggingOverTimeline();
	const [searchQuery, setSearchQuery] = useState("");

	const {
		videos: pexelsVideos,
		loading: pexelsLoading,
		error: pexelsError,
		currentPage,
		hasNextPage,
		searchVideos,
		loadPopularVideos,
		searchVideosAppend,
		loadPopularVideosAppend,
		clearVideos,
	} = usePexelsVideos();

	// Load popular videos on component mount
	useEffect(() => {
		loadPopularVideos();
	}, [loadPopularVideos]);

	const handleAddVideo = (payload: Partial<IVideo>) => {
		dispatch(ADD_VIDEO, {
			payload,
			options: {
				resourceId: "main",
				scaleMode: "fit",
			},
		});
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			await loadPopularVideos();
			return;
		}

		try {
			await searchVideos(searchQuery);
		} finally {
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleLoadMore = () => {
		if (hasNextPage) {
			if (searchQuery.trim()) {
				searchVideosAppend(searchQuery, currentPage + 1);
			} else {
				loadPopularVideosAppend(currentPage + 1);
			}
		}
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		clearVideos();
		loadPopularVideos();
	};

	// Use Pexels videos if available, otherwise fall back to static videos
	const displayVideos = pexelsVideos;

	return (
		<div className="flex flex-1 flex-col">
			<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
				Videos
			</div>
			<div className="flex items-center gap-2 px-4 pb-4">
				<div className="relative flex-1">
					<Input
						placeholder="Search Pexels videos..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyPress={handleKeyPress}
						className="pr-10"
					/>
					<Button
						size="sm"
						variant="ghost"
						className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
						onClick={handleSearch}
						disabled={pexelsLoading}
					>
						{pexelsLoading ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<Search className="h-3 w-3" />
						)}
					</Button>
				</div>
				{searchQuery && (
					<Button
						size="sm"
						variant="outline"
						onClick={handleClearSearch}
						disabled={pexelsLoading}
					>
						Clear
					</Button>
				)}
			</div>

			{pexelsError && (
				<div className="px-4 pb-2">
					<div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
						{pexelsError}
					</div>
				</div>
			)}

			<ScrollArea className="flex-1 lg:max-h-[calc(100%-125px)] max-h-[500px]">
				<div className="masonry-sm px-4">
					{displayVideos.map((video, index) => {
						return (
							<VideoItem
								key={video.id || index}
								video={video}
								shouldDisplayPreview={!isDraggingOverTimeline}
								handleAddImage={handleAddVideo}
							/>
						);
					})}
				</div>
				{pexelsLoading && <ImageLoading message="Searching for videos..." />}
				{/* Pagination */}
				{hasNextPage && (
					<div className="flex items-center justify-center p-4">
						<Button
							size="sm"
							variant="outline"
							onClick={handleLoadMore}
							disabled={pexelsLoading}
						>
							{pexelsLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Loading...
								</>
							) : (
								"Load More"
							)}
						</Button>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

const VideoItem = ({
	handleAddImage,
	video,
	shouldDisplayPreview,
}: {
	handleAddImage: (payload: Partial<IVideo>) => void;
	video: Partial<IVideo>;
	shouldDisplayPreview: boolean;
}) => {
	const style = React.useMemo(
		() => ({
			backgroundImage: `url(${video.preview})`,
			backgroundSize: "cover",
			width: "80px",
			height: "80px",
		}),
		[video.preview],
	);

	return (
		<Draggable
			data={{
				...video,
				metadata: {
					previewUrl: video.preview,
				},
			}}
			renderCustomPreview={<div style={style} className="draggable" />}
			shouldDisplayPreview={shouldDisplayPreview}
		>
			<div
				onClick={() =>
					handleAddImage({
						id: generateId(),
						details: {
							src: video.details?.src,
						},
						metadata: {
							previewUrl: video.preview,
						},
					} as any)
				}
				className="relative flex w-full items-center justify-center overflow-hidden bg-background pb-2 group cursor-pointer"
			>
				<img
					draggable={false}
					src={video.preview}
					className="h-full w-full rounded-md object-cover"
					alt="Video preview"
				/>
				{/* Play button overlay */}
				<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
					<div className="rounded-full p-1">
						<PlusIcon className="h-6 w-6 fill-current" />
					</div>
				</div>
				{/* Duration badge */}
				{(video.details as any)?.duration && (
					<div className="absolute bottom-3 right-2 bg-black/90 text-primary/90 text-xs px-1 py-0.5 rounded">
						{Math.round((video.details as any).duration)}s
					</div>
				)}
			</div>
		</Draggable>
	);
};
