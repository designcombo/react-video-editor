import React, { Suspense } from "react";
import type { JSX } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { LogsIcon, WorkflowIcon } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MarkdownRendererProps {
	children: string;
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
	return (
		<div className="space-y-3">
			<Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
				{children}
			</Markdown>
		</div>
	);
}

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
	children: string;
	language: string;
}

const HighlightedPre = React.memo(
	({ children, language, ...props }: HighlightedPreProps) => {
		const [tokens, setTokens] = React.useState<any[] | null>(null);

		React.useEffect(() => {
			let mounted = true;

			const loadTokens = async () => {
				try {
					const { getHighlighter, bundledLanguages } = await import("shiki");

					// Check if language is supported
					if (!language || !(language in bundledLanguages)) {
						console.warn(`Language "${language}" is not supported by Shiki`);
						return;
					}

					const highlighter = await getHighlighter({
						themes: ["min-dark"],
						langs: [language as keyof typeof bundledLanguages],
					});

					const result = await highlighter.codeToTokens(children, {
						lang: language as keyof typeof bundledLanguages,
						themes: {
							light: "min-dark",
							dark: "min-dark",
						},
					});

					if (mounted) {
						setTokens(result.tokens);
					}
				} catch (error) {
					console.error("Failed to load syntax highlighting:", error);
				}
			};

			loadTokens();

			return () => {
				mounted = false;
			};
		}, [children, language]);

		if (!tokens) {
			return <pre {...props}>{children}</pre>;
		}

		return (
			<pre {...props}>
				<code>
					{tokens.map((line, lineIndex) => (
						<React.Fragment key={`line-${lineIndex}`}>
							<span>
								{line.map((token: any, tokenIndex: number) => {
									const style =
										typeof token.htmlStyle === "string"
											? undefined
											: token.htmlStyle;

									return (
										<span
											key={`token-${lineIndex}-${tokenIndex}`}
											className="text-shiki-light bg-shiki-light-bg dark:text-shiki-dark dark:bg-shiki-dark-bg"
											style={style}
										>
											{token.content}
										</span>
									);
								})}
							</span>
							{lineIndex !== tokens.length - 1 && "\n"}
						</React.Fragment>
					))}
				</code>
			</pre>
		);
	},
);
HighlightedPre.displayName = "HighlightedCode";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
	children: React.ReactNode;
	className?: string;
	language: string;
}

const CodeBlock = ({
	children,
	className,
	language,
	...rest
}: CodeBlockProps) => {
	const code = typeof children === "string" ? children : String(children);

	return (
		<div className="relative w-full group/code">
			<Suspense fallback={<pre className={className}>{code}</pre>}>
				<ScrollArea>
					<pre className={cn("overflow-x-auto", className)}>
						<HighlightedPre language={language} className="rounded-md">
							{code}
						</HighlightedPre>
					</pre>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</Suspense>
		</div>
	);
};

function childrenTakeAllStringContents(element: any): string {
	if (typeof element === "string") {
		return element;
	}

	if (element?.props?.children) {
		const children = element.props.children;

		if (Array.isArray(children)) {
			return children
				.map((child) => childrenTakeAllStringContents(child))
				.join("");
		}
		return childrenTakeAllStringContents(children);
	}

	return "";
}

const COMPONENTS = {
	h1: withClass("h1", "text-2xl font-semibold"),
	h2: withClass("h2", "font-semibold text-xl"),
	h3: withClass("h3", "font-semibold text-lg"),
	h4: withClass("h4", "font-semibold text-base"),
	h5: withClass("h5", "font-medium"),
	strong: withClass("strong", "font-semibold"),
	a: withClass("a", "text-primary underline underline-offset-2"),
	blockquote: withClass("blockquote", "border-l-2 border-primary pl-4"),
	code: ({ children, className, node, ...rest }: any) => {
		const match = /language-(\w+)/.exec(className || "");
		const language = match ? match[1].toLowerCase() : undefined;

		if (language === "json" && children.includes("segments")) {
			return (
				<Accordion type="single" collapsible className="w-full border">
					<AccordionItem value="schema">
						<AccordionTrigger className="flex text-sm items-center gap-2 py-2 px-2">
							<div className="flex items-center gap-2">
								<LogsIcon className="w-4 h-4" />
								Schema content
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<CodeBlock className={className} language={language} {...rest}>
								{children}
							</CodeBlock>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			);
		}

		return language ? (
			<CodeBlock className={className} language={language} {...rest}>
				{children}
			</CodeBlock>
		) : (
			<code
				className={cn(
					"font-mono rounded-lg !border !bg-background-subtle [:not(pre)>&]:rounded-md [:not(pre)>&]:bg-background/50 [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5 overflow-scroll",
				)}
				{...rest}
			>
				{children}
			</code>
		);
	},
	pre: ({ children }: any) => children,
	ol: withClass("ol", "list-decimal space-y-2 pl-6"),
	ul: withClass("ul", "list-disc space-y-2 pl-6"),
	li: withClass("li", "my-1.5  leading-[1.7]"),
	table: withClass(
		"table",
		"w-full border-collapse overflow-y-auto rounded-md border border-foreground/20",
	),
	th: withClass(
		"th",
		"border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
	),
	td: withClass(
		"td",
		"border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
	),
	tr: withClass("tr", "m-0 border-t p-0 even:bg-muted"),
	p: withClass("p", "whitespace-pre-wrap leading-[1.7]"),
	hr: withClass("hr", "border-foreground/20"),
};

function withClass(Tag: keyof JSX.IntrinsicElements, classes: string) {
	const Component = ({ node, ...props }: any) => (
		<Tag className={classes} {...props} />
	);
	Component.displayName = Tag;
	return Component;
}

export default MarkdownRenderer;
