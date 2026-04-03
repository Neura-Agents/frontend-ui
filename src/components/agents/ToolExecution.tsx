import React from 'react';
import { Typography } from '../ui/typography';
import { Badge } from '../ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface ToolExecutionProps {
    name: string;
    arguments: any;
    result?: any;
    isLoading?: boolean;
}

export const ToolExecution: React.FC<{ data: ToolExecutionProps }> = ({ data }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div
            className={cn(
                "flex flex-col gap-2 p-4 my-2 border border-border/50 rounded-2xl bg-muted/10 max-w-[600px] animate-in slide-in-from-left-4 fade-in duration-500 transition-all cursor-pointer group shadow-sm",
                isExpanded ? "bg-muted/30 ring-1 ring-primary/20" : "hover:bg-muted/20"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    {data.isLoading && (
                        <div className={cn(
                            "p-1.5 rounded-lg border border-border/50 transition-colors",
                            data.isLoading ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground",
                            isExpanded && "bg-primary/10 text-primary border-primary/20"
                        )}>
                            <div className="animate-spin">
                                <HugeiconsIcon icon={Loading01Icon} size={14} />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Typography scale="sm" weight="semibold" className="text-foreground tracking-tight">{data.name}</Typography>
                            <Badge variant="soft" className={cn(
                                "text-[10px] uppercase tracking-wider py-0 px-1.5 h-4",
                                data.isLoading ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                            )}>
                                {data.isLoading ? 'Executing' : 'Success'}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn("text-muted-foreground/50 group-hover:text-muted-foreground transition-all duration-300", isExpanded ? "rotate-180" : "")}>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-300 mt-2 space-y-4">
                    <div className="space-y-1.5">
                        <Typography scale="xs" weight="medium" className="text-muted-foreground/70 uppercase tracking-widest pl-1">Arguments</Typography>
                        <div className="relative group/code">
                            <pre className="text-[11px] text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/30 overflow-auto max-h-[150px] font-mono scrollbar-thin group-hover/code:border-primary/20 transition-colors">
                                {JSON.stringify(data.arguments, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {!data.isLoading && data.result && (
                        <div className="space-y-1.5 pt-1 border-t border-border/10">
                            <Typography scale="xs" weight="medium" className="text-muted-foreground/70 uppercase tracking-widest pl-1">Result</Typography>
                            <div className="relative group/code">
                                <pre className="text-[11px] text-foreground bg-background p-3 rounded-xl border border-border/50 overflow-auto max-h-[300px] font-mono animate-in slide-in-from-top-1 duration-500 scrollbar-thin group-hover/code:border-primary/30 transition-colors shadow-inner">
                                    {typeof data.result === 'object' ? JSON.stringify(data.result, null, 2) : String(data.result)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
