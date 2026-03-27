"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { getAuthToken } from "@/api/client"
import { Button } from "@/components/ui/button"

export type Document = {
    id: string;
    storageId: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    fileUrl?: string;
    isNew?: boolean;
    status?: string;
    processed_chunks?: number;
    total_chunks?: number;
}
const KONG_URL = import.meta.env.VITE_API_URL;
export const getColumns = (onDelete?: (id: string, name: string) => void): ColumnDef<Document>[] => [
    {
        accessorKey: "name",
        header: "Document Name",
        cell: ({ row }) => {
            const doc = row.original;
            return (
                <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                        {doc.name}
                    </span>
                    {doc.isNew && (
                        <Badge variant="soft" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0 rounded elevation-none">
                            New
                        </Badge>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const doc = row.original;
            const status = doc.status || 'pending';
            const processed = doc.processed_chunks || 0;
            const total = doc.total_chunks || 0;

            if (status === 'processing') {
                return (
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <div className="flex justify-between text-[10px] font-bold text-primary tabular-nums">
                            <span>Ingesting...</span>
                            <span>{total > 0 ? Math.round((processed / total) * 100) : 0}%</span>
                        </div>
                        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{ width: `${total > 0 ? (processed / total) * 100 : 0}%` }} 
                            />
                        </div>
                        <span className="text-[9px] text-muted-foreground">{processed}/{total} chunks</span>
                    </div>
                );
            }

            return (
                <Badge 
                    variant="soft" 
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        status === 'completed' ? 'bg-success/10 text-success border-success/20' : 
                        status === 'failed' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                        'bg-muted/30 text-muted-foreground'
                    }`}
                >
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return (
                <Badge variant="soft" className="text-[10px]">
                    {row.getValue("type")}
                </Badge>
            )
        }
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-foreground">{row.getValue("size")}</span>
            )
        }
    },
    {
        accessorKey: "uploadedAt",
        header: "Uploaded At",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-muted-foreground font-season-mix">
                    {row.getValue("uploadedAt")}
                </span>
            )
        }
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const docId = row.original.id;
            const docName = row.original.name;
            const storageId = row.original.storageId;
            const isNew = row.original.isNew;

            const token = getAuthToken();
            const viewUrl = `${KONG_URL}/backend/api/storage/view/${storageId}${token ? `?jwt=${token}` : ''}`;

            return (
                <div className="flex items-center gap-2 justify-end">
                    {!isNew && storageId && (
                        <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row items-center gap-1 text-sm text-primary hover:underline pr-2"
                        >
                            <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} /> View
                        </a>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(docId, docName)}
                        >
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    }
]

// Default export for backward compatibility if needed (using empty onDelete)
export const columns = getColumns();
