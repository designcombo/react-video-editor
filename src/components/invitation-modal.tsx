"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Layers, Zap, Globe } from "lucide-react";

export function InvitationModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal on delay for better UX
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-zinc-950 text-white">
                {/* Decorative Header Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary via-primary/20 to-transparent opacity-20 blur-2xl" />

                <div className="relative p-8 pt-10">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 flex w-fit gap-1.5 px-3 py-1">
                        <Sparkles className="size-3.5" />
                        <span>Introducing the New Editor</span>
                    </Badge>

                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Elevate Your Video Creation
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-lg leading-relaxed">
                            We've built something bigger. Experience the future of browser-based video editing with our most powerful features yet.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <FeatureItem
                                icon={<Layers className="size-5 text-primary" />}
                                title="Seamless Transitions"
                                description="Professional-grade transitions to make your stories flow beautifully."
                            />
                            <FeatureItem
                                icon={<Zap className="size-5 text-primary" />}
                                title="Live Effects"
                                description="Apply stunning visual effects and filters in real-time."
                            />
                            <FeatureItem
                                icon={<Globe className="size-5 text-primary" />}
                                title="Browser Rendering"
                                description="Full-speed rendering directly in your browser. No servers required."
                            />
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button
                                asChild
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold transition-all duration-300 shadow-[0_0_20px_color-mix(in_srgb,var(--primary),transparent_60%)]"
                            >
                                <a href="https://editor.openvideo.dev/" target="_blank" rel="noopener noreferrer">
                                    Try it now
                                    <ArrowRight className="ml-2 size-5" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-zinc-500 hover:text-white hover:bg-white/5"
                            >
                                Maybe later
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0 mt-1">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </div>
    );
}
