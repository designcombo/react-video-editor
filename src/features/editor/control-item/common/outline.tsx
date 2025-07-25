import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import useLayoutStore from "../../store/use-layout-store";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "@/components/color-picker";

function Outline({
	label,
	onChageBorderWidth,
	onChangeBorderColor,
	valueBorderWidth,
	valueBorderColor,
}: {
	label: string;
	onChageBorderWidth: (v: number) => void;
	onChangeBorderColor: (v: string) => void;
	valueBorderWidth: number;
	valueBorderColor: string;
}) {
	const [localValueBorderWidth, setLocalValueBorderWidth] = useState<
		string | number
	>(valueBorderWidth);
	const [localValueBorderColor, setLocalValueBorderColor] =
		useState<string>(valueBorderColor);
	const [open, setOpen] = useState(false);
	const isLargeScreen = useIsLargeScreen();
	const { setControItemDrawerOpen, setTypeControlItem, setLabelControlItem } =
		useLayoutStore();

	useEffect(() => {
		setLocalValueBorderWidth(valueBorderWidth);
		setLocalValueBorderColor(valueBorderColor);
	}, [valueBorderWidth, valueBorderColor]);

	const handleColorClick = () => {
		if (!isLargeScreen) {
			setControItemDrawerOpen(true);
			setTypeControlItem("strokeColor");
			setLabelControlItem("Stroke Color");
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
								<div className="relative cursor-pointer">
									<div
										style={{
											backgroundColor: localValueBorderColor,
										}}
										className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
									/>

									<Input
										className="pointer-events-none h-8 pl-10"
										value={localValueBorderColor}
										onChange={() => {}}
									/>
								</div>
							</PopoverTrigger>
							<PopoverContent
								side="bottom"
								align="end"
								className="z-[300] w-[280px] p-4"
							>
								<ColorPicker
									value={localValueBorderColor}
									format="hex"
									gradient={true}
									solid={true}
									onChange={(v: string) => {
										setLocalValueBorderColor(v);
										onChangeBorderColor(v);
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
								style={{
									backgroundColor: localValueBorderColor,
								}}
								className="absolute left-0.5 top-0.5 h-7 w-7 flex-none rounded-md border border-border"
							/>

							<Input
								className="pointer-events-none h-8 pl-10"
								value={localValueBorderColor}
								onChange={() => {}}
							/>
						</div>
					</div>
				)}
			</div>

			<div className="flex gap-2">
				<div className="flex flex-1 items-center text-sm text-muted-foreground">
					Size
				</div>
				<div className="relative w-32">
					<Input
						type="text"
						className="h-8"
						onChange={(e) => {
							const newValue = e.target.value;

							// Allow empty string or validate as a number
							if (
								newValue === "" ||
								(!Number.isNaN(Number(newValue)) &&
									Number(newValue) >= 0 &&
									Number(newValue) <= 100)
							) {
								setLocalValueBorderWidth(newValue); // Update local state

								// Only propagate if it's a valid number and not empty
								if (newValue !== "") {
									onChageBorderWidth(Number(newValue)); // Propagate as a number
								}
							}
						}}
						value={localValueBorderWidth} // Use local state for input value
					/>
				</div>
			</div>
		</div>
	);
}

export default Outline;
