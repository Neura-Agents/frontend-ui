"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ColumnDef } from "@tanstack/react-table"
import type { FeatureFlag } from "@/services/platformService"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Typography } from "@/components/ui/typography"

export const getColumns = (
    onToggle: (feature: FeatureFlag) => void,
    onEdit: (feature: FeatureFlag) => void
): ColumnDef<FeatureFlag>[] => [
        {
            accessorKey: "name",
            header: "Feature Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <Typography scale="sm">{row.original.name}</Typography>
                    <Typography scale="xs" className="text-muted-foreground max-w-[200px]">{row.original.description}</Typography>
                </div>
            )
        },
        {
            accessorKey: "key",
            header: "Key",
            cell: ({ row }) => <Badge variant="soft">{row.original.key}</Badge>
        },
        {
            accessorKey: "enabled",
            header: "Status",
            cell: ({ row }) => (
                <Switch
                    checked={row.original.enabled}
                    onCheckedChange={() => onToggle(row.original)}
                />
            )
        },
        {
            accessorKey: "targeting_rules",
            header: "Targeting",
            cell: ({ row }) => {
                const rules = row.original.targeting_rules;
                const hasUsers = rules.users?.length > 0;
                const hasRoles = rules.roles?.length > 0;
                const percentage = rules.percentage ?? 100;

                return (
                    <div className="flex flex-col gap-1">
                        {percentage < 100 && <Badge variant="soft">{percentage}% Rollout</Badge>}
                        {hasUsers && <Badge variant="warning">{rules.users.length} Users</Badge>}
                        {hasRoles && <Badge variant="success">{rules.roles.length} Roles</Badge>}
                        {!hasUsers && !hasRoles && percentage === 100 && <Badge variant="secondary">Global</Badge>}
                    </div >
                )
            }
        },
        {
            accessorKey: "updated_at",
            header: "Last Modified",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{format(new Date(row.original.updated_at), "MMM d, HH:mm")}</span>
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-primary/10 text-xs font-normal"
                    onClick={() => onEdit(row.original)}
                >
                    <HugeiconsIcon icon={Settings01Icon} size={14} />
                </Button>
            )
        }
    ]
