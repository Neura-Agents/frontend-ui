import React from 'react';
import { Typography } from '../ui/typography';
import { Badge } from '../ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading01Icon, TaskDone01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface ToolActivityData {
    name: string;
    arguments: any;
    result?: any;
    isLoading?: boolean;
}

export const ToolActivity: React.FC<{ data: ToolActivityData }> = ({ data }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div 
            className={cn(
                "flex flex-col gap-2 p-3 my-2 border border-border rounded-xl bg-muted/30 max-w-[500px] animate-in slide-in-from-left-4 fade-in duration-300 transition-all cursor-pointer",
                isExpanded ? "bg-muted/40" : "hover:bg-muted/50"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="soft" className="bg-primary/5 text-primary">Tool {data.result ? 'Result' : 'Call'}</Badge>
                    <Typography scale="sm" className="font-medium text-foreground">{data.name}</Typography>
                </div>
                <div className="flex items-center gap-3">
                    {data.isLoading ? (
                        <div className="animate-spin text-muted-foreground">
                            <HugeiconsIcon icon={Loading01Icon} size={14} />
                        </div>
                    ) : (
                        data.result && (
                            <div className="text-success">
                                <HugeiconsIcon icon={TaskDone01Icon} size={14} />
                            </div>
                        )
                    )}
                    <div className={cn("text-muted-foreground transition-transform duration-200", isExpanded ? "rotate-180" : "")}>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <Typography scale="xs" className="text-muted-foreground mb-1 mt-2">Arguments:</Typography>
                    <pre className="text-xs text-muted-foreground bg-muted p-2 rounded-lg overflow-auto max-h-[120px] mb-2 font-mono scrollbar-thin">
                        {JSON.stringify(data.arguments, null, 2)}
                    </pre>

                    {data.result && (
                        <>
                            <Typography scale="xs" className="text-muted-foreground mb-1">Result:</Typography>
                            <pre className="text-xs text-foreground bg-background p-2 rounded-lg border border-border/50 overflow-auto max-h-[200px] font-mono animate-in slide-in-from-top-2 duration-500 scrollbar-thin">
                                {typeof data.result === 'object' ? JSON.stringify(data.result, null, 2) : String(data.result)}
                            </pre>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
