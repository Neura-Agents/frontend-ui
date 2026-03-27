import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { type Prompt } from "@/services/platformService";
import {
    Calendar03Icon,
    Tag01Icon,
    File01Icon,
    InformationCircleIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ViewPromptDialogProps {
    prompt: Prompt | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ViewPromptDialog: React.FC<ViewPromptDialogProps> = ({
    prompt,
    isOpen,
    onOpenChange
}) => {
    if (!prompt) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {prompt.name}
                    </DialogTitle>
                    <DialogDescription>
                        {prompt.metadata?.description || "Full prompt strategy and configuration metadata"}
                    </DialogDescription>

                    <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline">
                            <HugeiconsIcon icon={Tag01Icon} size={12} />
                            {prompt.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                            <HugeiconsIcon icon={Calendar03Icon} size={12} />
                            {new Date(prompt.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </Badge>
                        {prompt.is_active && (
                            <Badge variant="success">
                                Active
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar mt-2">
                    {/* Metadata Section */}
                    {prompt.metadata && Object.keys(prompt.metadata).length > 0 && (
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                                <span>Instruction Metadata</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(prompt.metadata).map(([key, value]) => (
                                    <div key={key} className="p-3 rounded-2xl bg-muted/30 border border-border/40 flex flex-col gap-0.5 hover:bg-muted/50 transition-colors">
                                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
                                            {key}
                                        </span>
                                        <span className="text-sm font-medium text-foreground truncate">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Prompt Text Section */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                            <HugeiconsIcon icon={File01Icon} size={16} />
                            <span>System Instructions</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-border/60 bg-background/50">
                            <CodeBlock
                                maxHeight="400px"
                                className="border-0 rounded-none bg-transparent text-sm"
                            >
                                {prompt.prompt_text || 'No system instruction text available.'}
                            </CodeBlock>
                        </div>
                    </section>

                    <section className="space-y-2 pb-2">
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground/40 font-semibold">
                            Full Storage Path
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-muted/20 border border-border/30 text-[10px] font-mono text-muted-foreground/80 break-all leading-relaxed">
                            {prompt.storage_path}
                        </div>
                    </section>
                </div>

                <DialogFooter className="mt-8">
                    <Button
                        variant="ghost"
                        className="rounded-full px-6 text-xs"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
};
