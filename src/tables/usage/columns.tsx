import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CodeBlock } from '@/components/ui/code-block';
import { Copy, Check } from 'lucide-react';
import type { Usage } from '@/services/usageService';

const CopyButton = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            title="Copy ID"
        >
            {copied ? (
                <Check className="h-3 w-3 text-primary animate-in zoom-in duration-200" />
            ) : (
                <Copy className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
            )}
        </Button>
    );
};

export const columns: ColumnDef<Usage>[] = [
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => (
            <Typography scale="sm">
                {format(new Date(row.getValue('created_at')), 'MMM dd, yyyy HH:mm')}
            </Typography>
        ),
    },
    {
        accessorKey: 'resource_id',
        header: 'Resource',
        cell: ({ row }) => {
            const usage = row.original;
            const type = usage.resource_type;
            const name = usage.resource_name || usage.resourceName || usage.agentName || usage.agent_name || usage.kb_name || usage.kg_name;
            const resourceId = usage.resource_id;
            const variant = type === 'agent' ? 'default' : type === 'knowledge-base' ? 'secondary' : 'outline';

            return (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <Badge variant={variant as any} className="capitalize text-[10px] px-1.5 py-0 leading-3 h-4">
                            {type?.replace('-', ' ')}
                        </Badge>
                        <Typography scale="sm" weight="medium" className="truncate max-w-[120px]">
                            {name || resourceId.slice(0, 8)}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-1 ml-1 group">
                        <Typography
                            scale="xs"
                            className="text-muted-foreground font-mono text-[10px]"
                        >
                            {resourceId.slice(0, 8)}...
                        </Typography>
                        <CopyButton value={resourceId} />
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'action_type',
        header: 'Action',
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.getValue<string>('action_type')}
            </Badge>
        ),
    },
    {
        accessorKey: 'api_key',
        header: 'Context / Key',
        cell: ({ row }) => {
            const usage = row.original;
            const apiKey = usage.api_key;
            const keyName = usage.api_key_name || usage.apiKeyName || 'Playground';

            return (
                <div className="flex flex-col gap-0.5">
                    <Typography scale="sm" weight="medium" className="truncate max-w-[120px]">
                        {keyName}
                    </Typography>
                    {apiKey && (
                        <div className="flex items-center gap-1 group">
                            <Typography
                                scale="xs"
                                className="text-muted-foreground font-mono text-[10px]"
                            >
                                {apiKey.slice(0, 8)}...
                            </Typography>
                            <CopyButton value={apiKey} />
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'execution_id',
        header: 'Execution ID',
        cell: ({ row }) => {
            const executionId = row.getValue<string>('execution_id');
            return (
                <div className="flex items-center gap-1 group">
                    <Typography scale="xs" className="text-muted-foreground font-mono text-[10px]">
                        {executionId.slice(0, 8)}...
                    </Typography>
                    <CopyButton value={executionId} />
                </div>
            );
        },
    },
    {
        accessorKey: 'total_tokens',
        header: 'Tokens',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <Typography scale="sm" weight="medium">
                    {row.getValue<number>('total_tokens').toLocaleString()}
                </Typography>
                <div className="flex gap-1.5">
                    <Typography scale="xs" className="text-muted-foreground">
                        In: {row.original.total_input_tokens.toLocaleString()}
                    </Typography>
                    <Typography scale="xs" className="text-muted-foreground">
                        Out: {row.original.total_completion_tokens.toLocaleString()}
                    </Typography>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'total_cost',
        header: 'Cost',
        cell: ({ row, table }) => {
            const cost = row.getValue<number>('total_cost');
            const meta = table.options.meta as any;
            const currency = meta?.currency || 'USD';
            const rate = meta?.exchangeRates?.[currency] || 1;

            return (
                <Typography scale="sm" weight="bold">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: currency === 'USD' ? 4 : 2,
                    }).format(cost * rate)}
                </Typography>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const usage = row.original;

            return (
                <div className="flex justify-center items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                Details
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
                            <DialogHeader>
                                <DialogTitle>Usage Details</DialogTitle>
                                <DialogDescription className="font-mono text-[10px]">
                                    {usage.execution_id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1.5 p-4 rounded-2xl border bg-card/50">
                                        <Typography className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                                            Resource
                                        </Typography>
                                        <div className="flex flex-col gap-0.5">
                                            <Typography scale="sm" weight="medium">
                                                {usage.resourceName || usage.agentName || usage.resource_id}
                                            </Typography>
                                            <Typography scale="xs" className="text-muted-foreground capitalize">
                                                {usage.resource_type?.replace('-', ' ')}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 p-4 rounded-2xl border bg-card/50">
                                        <Typography className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                                            Action
                                        </Typography>
                                        <Typography scale="sm" weight="medium" className="capitalize">
                                            {usage.action_type || 'N/A'}
                                        </Typography>
                                    </div>

                                    <div className="space-y-1.5 p-4 rounded-2xl border bg-card/50">
                                        <Typography className="text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                                            Context / Key
                                        </Typography>
                                        <Typography scale="sm" weight="medium">
                                            {usage.apiKeyName || 'Playground'}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Typography weight="bold" scale="sm" className="tracking-tight text-foreground/80">
                                            Token Breakdown
                                        </Typography>
                                        <Badge variant="outline" className="font-mono">
                                            {usage.total_tokens.toLocaleString()} Total
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl border border-dashed text-center">
                                            <Typography scale="xs" className="text-muted-foreground">Input</Typography>
                                            <Typography scale="sm" weight="bold">{usage.total_input_tokens.toLocaleString()}</Typography>
                                        </div>
                                        <div className="p-3 rounded-xl border border-dashed text-center">
                                            <Typography scale="xs" className="text-muted-foreground">Completion</Typography>
                                            <Typography scale="sm" weight="bold">{usage.total_completion_tokens.toLocaleString()}</Typography>
                                        </div>
                                    </div>
                                </div>

                                {usage.initial_request && (
                                    <div className="space-y-3">
                                        <Typography weight="bold" scale="sm" className="tracking-tight text-foreground/80">
                                            Request Metadata
                                        </Typography>
                                        <CodeBlock className="rounded-2xl shadow-inner max-h-[250px] overflow-y-auto whitespace-pre-wrap">
                                            {JSON.stringify(usage.initial_request, null, 2)}
                                        </CodeBlock>
                                    </div>
                                )}

                                {usage.final_response && (
                                    <div className="space-y-3">
                                        <Typography weight="bold" scale="sm" className="tracking-tight text-foreground/80">
                                            Response Details
                                        </Typography>
                                        <CodeBlock className="rounded-2xl shadow-inner max-h-[250px] overflow-y-auto whitespace-pre-wrap">
                                            {JSON.stringify(usage.final_response, null, 2)}
                                        </CodeBlock>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },
];