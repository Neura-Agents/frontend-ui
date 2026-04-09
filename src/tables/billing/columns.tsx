"use client"

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export type Transaction = {
    id: string;
    amount: number;
    type: 'top-up' | 'consumption';
    provider?: string;
    description: string;
    created_at: string;
    metadata?: any;
}

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "id",
        header: "Transaction ID",
        cell: ({ row }) => {
            return (
                <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    {row.getValue("id")}
                </code>
            )
        }
    },
    {
        accessorKey: "amount",
        header: "Credits Added",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            return (
                <span className="text-sm font-semibold text-foreground">
                    {Math.abs(amount).toFixed(2)}
                </span>
            )
        }
    },
    {
        id: "amount_paid",
        header: "Amount Paid",
        cell: ({ row }) => {
            const metadata = row.original.metadata;
            const inrAmount = metadata?.amount_inr;
            return (
                <span className="text-sm font-medium">
                    {inrAmount ? `₹${parseFloat(inrAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
                </span>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string;
            return (
                <span className="text-sm text-muted-foreground">
                    {format(new Date(date), 'MMM dd, yyyy HH:mm')}
                </span>
            )
        }
    },
    {
        id: "actions",
        header: "Invoice",
        cell: ({ row }) => {
            const metadata = row.original.metadata;
            const paymentId = metadata?.razorpay_payment_id;

            if (!paymentId) return <span className="text-xs text-muted-foreground">N/A</span>;

            // Note: Public viewing of specific payments usually requires a token or dashboard access.
            // For now, we'll provide a link that can be used to view the payment transcript/details.
            const url = `https://dashboard.razorpay.com/app/payments/${paymentId}`;

            return (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                >
                    View <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                </a>
            )
        }
    }
]
