import { ScrollArea } from "@/components/ui/scroll-area";
import { dispatch } from "@designcombo/events";
import { generateId } from "@designcombo/timeline";
import Draggable from "@/components/shared/draggable";
import { IImage } from "@designcombo/types";
import React, { useState, useEffect } from "react";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import { ADD_ITEMS } from "@designcombo/state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { usePexelsImages } from "@/hooks/use-pexels-images";
import { ImageLoading } from "@/components/ui/image-loading";

export const Images = () => {
	const isDraggingOverTimeline = useIsDraggingOverTimeline();
	const [searchQuery, setSearchQuery] = useState("");

	const {
		images: pexelsImages,
		loading: pexelsLoading,
		error: pexelsError,
		currentPage,
		hasNextPage,
		searchImages,
		loadCuratedImages,
		searchImagesAppend,
		loadCuratedImagesAppend,
		clearImages,
	} = usePexelsImages();

	// Load curated images on component mount
	useEffect(() => {
		loadCuratedImages();
	}, [loadCuratedImages]);

	const handleAddImage = (payload: Partial<IImage>) => {
		const id = generateId();
		dispatch(ADD_ITEMS, {
			payload: {
				trackItems: [
					{
						id,
						type: "image",
						display: {
							from: 0,
							to: 5000,
						},
						details: {
							src: payload.details?.src,
						},
						metadata: {},
					},
				],
			},
		});
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			await loadCuratedImages();
			return;
		}

		try {
			await searchImages(searchQuery);
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
				searchImagesAppend(searchQuery, currentPage + 1);
			} else {
				loadCuratedImagesAppend(currentPage + 1);
			}
		}
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		clearImages();
		loadCuratedImages();
	};

	// Use Pexels images if available, otherwise fall back to static images
	const displayImages = pexelsImages;

	return (
		<div className="flex flex-1 flex-col">
			<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
				Photos
			</div>
			<div className="flex items-center gap-2 px-4 pb-4">
				<div className="relative flex-1">
					<Input
						placeholder="Search Pexels images..."
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
					{displayImages.map((image, index) => {
						return (
							<ImageItem
								key={image.id || index}
								image={image}
								shouldDisplayPreview={!isDraggingOverTimeline}
								handleAddImage={handleAddImage}
							/>
						);
					})}
				</div>
				{pexelsLoading && <ImageLoading message="Searching for images..." />}
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

const ImageItem = ({
	handleAddImage,
	image,
	shouldDisplayPreview,
}: {
	handleAddImage: (payload: Partial<IImage>) => void;
	image: Partial<IImage>;
	shouldDisplayPreview: boolean;
}) => {
	const style = React.useMemo(
		() => ({
			backgroundImage: `url(${image.preview})`,
			backgroundSize: "cover",
			width: "80px",
			height: "80px",
		}),
		[image.preview],
	);

	return (
		<Draggable
			data={image}
			renderCustomPreview={<div style={style} />}
			shouldDisplayPreview={shouldDisplayPreview}
		>
			<div
				onClick={() =>
					handleAddImage({
						id: generateId(),
						details: {
							src: image.details?.src,
						},
					} as IImage)
				}
				className="flex w-full items-center justify-center overflow-hidden bg-background pb-2 cursor-pointer"
			>
				<img
					draggable={false}
					src={image.preview}
					className="h-full w-full rounded-md object-cover"
					alt="Visual content"
				/>
			</div>
		</Draggable>
	);
};
