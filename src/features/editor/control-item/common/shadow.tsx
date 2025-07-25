import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBoxShadow } from "@designcombo/types";
import { useEffect, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";
import { X } from "lucide-react";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import useLayoutStore from "../../store/use-layout-store";

function Shadow({
	label,
	value,
	onChange,
}: {
	label: string;
	value: IBoxShadow;
	onChange: (v: IBoxShadow) => void;
}) {
	const [localValue, setLocalValue] = useState<IBoxShadow>(value);
	const [open, setOpen] = useState(false);
	const isLargeScreen = useIsLargeScreen();
	const { setControItemDrawerOpen, setTypeControlItem, setLabelControlItem } =
		useLayoutStore();

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleColorClick = () => {
		if (!isLargeScreen) {
			setControItemDrawerOpen(true);
			setTypeControlItem("shadowColor");
			setLabelControlItem("Shadow Color");
		}
	};

	return (
		<div className="flex flex-col gap-2 py-4">
			<Label className="font-sans text-xs font-semibold">{label}</Label>

			<div className="flex gap-2">
				<div className="flex flex-1 items-center text-sm text-muted-foreground">
					Color
				</div>

				{isLargeScreen ? (
					<div className="relative w-32">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<div className="relative">
									<div
										style={{ backgroundColor: localValue.color }}
										className="absolute left-0.5 top-0.5 h-7 w-7 flex-none cursor-pointer rounded-md border border-border"
									/>

									<Input
										className="pointer-events-none h-8 pl-10"
										value={localValue.color}
										onChange={() => {}}
									/>
								</div>
							</PopoverTrigger>

							<PopoverContent
								side="bottom"
								align="end"
								className="z-[300] w-[280px] p-4"
							>
								<div className="drag-handle flex w-[266px] cursor-grab justify-between rounded-t-lg bg-popover px-4 pt-4">
									<p className="text-sm font-bold">Shadow</p>
									<div
										className="h-4 w-4"
										onClick={() => {
											setOpen(false);
										}}
									>
										<X className="h-4 w-4 cursor-pointer font-extrabold text-muted-foreground" />
									</div>
								</div>
								<ColorPicker
									value={localValue.color}
									format="hex"
									gradient={true}
									solid={true}
									onChange={(v) => {
										setLocalValue({ ...localValue, color: v });
										onChange({
											...localValue,
											color: v,
										});
									}}
									allowAddGradientStops={true}
								/>
							</PopoverContent>
						</Popover>
					</div>
				) : (
					<div className="relative w-32">
						<div className="relative cursor-pointer" onClick={handleColorClick}>
							<div
								style={{ background: localValue.color || "#ffffff" }}
								className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
							/>

							<Input
								className="pointer-events-none h-8 pl-10"
								value={localValue.color}
								onChange={() => {}}
							/>
						</div>
					</div>
				)}
			</div>

			<div className="flex gap-2">
				<div className="flex flex-1 items-center text-sm text-muted-foreground">
					X
				</div>
				<div className="relative w-32">
					<Input
						className="h-8"
						value={localValue.x}
						onChange={(e) => {
							const newValue = e.target.value;

							// Allow empty string or validate as a number
							if (
								newValue === "" ||
								(!Number.isNaN(Number(newValue)) && Number(newValue) >= 0)
							) {
								setLocalValue((prev) => ({
									...prev,
									x: (newValue === ""
										? ""
										: Number(newValue)) as unknown as number,
								})); // Update local state

								// Only propagate if it's a valid number and not empty
								if (newValue !== "") {
									onChange({
										...localValue,
										x: Number(newValue),
									}); // Propagate as a number
								}
							}
						}}
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<div className="flex flex-1 items-center text-sm text-muted-foreground">
					Y
				</div>
				<div className="relative w-32">
					<Input
						className="h-8"
						value={localValue.y}
						onChange={(e) => {
							const newValue = e.target.value;

							// Allow empty string or validate as a number
							if (
								newValue === "" ||
								(!Number.isNaN(Number(newValue)) && Number(newValue) >= 0)
							) {
								setLocalValue((prev) => ({
									...prev,
									y: (newValue === ""
										? ""
										: Number(newValue)) as unknown as number,
								})); // Update local state

								// Only propagate if it's a valid number and not empty
								if (newValue !== "") {
									onChange({
										...localValue,
										y: Number(newValue),
									}); // Propagate as a number
								}
							}
						}}
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<div className="flex flex-1 items-center text-sm text-muted-foreground">
					Blur
				</div>
				<div className="relative w-32">
					<Input
						className="h-8"
						value={localValue.blur}
						onChange={(e) => {
							const newValue = e.target.value;

							// Allow empty string or validate as a number
							if (
								newValue === "" ||
								(!Number.isNaN(Number(newValue)) && Number(newValue) >= 0)
							) {
								setLocalValue((prev) => ({
									...prev,
									blur: (newValue === ""
										? ""
										: Number(newValue)) as unknown as number,
								})); // Update local state

								// Only propagate if it's a valid number and not empty
								if (newValue !== "") {
									onChange({
										...localValue,
										blur: Number(newValue),
									}); // Propagate as a number
								}
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Shadow;
