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
        cell: ({ row }) => {
            const cost = row.getValue("cost_input") as number;
            return (
                <span className="text-sm font-medium text-foreground">
                    ${(cost * 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
            )
        }
    },
    {
        accessorKey: "cost_output",
        header: "Output / 1M",
        cell: ({ row }) => {
            const cost = row.getValue("cost_output") as number;
            return (
                <span className="text-sm font-medium text-foreground">
                    ${(cost * 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
            )
        }
    }
]
