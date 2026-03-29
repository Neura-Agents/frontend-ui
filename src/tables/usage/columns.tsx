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
import type { Usage } from '@/services/usageService';

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
        accessorKey: 'agent_id',
        header: 'Agent',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <Badge variant="outline" className="w-fit">
                    {row.original.agentName || row.getValue('agent_id')}
                </Badge>
                {row.original.agentName && (
                    <Typography
                        scale="xs"
                        className="text-muted-foreground font-mono text-[10px]"
                    >
                        {row.getValue<string>('agent_id')}
                    </Typography>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'api_key',
        header: 'Context / Key',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <Typography scale="sm" weight="medium">
                    {row.original.apiKeyName || 'N/A'}
                </Typography>
                {row.original.api_key && (
                    <Typography
                        scale="xs"
                        className="text-muted-foreground font-mono text-[10px]"
                    >
                        ID: {row.getValue<string>('api_key').slice(0, 8)}...
                    </Typography>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'execution_id',
        header: 'Execution ID',
        cell: ({ row }) => (
            <code className="text-[10px] bg-secondary/50 px-1 py-0.5 rounded font-mono">
                {row.getValue<string>('execution_id').slice(0, 8)}...
            </code>
        ),
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
        cell: ({ row }) => (
            <Typography scale="sm" weight="bold">
                ${row.getValue<number>('total_cost').toFixed(4)}
            </Typography>
        ),
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

                        {/* ✅ FIXED DIALOG */}
                        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">

                            {/* Header (fixed) */}
                            <DialogHeader>
                                <DialogTitle>Execution Details</DialogTitle>
                                <DialogDescription>
                                    {usage.execution_id}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">

                                {/* Meta Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 p-4 rounded-2xl border">
                                        <Typography className="text-muted-foreground uppercase font-semibold text-xs">
                                            Agent
                                        </Typography>
                                        <Typography scale="sm" weight="medium">
                                            {usage.agentName || usage.agent_id}
                                        </Typography>
                                    </div>

                                    <div className="space-y-1.5 p-4 rounded-2xl border">
                                        <Typography className="text-muted-foreground uppercase font-semibold text-xs">
                                            API Key
                                        </Typography>
                                        <Typography scale="sm" weight="medium">
                                            {usage.apiKeyName || 'N/A'}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Initial Request */}
                                <div className="space-y-3">
                                    <Typography
                                        weight="bold"
                                        scale="sm"
                                        className="tracking-tight text-foreground/80"
                                    >
                                        Initial Request
                                    </Typography>

                                    <CodeBlock className="rounded-2xl shadow-inner max-h-[250px] overflow-y-auto whitespace-pre-wrap wrap-break-word">
                                        {JSON.stringify(usage.initial_request, null, 2)}
                                    </CodeBlock>
                                </div>

                                {/* Final Response */}
                                <div className="space-y-3">
                                    <Typography
                                        weight="bold"
                                        scale="sm"
                                        className="tracking-tight text-foreground/80"
                                    >
                                        Final Response
                                    </Typography>

                                    <CodeBlock className="rounded-2xl shadow-inner max-h-[250px] overflow-y-auto whitespace-pre-wrap wrap-break-word">
                                        {JSON.stringify(
                                            usage.final_response || {
                                                message: 'Internal Final Response',
                                            },
                                            null,
                                            2
                                        )}
                                    </CodeBlock>
                                </div>

                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },
];