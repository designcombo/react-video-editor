import { useState, useCallback } from "react";
import { IVideo } from "@designcombo/types";

interface PexelsVideo extends Partial<IVideo> {
	metadata?: {
		pexels_id: number;
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
	};
}

interface PexelsVideoResponse {
	videos: PexelsVideo[];
	total_results: number;
	page: number;
	per_page: number;
	next_page?: string;
	prev_page?: string;
}

interface UsePexelsVideosReturn {
	videos: PexelsVideo[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchVideos: (query: string, page?: number) => Promise<void>;
	loadPopularVideos: (page?: number) => Promise<void>;
	searchVideosAppend: (query: string, page?: number) => Promise<void>;
	loadPopularVideosAppend: (page?: number) => Promise<void>;
	clearVideos: () => void;
	refreshPopularVideos: (page?: number) => Promise<void>;
}

// Cache for popular videos to avoid unnecessary API calls
interface PopularVideosCache {
	data: PexelsVideoResponse | null;
	timestamp: number;
	page: number;
}

const popularVideosCache: PopularVideosCache = {
	data: null,
	timestamp: 0,
	page: 1,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Function to clear the cache
const clearPopularVideosCache = () => {
	popularVideosCache.data = null;
	popularVideosCache.timestamp = 0;
	popularVideosCache.page = 1;
};

/**
 * Hook for fetching and managing Pexels videos with caching support.
 *
 * Features:
 * - Caches popular videos for 5 minutes to avoid unnecessary API calls
 * - Supports search functionality with real-time results
 * - Provides pagination for browsing large result sets
 * - Includes error handling and loading states
 *
 * Cache Behavior:
 * - Popular videos are cached for 5 minutes
 * - Cache is automatically cleared when calling clearVideos()
 * - Manual cache refresh available via refreshPopularVideos()
 * - Cache is page-specific (different pages have separate cache entries)
 */
export function usePexelsVideos(): UsePexelsVideosReturn {
	const [videos, setVideos] = useState<PexelsVideo[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalResults, setTotalResults] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [hasPrevPage, setHasPrevPage] = useState(false);

	const fetchVideos = useCallback(async (url: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: PexelsVideoResponse = await response.json();

			setVideos(data.videos);
			setTotalResults(data.total_results);
			setCurrentPage(data.page);
			setHasNextPage(!!data.next_page);
			setHasPrevPage(!!data.prev_page);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch videos");
			setVideos([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const searchVideos = useCallback(
		async (query: string, page = 1) => {
			const url = `/api/pexels-videos?query=${encodeURIComponent(query)}&page=${page}&per_page=15`;
			await fetchVideos(url);
		},
		[fetchVideos],
	);

	const searchVideosAppend = useCallback(async (query: string, page = 1) => {
		setLoading(true);
		setError(null);

		try {
			const url = `/api/pexels-videos?query=${encodeURIComponent(query)}&page=${page}&per_page=15`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: PexelsVideoResponse = await response.json();

			setVideos((prevVideos) => [...prevVideos, ...data.videos]);
			setTotalResults(data.total_results);
			setCurrentPage(data.page);
			setHasNextPage(!!data.next_page);
			setHasPrevPage(!!data.prev_page);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch videos");
		} finally {
			setLoading(false);
		}
	}, []);

	const loadPopularVideos = useCallback(async (page = 1) => {
		// Check if we have cached data for this page and it's still valid
		const now = Date.now();
		const isCacheValid =
			popularVideosCache.data &&
			popularVideosCache.page === page &&
			now - popularVideosCache.timestamp < CACHE_DURATION;

		if (isCacheValid && popularVideosCache.data) {
			// Use cached data
			const data = popularVideosCache.data;
			setVideos(data.videos);
			setTotalResults(data.total_results);
			setCurrentPage(data.page);
			setHasNextPage(!!data.next_page);
			setHasPrevPage(!!data.prev_page);
			setError(null);
			return;
		}

		// Fetch fresh data
		const url = `/api/pexels-videos?page=${page}&per_page=15`;
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: PexelsVideoResponse = await response.json();

			// Cache the data
			popularVideosCache.data = data;
			popularVideosCache.timestamp = now;
			popularVideosCache.page = page;

			setVideos(data.videos);
			setTotalResults(data.total_results);
			setCurrentPage(data.page);
			setHasNextPage(!!data.next_page);
			setHasPrevPage(!!data.prev_page);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch videos");
			setVideos([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadPopularVideosAppend = useCallback(async (page = 1) => {
		setLoading(true);
		setError(null);

		try {
			const url = `/api/pexels-videos?page=${page}&per_page=15`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: PexelsVideoResponse = await response.json();

			setVideos((prevVideos) => [...prevVideos, ...data.videos]);
			setTotalResults(data.total_results);
			setCurrentPage(data.page);
			setHasNextPage(!!data.next_page);
			setHasPrevPage(!!data.prev_page);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch videos");
		} finally {
			setLoading(false);
		}
	}, []);

	const clearVideos = useCallback(() => {
		setVideos([]);
		setError(null);
		setTotalResults(0);
		setCurrentPage(1);
		setHasNextPage(false);
		setHasPrevPage(false);
		// Also clear the cache when clearing videos
		clearPopularVideosCache();
	}, []);

	const refreshPopularVideos = useCallback(
		async (page = 1) => {
			// Clear cache and fetch fresh data
			clearPopularVideosCache();
			await loadPopularVideos(page);
		},
		[loadPopularVideos],
	);

	return {
		videos,
		loading,
		error,
		totalResults,
		currentPage,
		hasNextPage,
		hasPrevPage,
		searchVideos,
		loadPopularVideos,
		searchVideosAppend,
		loadPopularVideosAppend,
		clearVideos,
		refreshPopularVideos,
	};
}
