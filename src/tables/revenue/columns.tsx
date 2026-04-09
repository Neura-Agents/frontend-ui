import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/services/revenueService';

export const columns: ColumnDef<Transaction>[] = [
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
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
            <Typography scale="xs" className="font-mono text-muted-foreground">
                {row.getValue<string>('id')}
            </Typography>
        ),
    },
    {
        accessorKey: 'user_name',
        header: 'Customer',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <Typography scale="sm" weight="medium">
                    {row.original.user_email || row.getValue<string>('user_name')}
                </Typography>
                <Typography scale="xs" className="text-muted-foreground">
                    {row.original.user_id}
                </Typography>
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue<string>('type');
            return (
                <Badge variant="outline" className="capitalize">
                    {type.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <Typography scale="sm" weight="bold">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: row.original.currency,
                    }).format(row.getValue<number>('amount'))}
                </Typography>
                {row.original.currency !== 'USD' && (
                    <Typography scale="xs" className="text-muted-foreground">
                        (${row.original.amount_usd.toFixed(2)} USD)
                    </Typography>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue<string>('status');
            const variant = 
                status === 'completed' ? 'success' : 
                status === 'pending' ? 'warning' : 
                status === 'failed' ? 'destructive' : 'secondary';
            return (
                <Badge variant={variant as any} className="capitalize">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'payment_method',
        header: 'Method',
        cell: ({ row }) => (
            <Typography scale="sm">
                {row.getValue<string>('payment_method')}
            </Typography>
        ),
    },
];
