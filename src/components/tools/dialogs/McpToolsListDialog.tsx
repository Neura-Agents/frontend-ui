import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon, PlayIcon } from '@hugeicons/core-free-icons';
import type { McpServer, McpTool } from '@/services/mcpService';

interface McpToolsListDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    server: McpServer | null;
    tools: McpTool[];
    loading: boolean;
    onExecuteTool: (tool: McpTool) => void;
}

export const McpToolsListDialog: React.FC<McpToolsListDialogProps> = ({
    isOpen,
    onOpenChange,
    server,
    tools,
    loading,
    onExecuteTool
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Tools for {server?.server_name}</DialogTitle>
                    <DialogDescription>
                        Available tools from this MCP server. Click a tool to execute it.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <HugeiconsIcon icon={Refresh01Icon} className="size-8 text-primary animate-spin" />
                            <Typography className="text-muted-foreground animate-pulse">Fetching tool list...</Typography>
                        </div>
                    ) : tools.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
                            <Typography className="text-muted-foreground italic">No tools found on this server.</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {tools.map((tool) => (
                                <Card key={tool.name} className="transition-all group">
                                    <CardContent className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <Typography weight="semibold" scale="sm" className="truncate">{tool.name}</Typography>
                                            <Typography scale="xs" className="text-muted-foreground">{tool.description || 'No description available'}</Typography>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            iconOnly
                                            onClick={() => onExecuteTool(tool)}
                                            className="text-primary hover:bg-primary/10 shrink-0"
                                        >
                                            <HugeiconsIcon icon={PlayIcon} className="size-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
