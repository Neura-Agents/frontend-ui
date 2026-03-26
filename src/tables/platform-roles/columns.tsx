"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import type { Role } from "@/services/platformService"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Role>[] = [
    {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20 text-primary font-medium">
                        {name}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-muted-foreground">
                    {row.getValue("description") || "No description provided"}
                </span>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string;
            return (
                <span className="text-sm text-muted-foreground font-season-mix">
                    {format(new Date(date), 'MMM dd, yyyy')}
                </span>
            )
        }
    }
]
