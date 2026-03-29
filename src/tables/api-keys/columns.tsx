"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon, Refresh01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export type ApiKey = {
    id: string
    name: string
    key_prefix: string
    last_four: string
    status: 'active' | 'revoked'
    is_default: boolean
    created_at: string
}

export const getColumns = (
    onRotate: (id: string) => void,
    onDelete: (id: string) => void
): ColumnDef<ApiKey>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium">
                <span>{row.original.name}</span>
                {row.original.is_default && (
                    <Badge variant="soft" className="text-[10px] py-0 px-1 opacity-70">Default</Badge>
                )}
            </div>
        )
    },
    {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => {
            const { key_prefix, last_four } = row.original
            return (
                <div className="font-mono text-sm opacity-80">
                    <code>{key_prefix}••••{last_four}</code>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge variant={status === 'active' ? 'outline' : 'secondary'}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            try {
                return format(new Date(row.original.created_at), "MMM d, yyyy")
            } catch (e) {
                return row.original.created_at
            }
        }
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const api_key_id = row.original.id;
            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" iconOnly>
                                <HugeiconsIcon icon={MoreHorizontalIcon} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => onRotate(api_key_id)} className="gap-2">
                                <HugeiconsIcon icon={Refresh01Icon} size={16} />
                                Rotate Key
                            </DropdownMenuItem>
                            {!row.original.is_default && (
                                <DropdownMenuItem 
                                    onClick={() => onDelete(api_key_id)} 
                                    className="gap-2 text-destructive focus:text-destructive"
                                >
                                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                                    Revoke Key
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]