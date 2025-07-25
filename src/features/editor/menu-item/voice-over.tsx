import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ADD_TEXT } from "@designcombo/state";
import { dispatch } from "@designcombo/events";
import { useIsDraggingOverTimeline } from "../hooks/is-dragging-over-timeline";
import Draggable from "@/components/shared/draggable";
import { TEXT_ADD_PAYLOAD } from "../constants/payload";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export const VoiceOver = () => {
	const [voiceId, setVoiceId] = useState<string>("");
	const [textValue, setTextValue] = useState<string>("");

	const isDraggingOverTimeline = useIsDraggingOverTimeline();

	const handleAddText = () => {
		dispatch(ADD_TEXT, {
			payload: TEXT_ADD_PAYLOAD,
			options: {},
		});
	};

	const createVoiceOver = async () => {
		if (voiceId && textValue) {
			const { url } = await voiceOverMedia(voiceId, textValue);
			console.log("voice over url", url);
		} else {
			throw new Error("Please select a voice and text.");
		}
	};

	return (
		<div className="flex h-full flex-col">
			<ScrollArea>
				<div className="mb-8 flex flex-1 flex-col">
					<div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
						Generate AI voice over
					</div>
					<div className="flex flex-col gap-4 px-4">
						<div className="flex flex-col gap-2">
							<Textarea
								placeholder="type your script here"
								className="text-[10px]"
								value={textValue}
								onChange={(e) => setTextValue(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-sm">Speaker voice</p>
						</div>
						<div />
					</div>
				</div>
			</ScrollArea>
			<div className="relative bottom-4 mt-8 h-10 w-full px-4">
				<Button
					onClick={() => createVoiceOver()}
					size={"sm"}
					className="w-full"
				>
					Generate Voice
				</Button>
			</div>
		</div>
	);
};

async function voiceOverMedia(
	voiceId: string,
	text: string,
): Promise<{ url: string }> {
	const voiceOverResponse = await fetch("/api/voice-over", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ voiceId, text }),
	});

	if (!voiceOverResponse.ok) {
		throw new Error("Failed to initiate voice over.");
	}

	const voiceOverData = await voiceOverResponse.json();
	const { voiceOver } = voiceOverData;

	return new Promise((resolve, reject) => {
		const checkStatus = async () => {
			try {
				const statusResponse = await fetch(`/api/voice-over/${voiceOver.id}`);

				if (!statusResponse.ok) {
					throw new Error("Failed to fetch export status.");
				}

				const statusInfo = await statusResponse.json();
				const { status, url } = statusInfo.voiceOver;

				if (status === "COMPLETED") {
					if (!url) throw new Error("Failed to fetch export url.");
					resolve({ url });
				} else if (status === "PENDING" || status === "PROGRESS") {
					setTimeout(checkStatus, 2500);
				} else {
					reject(new Error(`Unexpected status: ${status}`));
				}
			} catch (error) {
				reject(error);
			}
		};

		checkStatus();
	});
}
