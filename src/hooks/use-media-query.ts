import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);

		// Set initial value
		setMatches(media.matches);

		// Create event listener
		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Add listener
		media.addEventListener("change", listener);

		// Cleanup
		return () => media.removeEventListener("change", listener);
	}, [query]);

	return matches;
}

// Predefined breakpoint hooks
export function useIsLargeScreen(): boolean {
	return useMediaQuery("(min-width: 1024px)");
}

export function useIsMediumScreen(): boolean {
	return useMediaQuery("(min-width: 768px)");
}

export function useIsSmallScreen(): boolean {
	return useMediaQuery("(max-width: 767px)");
}
