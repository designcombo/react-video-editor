import { memo, useCallback } from "react";
import useLayoutStore from "./store/use-layout-store";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { MenuItem } from "./menu-item/menu-item";
import { useIsLargeScreen } from "@/hooks/use-media-query";

// Define menu items configuration for better maintainability
const MENU_ITEMS = [
	{
		id: "uploads",
		icon: Icons.upload,
		label: "Uploads",
		ariaLabel: "Add and manage uploads",
	},
	{
		id: "texts",
		icon: Icons.type,
		label: "Texts",
		ariaLabel: "Add and edit text elements",
	},
	{
		id: "videos",
		icon: Icons.video,
		label: "Videos",
		ariaLabel: "Add and manage video content",
	},
	{
		id: "images",
		icon: Icons.image,
		label: "Images",
		ariaLabel: "Add and manage images",
	},
	{
		id: "audios",
		icon: Icons.audio,
		label: "Audio",
		ariaLabel: "Add and manage audio content",
	},
] as const;

// Memoized menu button component for better performance
const MenuButton = memo<{
	item: (typeof MENU_ITEMS)[number];
	isActive: boolean;
	onClick: (menuItem: string) => void;
}>(({ item, isActive, onClick }) => {
	const handleClick = useCallback(() => {
		onClick(item.id);
	}, [item.id, onClick]);

	const IconComponent = item.icon;

	return (
		<Button
			onClick={handleClick}
			className={cn(
				"transition-colors duration-200 hover:bg-secondary/80",
				isActive
					? "bg-secondary text-secondary-foreground"
					: "text-muted-foreground hover:text-foreground",
			)}
			variant="ghost"
			size="icon"
			aria-label={item.ariaLabel}
			aria-pressed={isActive}
		>
			{IconComponent ? <IconComponent width={16} height={16} /> : null}
		</Button>
	);
});

MenuButton.displayName = "MenuButton";

// Main MenuList component
function MenuList() {
	const {
		setActiveMenuItem,
		setShowMenuItem,
		activeMenuItem,
		showMenuItem,
		drawerOpen,
		setDrawerOpen,
	} = useLayoutStore();

	const isLargeScreen = useIsLargeScreen();

	const handleMenuItemClick = useCallback(
		(menuItem: string) => {
			setActiveMenuItem(menuItem as any);
			// Use drawer on mobile, sidebar on desktop
			if (!isLargeScreen) {
				setDrawerOpen(true);
			} else {
				setShowMenuItem(true);
			}
		},
		[isLargeScreen, setActiveMenuItem, setDrawerOpen, setShowMenuItem],
	);

	const handleDrawerOpenChange = useCallback(
		(open: boolean) => {
			setDrawerOpen(open);
		},
		[setDrawerOpen],
	);

	return (
		<>
			<nav
				className="flex w-14 flex-col items-center gap-1 border-r border-border/80 py-2"
				role="toolbar"
				aria-label="Editor tools"
			>
				{MENU_ITEMS.map((item) => {
					const isActive =
						(drawerOpen && activeMenuItem === item.id) ||
						(showMenuItem && activeMenuItem === item.id);

					return (
						<MenuButton
							key={item.id}
							item={item}
							isActive={isActive}
							onClick={handleMenuItemClick}
						/>
					);
				})}
			</nav>

			{/* Drawer only on mobile/tablet - conditionally mounted */}
			{!isLargeScreen && (
				<Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
					<DrawerContent className="max-h-[80vh]">
						<DrawerHeader>
							<DrawerTitle className="capitalize">{activeMenuItem}</DrawerTitle>
						</DrawerHeader>
						<div className="flex-1 overflow-auto">
							<MenuItem />
						</div>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
}

export default memo(MenuList);
