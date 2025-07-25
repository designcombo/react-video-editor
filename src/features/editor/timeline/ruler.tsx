import { useCallback, useEffect, useRef, useState } from "react";

import {
	PREVIEW_FRAME_WIDTH,
	SECONDARY_FONT,
	SMALL_FONT_SIZE,
	TIMELINE_OFFSET_CANVAS_LEFT,
} from "../constants/constants";
import { formatTimelineUnit } from "../utils/format";
import useStore from "../store/use-store";
import { debounce } from "lodash";
import { useTimelineOffsetX } from "../hooks/use-timeline-offset";

interface RulerProps {
	height?: number;
	longLineSize?: number;
	shortLineSize?: number;
	offsetX?: number;
	textOffsetY?: number;
	scrollLeft?: number;
	textFormat?: (scale: number) => string;
	onClick?: (units: number) => void;
	onScroll?: (scrollLeft: number) => void;
}

const Ruler = (props: RulerProps) => {
	const timelineOffsetX = useTimelineOffsetX();
	const {
		height = 40, // Increased height to give space for the text
		longLineSize = 8,
		shortLineSize = 10,
		offsetX = timelineOffsetX + TIMELINE_OFFSET_CANVAS_LEFT,
		textOffsetY = 17, // Place the text above the lines but inside the canvas
		textFormat = formatTimelineUnit,
		scrollLeft = 0,
		onClick,
		onScroll,
	} = props;
	const { scale } = useStore();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [canvasContext, setCanvasContext] =
		useState<CanvasRenderingContext2D | null>(null);
	const [canvasSize, setCanvasSize] = useState({
		width: 0,
		height: height, // Increased height for text space
	});

	// Drag state
	const [isDragging, setIsDragging] = useState(false);
	const [hasDragged, setHasDragged] = useState(false);
	const dragRef = useRef({
		startX: 0,
		startScrollPos: 0,
		isDragging: false,
		hasDragged: false,
	});

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const context = canvas.getContext("2d");
			setCanvasContext(context);
			resize(canvas, context, scrollLeft);
		}
	}, [timelineOffsetX]);

	const handleResize = useCallback(() => {
		resize(canvasRef.current, canvasContext, scrollLeft);
	}, [canvasContext, scrollLeft, timelineOffsetX]);

	useEffect(() => {
		const resizeHandler = debounce(handleResize, 200);
		window.addEventListener("resize", resizeHandler);

		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, [handleResize]);

	useEffect(() => {
		if (canvasContext) {
			resize(canvasRef.current, canvasContext, scrollLeft);
		}
	}, [canvasContext, scrollLeft, scale, timelineOffsetX]);

	const resize = (
		canvas: HTMLCanvasElement | null,
		context: CanvasRenderingContext2D | null,
		scrollLeft: number,
	) => {
		if (!canvas || !context) return;

		const offsetParent = canvas.offsetParent as HTMLDivElement;
		const width = offsetParent?.offsetWidth ?? canvas.offsetWidth;
		const height = canvasSize.height;

		canvas.width = width;
		canvas.height = height;

		draw(context, scrollLeft, width, height);
		setCanvasSize({ width, height });
	};

	const draw = (
		context: CanvasRenderingContext2D,
		scrollLeft: number,
		width: number,
		height: number,
	) => {
		const zoom = scale.zoom;
		const unit = scale.unit;
		const segments = scale.segments;
		context.clearRect(0, 0, width, height);
		context.save();
		context.strokeStyle = "#71717a";
		context.fillStyle = "#71717a";
		context.lineWidth = 1;
		context.font = `${SMALL_FONT_SIZE}px ${SECONDARY_FONT}`;
		context.textBaseline = "top";

		context.translate(0.5, 0);
		context.beginPath();

		const zoomUnit = unit * zoom * PREVIEW_FRAME_WIDTH;
		const minRange = Math.floor(scrollLeft / zoomUnit);
		const maxRange = Math.ceil((scrollLeft + width) / zoomUnit);
		const length = maxRange - minRange;

		// Draw text before drawing the lines
		for (let i = 0; i <= length; ++i) {
			const value = i + minRange;

			if (value < 0) continue;

			const startValue = (value * zoomUnit) / zoom;
			const startPos = (startValue - scrollLeft / zoom) * zoom;

			if (startPos < -zoomUnit || startPos >= width + zoomUnit) continue;
			const text = textFormat(startValue);

			// Calculate the textOffsetX value
			const textWidth = context.measureText(text).width;
			const textOffsetX = -textWidth / 2;

			// Adjust textOffsetY so it stays inside the canvas but above the lines
			context.fillText(text, startPos + textOffsetX + offsetX, textOffsetY);
		}

		// Draw long and short lines after the text
		for (let i = 0; i <= length; ++i) {
			const value = i + minRange;

			if (value < 0) continue;

			const startValue = value * zoomUnit;
			const startPos = startValue - scrollLeft + offsetX;

			for (let j = 0; j < segments; ++j) {
				const pos = startPos + (j / segments) * zoomUnit;

				if (pos < 0 || pos >= width) continue;

				const lineSize = j % segments ? shortLineSize : longLineSize;

				// Set color based on line size
				if (lineSize === shortLineSize) {
					context.strokeStyle = "#52525b"; // Yellow for short lines
				} else {
					context.strokeStyle = "#18181b"; // Red for long lines
				}

				const origin = 18; // Increase the origin to start lines lower, below the text

				const [x1, y1] = [pos, origin];
				const [x2, y2] = [x1, y1 + lineSize];

				context.beginPath(); // Begin a new path for each line
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);

				// Set color based on line size
				if (lineSize === shortLineSize) {
					context.stroke(); // Draw the line
				}
			}
		}

		context.restore();
	};

	const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		console.log("Ruler mouse down");
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const clickX = event.clientX - rect.left;

		setIsDragging(true);
		setHasDragged(false);

		// Update ref state
		dragRef.current = {
			startX: clickX,
			startScrollPos: scrollLeft,
			isDragging: true,
			hasDragged: false,
		};

		// Prevent text selection during drag
		event.preventDefault();
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
		console.log("Ruler touch start");
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const touch = event.touches[0];
		const touchX = touch.clientX - rect.left;

		setIsDragging(true);
		setHasDragged(false);

		// Update ref state
		dragRef.current = {
			startX: touchX,
			startScrollPos: scrollLeft,
			isDragging: true,
			hasDragged: false,
		};

		// Prevent default touch behavior
		event.preventDefault();
	};

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!dragRef.current.isDragging) return;

			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const currentX = event.clientX - rect.left;
			const deltaX = Math.abs(dragRef.current.startX - currentX);

			// Only start dragging if we've moved more than 5 pixels
			if (deltaX > 5) {
				dragRef.current.hasDragged = true;
				setHasDragged(true);
				console.log("Ruler mouse move", dragRef.current.isDragging);

				const newScrollLeft = Math.max(
					0,
					dragRef.current.startScrollPos + (dragRef.current.startX - currentX),
				);

				console.log("New scroll left:", newScrollLeft);
				onScroll?.(newScrollLeft);
			}
		},
		[onScroll],
	);

	const handleTouchMove = useCallback(
		(event: React.TouchEvent<HTMLCanvasElement>) => {
			if (!dragRef.current.isDragging) return;

			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const touch = event.touches[0];
			const currentX = touch.clientX - rect.left;
			const deltaX = Math.abs(dragRef.current.startX - currentX);

			// Only start dragging if we've moved more than 5 pixels
			if (deltaX > 5) {
				dragRef.current.hasDragged = true;
				setHasDragged(true);
				console.log("Ruler touch move", dragRef.current.isDragging);

				const newScrollLeft = Math.max(
					0,
					dragRef.current.startScrollPos + (dragRef.current.startX - currentX),
				);

				console.log("New scroll left:", newScrollLeft);
				onScroll?.(newScrollLeft);
			}
		},
		[onScroll],
	);

	const handleMouseUp = useCallback(() => {
		console.log(
			"Ruler mouse up",
			dragRef.current.isDragging,
			dragRef.current.hasDragged,
		);
		if (dragRef.current.isDragging) {
			dragRef.current.isDragging = false;
			dragRef.current.hasDragged = false;
			setIsDragging(false);
			setHasDragged(false);
		}
	}, []);

	const handleTouchEnd = useCallback(() => {
		console.log(
			"Ruler touch end",
			dragRef.current.isDragging,
			dragRef.current.hasDragged,
		);
		if (dragRef.current.isDragging) {
			dragRef.current.isDragging = false;
			dragRef.current.hasDragged = false;
			setIsDragging(false);
			setHasDragged(false);
		}
	}, []);

	const handleLocalMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
		console.log("Ruler local mouse up");

		// Check if we dragged before resetting state
		const wasDragging = dragRef.current.isDragging;
		const hadDragged = dragRef.current.hasDragged;

		// Always reset drag state on local mouse up
		if (wasDragging) {
			dragRef.current.isDragging = false;
			dragRef.current.hasDragged = false;
			setIsDragging(false);
			setHasDragged(false);
		}

		// Only handle click if we haven't dragged at all
		if (!hadDragged) {
			console.log("Ruler click - seeking to position");
			const canvas = canvasRef.current;
			if (!canvas) return;

			// Get the bounding box of the canvas to calculate the relative click position
			const rect = canvas.getBoundingClientRect();
			const clickX = event.clientX - rect.left;

			// Calculate total x position, including scrollLeft
			const totalX =
				clickX + scrollLeft - timelineOffsetX - TIMELINE_OFFSET_CANVAS_LEFT;

			onClick?.(totalX);
		} else {
			console.log("Ruler drag ended - no click action");
		}
	};

	const handleLocalTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
		console.log("Ruler local touch end");

		// Check if we dragged before resetting state
		const wasDragging = dragRef.current.isDragging;
		const hadDragged = dragRef.current.hasDragged;

		// Always reset drag state on local touch end
		if (wasDragging) {
			dragRef.current.isDragging = false;
			dragRef.current.hasDragged = false;
			setIsDragging(false);
			setHasDragged(false);
		}

		// Only handle tap if we haven't dragged at all
		if (!hadDragged) {
			console.log("Ruler tap - seeking to position");
			const canvas = canvasRef.current;
			if (!canvas) return;

			// Get the bounding box of the canvas to calculate the relative touch position
			const rect = canvas.getBoundingClientRect();
			const touch = event.changedTouches[0];
			const touchX = touch.clientX - rect.left;

			// Calculate total x position, including scrollLeft
			const totalX =
				touchX + scrollLeft - timelineOffsetX - TIMELINE_OFFSET_CANVAS_LEFT;

			onClick?.(totalX);
		} else {
			console.log("Ruler drag ended - no tap action");
		}
	};

	// Add global mouse and touch event listeners for drag
	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove as any, {
				passive: false,
			});
			document.addEventListener("touchend", handleTouchEnd);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.removeEventListener("touchmove", handleTouchMove as any);
				document.removeEventListener("touchend", handleTouchEnd);
			};
		}
	}, [
		isDragging,
		handleMouseMove,
		handleMouseUp,
		handleTouchMove,
		handleTouchEnd,
	]);

	return (
		<div
			className="border-t border-border"
			style={{
				position: "relative",
				width: "100%",
				height: `${canvasSize.height}px`,
			}}
		>
			<canvas
				onMouseDown={handleMouseDown}
				onMouseUp={handleLocalMouseUp}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleLocalTouchEnd}
				ref={canvasRef}
				height={canvasSize.height}
				style={{
					cursor: isDragging ? "grabbing" : "grab",
					width: "100%",
					display: "block",
					touchAction: "none", // Prevent default touch behaviors
				}}
			/>
		</div>
	);
};

export default Ruler;
