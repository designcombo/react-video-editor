"use client";

import type React from "react";
import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Ban, Code2, Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { FilePreview } from "@/components/ui/file-preview";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

const chatBubbleVariants = cva(
	"relative break-words rounded-lg  text-sm w-full",
	{
		variants: {
			isUser: {
				true: "bg-muted",
				false: "bg-muted text-foreground",
			},
			animation: {
				none: "",
				slide: "duration-300 animate-in fade-in-0",
				scale: "duration-300 animate-in fade-in-0 zoom-in-75",
				fade: "duration-500 animate-in fade-in-0",
			},
		},
		compoundVariants: [
			{
				isUser: true,
				animation: "slide",
				class: "slide-in-from-right",
			},
			{
				isUser: false,
				animation: "slide",
				class: "slide-in-from-left",
			},
			{
				isUser: true,
				animation: "scale",
				class: "origin-bottom-right",
			},
			{
				isUser: false,
				animation: "scale",
				class: "origin-bottom-left",
			},
		],
	},
);

type Animation = VariantProps<typeof chatBubbleVariants>["animation"];

interface Attachment {
	name?: string;
	contentType?: string;
	url: string;
}

interface PartialToolCall {
	state: "partial-call";
	toolName: string;
}

interface ToolCall {
	state: "call";
	toolName: string;
}

interface ToolResult {
	state: "result";
	toolName: string;
	result: {
		__cancelled?: boolean;
		[key: string]: any;
	};
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

interface ReasoningPart {
	type: "reasoning";
	reasoning: string;
}

interface ToolInvocationPart {
	type: "tool-invocation";
	toolInvocation: ToolInvocation;
}

interface TextPart {
	type: "text";
	text: string;
}

// For compatibility with AI SDK types, not used
interface SourcePart {
	type: "source";
}

type MessagePart = TextPart | ReasoningPart | ToolInvocationPart | SourcePart;

export interface Message {
	id: string;
	role: "user" | "assistant" | (string & {});
	content: string;
	createdAt?: Date;
	experimental_attachments?: Attachment[];
	toolInvocations?: ToolInvocation[];
	parts?: MessagePart[];
}

export interface ChatMessageProps extends Message {
	showTimeStamp?: boolean;
	animation?: Animation;
	actions?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
	role,
	content,
	animation = "scale",
	actions,
	experimental_attachments,
	toolInvocations,
	parts,
}) => {
	const files = useMemo(() => {
		return experimental_attachments?.map((attachment) => {
			const dataArray = dataUrlToUint8Array(attachment.url);
			const file = new File([dataArray], attachment.name ?? "Unknown");
			return file;
		});
	}, [experimental_attachments]);

	const isUser = role === "user";

	if (isUser) {
		return (
			<div className={cn("flex flex-col items-start")}>
				{files ? (
					<div className="mb-1 flex flex-wrap gap-2">
						{files.map((file, index) => {
							return <FilePreview file={file} key={index} />;
						})}
					</div>
				) : null}
				<div className="flex px-4 py-2 gap-2 w-full justify-end">
					<div
						className={cn(
							chatBubbleVariants({ isUser, animation }),
							"bg-zinc-900 px-4 py-2 rounded-xl",
						)}
					>
						<MarkdownRenderer>{content}</MarkdownRenderer>
					</div>
				</div>
			</div>
		);
	}

	if (parts && parts.length > 0) {
		return parts.map((part, index) => {
			if (part.type === "text") {
				return (
					<div key={`text-${index}`} className="flex px-4 py-2 gap-2">
						<div
							className={cn(
								chatBubbleVariants({ isUser, animation }),
								"px-3 py-2 rounded-lg",
							)}
						>
							<MarkdownRenderer>{part.text}</MarkdownRenderer>
							{actions ? (
								<div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
									{actions}
								</div>
							) : null}
						</div>
					</div>
				);
			}

			if (part.type === "reasoning") {
				console.log("reasoning", part);
				return <ReasoningBlock key={`reasoning-${index}`} part={part} />;
			}

			if (part.type === "tool-invocation") {
				return (
					<ToolCall
						key={`tool-${index}`}
						toolInvocations={[part.toolInvocation]}
					/>
				);
			}

			return null;
		});
	}

	if (toolInvocations && toolInvocations.length > 0) {
		return <ToolCall toolInvocations={toolInvocations} />;
	}

	return (
		<div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
			<div className={cn(chatBubbleVariants({ isUser, animation }))}>
				<MarkdownRenderer>{content}</MarkdownRenderer>
				{actions ? (
					<div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
						{actions}
					</div>
				) : null}
			</div>
		</div>
	);
};

function dataUrlToUint8Array(data: string) {
	const base64 = data.split(",")[1];
	const buf = Buffer.from(base64, "base64");
	return new Uint8Array(buf);
}

const ReasoningBlock = ({ part }: { part: ReasoningPart }) => {
	return (
		<div className="mb-2 flex flex-col items-start">
			<Accordion
				type="single"
				collapsible
				className="group w-full overflow-hidden rounded-lg border bg-muted/50"
			>
				<AccordionItem value="reasoning">
					<AccordionTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
						<span>Thinking</span>
					</AccordionTrigger>
					<AccordionContent>
						<div className="whitespace-pre-wrap text-xs">{part.reasoning}</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

function ToolCall({
	toolInvocations,
}: Pick<ChatMessageProps, "toolInvocations">) {
	if (!toolInvocations?.length) return null;

	return (
		<div className="flex flex-col items-start gap-2 px-4">
			{toolInvocations.map((invocation, index) => {
				const isCancelled =
					invocation.state === "result" &&
					invocation.result.__cancelled === true;

				if (isCancelled) {
					return (
						<div
							key={index}
							className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
						>
							<Ban className="h-4 w-4" />
							<span>
								Cancelled{" "}
								<span className="font-mono">
									{"`"}
									{invocation.toolName}
									{"`"}
								</span>
							</span>
						</div>
					);
				}

				switch (invocation.state) {
					case "partial-call":
					case "call":
						return (
							<div
								key={index}
								className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
							>
								<Terminal className="h-4 w-4" />
								<span>
									Calling{" "}
									<span className="font-mono">
										{"`"}
										{invocation.toolName}
										{"`"}
									</span>
									...
								</span>
								<Loader2 className="h-3 w-3 animate-spin" />
							</div>
						);
					case "result":
						return <ToolResult key={index} invocation={invocation} />;
					default:
						return null;
				}
			})}
		</div>
	);
}

const ToolResult = ({ invocation }: { invocation: ToolResult }) => {
	return (
		<div className="flex flex-col gap-1.5 rounded-lg border bg-muted/50 px-4 py-2 text-sm w-full">
			<Accordion type="single" collapsible className="group w-full">
				<AccordionItem value="tool-result">
					<AccordionTrigger className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-full p-0">
						<div className="flex items-center gap-2">
							<Code2 className="h-4 w-4" />
							<div className="flex flex-col">
								<span className="text-sm font-medium">
									{invocation.toolName}
								</span>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
							{JSON.stringify(invocation.result, null, 2)}
						</pre>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};
