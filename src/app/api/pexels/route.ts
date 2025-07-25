import { NextRequest, NextResponse } from "next/server";

const PEXELS_API_BASE_URL = "https://api.pexels.com/v1";

interface PexelsPhoto {
	id: number;
	width: number;
	height: number;
	url: string;
	photographer: string;
	photographer_url: string;
	photographer_id: number;
	avg_color: string;
	src: {
		original: string;
		large2x: string;
		large: string;
		medium: string;
		small: string;
		portrait: string;
		landscape: string;
		tiny: string;
	};
	liked: boolean;
	alt: string;
}

interface PexelsSearchResponse {
	total_results: number;
	page: number;
	per_page: number;
	photos: PexelsPhoto[];
	next_page?: string;
	prev_page?: string;
}

interface PexelsCuratedResponse {
	page: number;
	per_page: number;
	photos: PexelsPhoto[];
	next_page?: string;
	prev_page?: string;
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");
	const page = searchParams.get("page") || "1";
	const perPage = searchParams.get("per_page") || "20";

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
			// Search for specific images
			url = `${PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
		} else {
			// Get curated images
			url = `${PEXELS_API_BASE_URL}/curated?page=${page}&per_page=${perPage}`;
		}

		const response = await fetch(url, {
			headers: {
				Authorization: apiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Pexels API error: ${response.status}`);
		}

		const data: PexelsSearchResponse | PexelsCuratedResponse =
			await response.json();

		// Transform the data to match the expected format for the video editor
		const transformedPhotos = data.photos.map((photo) => ({
			id: `pexels_${photo.id}`,
			details: {
				src: photo.src.large2x, // Use large2x for better quality
				width: photo.width,
				height: photo.height,
				photographer: photo.photographer,
				photographer_url: photo.photographer_url,
				alt: photo.alt,
			},
			preview: photo.src.medium, // Use medium for preview
			type: "image" as const,
			metadata: {
				pexels_id: photo.id,
				avg_color: photo.avg_color,
				original_url: photo.src.original,
			},
		}));

		return NextResponse.json({
			photos: transformedPhotos,
			total_results: "total_results" in data ? data.total_results : 0,
			page: data.page,
			per_page: data.per_page,
			next_page: data.next_page,
			prev_page: data.prev_page,
		});
	} catch (error) {
		console.error("Pexels API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch images from Pexels" },
			{ status: 500 },
		);
	}
}
