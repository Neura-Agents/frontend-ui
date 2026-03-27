"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router-dom"

export type User = {
    keycloak_id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-foreground">{row.getValue("email")}</span>
            )
        }
    },
    {
        accessorKey: "keycloak_id",
        header: "Keycloak ID",
        cell: ({ row }) => {
            return (
                <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    {row.getValue("keycloak_id")}
                </code>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string;
            return (
                <span className="text-sm text-muted-foreground font-season-mix">
                    {format(new Date(date), 'MMM dd, yyyy')}
                </span>
            )
        }
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const url = `${KEYCLOAK_URL}/admin/master/console/#/${KEYCLOAK_REALM}/users/` + row.original.keycloak_id;
            return (
                <Link
                    to={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center gap-1"
                >
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} /> View
                </Link>
            )
        }
    }
]
