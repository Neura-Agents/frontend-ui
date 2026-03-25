"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpRight01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ApiKey = {
    id: string
    name: string
    key: string
    created: string
}

export const columns: ColumnDef<ApiKey>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => {
            const key = row.getValue("key") as string
            return (
                <Badge variant="soft">{key}</Badge>
            )
        }
    },
    {
        accessorKey: "created",
        header: "Created",
    },
    {
        accessorKey: "usage_url",
        header: "Usage",
        cell: ({ row }) => {
            const url = '/usage?source=api&api_key=' + row.original.id;
            return (
                <Link
                    to={url}
                    className="flex flex-row items-center gap-1"
                >
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} /> View
                </Link>
            )
        }
    },
    {
        accessorKey: "action",
        header: "",
        cell: ({ row }) => {
            const api_key_id = row.original.id;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" iconOnly>
                            <HugeiconsIcon icon={MoreHorizontalIcon} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => { console.log("Rename", api_key_id) }}>
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { console.log("Delete", api_key_id) }}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export const data: ApiKey[] = [
    {
        id: "1c94ec4a-2a93-4308-b39b-d6bcd0246223",
        name: "API Key 1",
        key: "[ENCRYPTION_KEY]",
        created: "2022-01-01"
    },
    {
        id: "1c94ec4b-2a93-4308-b39b-d6bcd0246223",
        name: "API Key 2",
        key: "[ENCRYPTION_KEY]",
        created: "2022-01-01"
    },
    {
        id: "1c94ec4c-2a93-4308-b39b-d6bcd0246223",
        name: "API Key 3",
        key: "[ENCRYPTION_KEY]",
        created: "2022-01-01"
    },
    {
        id: "1c94ec4d-2a93-4308-b39b-d6bcd0246223",
        name: "API Key 4",
        key: "[ENCRYPTION_KEY]",
        created: "2022-01-01"
    },
    {
        id: "1c94ec4e-2a93-4308-b39b-d6bcd0246223",
        name: "API Key 5",
        key: "[ENCRYPTION_KEY]",
        created: "2022-01-01"
    },
]