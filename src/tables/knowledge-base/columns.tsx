"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Delete02Icon, Loading03Icon } from "@hugeicons/core-free-icons"
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
export const getColumns = (
    onDelete?: (id: string, name: string) => void, 
    isOwner: boolean = false,
    parentProcessing: boolean = false
): ColumnDef<Document>[] => [
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

            const getVariant = (s: string) => {
                switch (s) {
                    case 'completed': return 'success';
                    case 'failed': return 'destructive';
                    case 'processing': return 'soft';
                    default: return 'soft';
                }
            };

            return (
                <Badge 
                    variant={getVariant(status)} 
                    className="text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit"
                >
                    {status === 'processing' && (
                         <HugeiconsIcon icon={Loading03Icon} size={10} className="animate-spin" />
                    )}
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
                    {isOwner && onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={parentProcessing}
                            className={`h-8 w-8 text-destructive hover:bg-destructive/10 ${parentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !parentProcessing && onDelete(docId, docName)}
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
