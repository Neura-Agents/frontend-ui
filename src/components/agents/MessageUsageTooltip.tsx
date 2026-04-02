import React from 'react';

interface UsageData {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
}

export const MessageUsageTooltip: React.FC<{ usage: UsageData }> = ({ usage }) => {
    return (
        <div className="flex flex-col gap-1.5 p-1 min-w-[170px]">
            <div className="flex justify-between items-center">
                <span className="text-muted-background text-xs tracking-wider whitespace-nowrap">Input Tokens</span>
                <span className="font-mono tabular-nums text-xs text-background">{usage.prompt_tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-background text-xs tracking-wider whitespace-nowrap">Output Tokens</span>
                <span className="font-mono tabular-nums text-xs text-background">{usage.completion_tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-background text-xs tracking-wider">Total Cost</span>
                <span className="font-mono tabular-nums text-xs text-background ">${(usage.cost || 0).toFixed(4)}</span>
            </div>
        </div>
    );
};
