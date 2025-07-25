import React, { useState, useEffect, useRef, ReactNode } from "react";

interface HorizontalScrollProps {
	children: ReactNode;
	className?: string;
	showShadows?: boolean;
	shadowColor?: string;
	shadowWidth?: number;
	debug?: boolean;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
	children,
	className = "",
	showShadows = true,
	shadowColor = "black",
	shadowWidth = 6,
	debug = false,
}) => {
	const [showLeftShadow, setShowLeftShadow] = useState(false);
	const [showRightShadow, setShowRightShadow] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const checkShadows = () => {
		if (!scrollRef.current) return;

		const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
		const shouldShowLeft = scrollLeft > 0;
		const shouldShowRight = scrollLeft < scrollWidth - clientWidth - 1;

		setShowLeftShadow(shouldShowLeft);
		setShowRightShadow(shouldShowRight);

		if (debug) {
			console.log("Scroll check:", {
				scrollLeft,
				scrollWidth,
				clientWidth,
				shouldShowLeft,
				shouldShowRight,
			});
		}
	};

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		checkShadows();
		element.addEventListener("scroll", checkShadows);
		window.addEventListener("resize", checkShadows);

		return () => {
			element.removeEventListener("scroll", checkShadows);
			window.removeEventListener("resize", checkShadows);
		};
	}, [debug]);

	const shadowClasses = {
		left: `absolute left-0 top-0 bottom-0 w-${shadowWidth} bg-gradient-to-r from-${shadowColor}/50 via-${shadowColor}/30 to-transparent pointer-events-none z-20`,
		right: `absolute right-0 top-0 bottom-0 w-${shadowWidth} bg-gradient-to-l from-${shadowColor}/50 via-${shadowColor}/30 to-transparent pointer-events-none z-20`,
	};

	return (
		<div className={`relative ${className}`}>
			{/* Debug indicator */}
			{debug && (
				<div className="absolute -top-6 left-0 text-xs text-red-400">
					Left: {showLeftShadow ? "ON" : "OFF"} | Right:{" "}
					{showRightShadow ? "ON" : "OFF"}
				</div>
			)}

			{/* Left shadow */}
			{showShadows && showLeftShadow && (
				<div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/50 via-black/30 to-transparent pointer-events-none z-20" />
			)}

			{/* Right shadow */}
			{showShadows && showRightShadow && (
				<div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/50 via-black/30 to-transparent pointer-events-none z-20" />
			)}

			{/* Scrollable content */}
			<div
				ref={scrollRef}
				className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{children}
			</div>
		</div>
	);
};
