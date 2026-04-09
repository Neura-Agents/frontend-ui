"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { type Model } from "@/services/modelsService"

export const columns: ColumnDef<Model>[] = [
    {
        accessorKey: "model_name",
        header: "Model",
        cell: ({ row }) => {
            const model = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {model.model_name}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "provider",
        header: "Provider",
        cell: ({ row }) => {
            const provider = row.getValue("provider") as string;
            return (
                <Badge variant="outline" className="capitalize bg-primary/5 hover:bg-primary/10 transition-colors">
                    {provider.replace('_', ' ')}
                </Badge>
            )
        }
    },
    {
        accessorKey: "cost_input",
        header: "Input / 1M",
        cell: ({ row, table }) => {
            const cost = row.getValue("cost_input") as number;
            const meta = table.options.meta as any;
            const currency = meta?.currency || 'USD';
            const rate = meta?.exchangeRates?.[currency] || 1;
            
            return (
                <span className="text-sm font-medium text-foreground">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4
                    }).format(cost * 1000000 * rate)}
                </span>
            )
        }
    },
    {
        accessorKey: "cost_output",
        header: "Output / 1M",
        cell: ({ row, table }) => {
            const cost = row.getValue("cost_output") as number;
            const meta = table.options.meta as any;
            const currency = meta?.currency || 'USD';
            const rate = meta?.exchangeRates?.[currency] || 1;

            return (
                <span className="text-sm font-medium text-foreground">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4
                    }).format(cost * 1000000 * rate)}
                </span>
            )
        }
    }
]
