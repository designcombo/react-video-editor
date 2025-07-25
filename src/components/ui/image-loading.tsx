import { Loader2 } from "lucide-react";

interface ImageLoadingProps {
	message?: string;
}

export function ImageLoading({
	message = "Loading images...",
}: ImageLoadingProps) {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
}
