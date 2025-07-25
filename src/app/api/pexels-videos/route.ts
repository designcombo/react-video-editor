import { NextRequest, NextResponse } from "next/server";

const PEXELS_API_BASE_URL = "https://api.pexels.com/videos";

interface PexelsVideo {
	id: number;
	width: number;
	height: number;
	url: string;
	image: string;
	duration: number;
	user: {
		id: number;
		name: string;
		url: string;
	};
	video_files: Array<{
		id: number;
		quality: string;
		file_type: string;
		width: number;
		height: number;
		fps: number;
		link: string;
	}>;
	video_pictures: Array<{
		id: number;
		picture: string;
		nr: number;
	}>;
}

interface PexelsVideoSearchResponse {
	total_results: number;
	page: number;
	per_page: number;
	videos: PexelsVideo[];
	next_page?: string;
	prev_page?: string;
}

interface PexelsVideoPopularResponse {
	page: number;
	per_page: number;
	videos: PexelsVideo[];
	next_page?: string;
	prev_page?: string;
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");
	const page = searchParams.get("page") || "1";
	const perPage = searchParams.get("per_page") || "15"; // Fewer videos per page due to larger file sizes

	const apiKey = process.env.PEXELS_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: "Pexels API key not configured" },
			{ status: 500 },
		);
	}

	try {
		let url: string;

		if (query) {
			// Search for specific videos
			url = `${PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
		} else {
			// Get popular videos
			url = `${PEXELS_API_BASE_URL}/popular?page=${page}&per_page=${perPage}`;
		}

		const response = await fetch(url, {
			headers: {
				Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Pexels API error: ${response.status}`);
		}

		const data: PexelsVideoSearchResponse | PexelsVideoPopularResponse =
			await response.json();

		// Transform the data to match the expected format for the video editor
		const transformedVideos = data.videos.map((video) => {
			// Find the best quality video file (prefer HD or SD)
			const videoFile =
				video.video_files.find(
					(file) => file.quality === "hd" || file.quality === "sd",
				) || video.video_files[0];

			// Get the first video picture as preview
			const previewPicture = video.video_pictures[0]?.picture || video.image;

			return {
				id: `pexels_video_${video.id}`,
				details: {
					src: videoFile?.link || "",
					width: video.width,
					height: video.height,
					duration: video.duration,
					fps: videoFile?.fps || 30,
				},
				preview: previewPicture,
				type: "video" as const,
				metadata: {
					pexels_id: video.id,
					user: video.user,
					video_files: video.video_files,
					video_pictures: video.video_pictures,
				},
			};
		});

		return NextResponse.json({
			videos: transformedVideos,
			total_results: "total_results" in data ? data.total_results : 0,
			page: data.page,
			per_page: data.per_page,
			next_page: data.next_page,
			prev_page: data.prev_page,
		});
	} catch (error) {
		console.error("Pexels Video API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch videos from Pexels" },
			{ status: 500 },
		);
	}
}
