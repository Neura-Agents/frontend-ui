import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Refresh01Icon, Alert01Icon, ArrowRight01Icon, Search02Icon, LockedIcon, Globe02Icon, PencilEdit01Icon, Delete02Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAlert } from '@/context/AlertContext';
import { mcpService, type McpServer, type McpTool } from '@/services/mcpService';
import { Input } from '@/components/ui/input';
import { ExecuteToolDialog } from '@/components/tools/dialogs/ExecuteToolDialog';
import { McpToolsListDialog } from '@/components/tools/dialogs/McpToolsListDialog';
import { CreateMcpServerDialog } from '@/components/tools/dialogs/CreateMcpServerDialog';
import { CodeBlock } from '@/components/ui/code-block';
import Pagination from '@/components/ui/pagination';
import { useAuth } from '@/context/AuthContext';
import { DestructiveConfirmDialog } from '@/components/reusable/DestructiveConfirmDialog';

const MCPPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [servers, setServers] = useState<McpServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');
    const { hasRole, user } = useAuth();

    // Tools List States
    const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);
    const [tools, setTools] = useState<McpTool[]>([]);
    const [toolsLoading, setToolsLoading] = useState(false);
    const [isToolsDialogOpen, setIsToolsDialogOpen] = useState(false);

    // Execute Tool States
    const [executingTool, setExecutingTool] = useState<McpTool | null>(null);
    const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false);

    // Create/Edit MCP Server States
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<McpServer | null>(null);

    // Delete Confirmation States
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [serverToDelete, setServerToDelete] = useState<McpServer | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { showAlert } = useAlert();

    const fetchServers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mcpService.getServers({
                query: debouncedSearch,
                page,
                limit
            });
            setServers(data.mcp_servers);
            setTotalItems(data.total);
        } catch (err: any) {
            setError(err.message || "Failed to fetch MCP servers");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page, limit]);

    useEffect(() => {
        fetchServers();
    }, [fetchServers]);

    // Handle search debounce and URL sync
    useEffect(() => {
        const queryFromUrl = searchParams.get('q') || '';
        if (queryFromUrl !== searchQuery) {
            setSearchQuery(queryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
            
            // Update URL search params
            if (searchQuery) {
                setSearchParams({ q: searchQuery }, { replace: true });
            } else {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams, { replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, setSearchParams]);

    const handleExploreTools = async (server: McpServer) => {
        setSelectedServer(server);
        setToolsLoading(true);
        setIsToolsDialogOpen(true);
        try {
            const data = await mcpService.getTools(server.server_id);
            setTools(data);
        } catch (err: any) {
            console.error("Failed to fetch tools", err);
        } finally {
            setToolsLoading(false);
        }
    };

    const handleOpenExecute = (tool: McpTool) => {
        setExecutingTool(tool);
        setIsExecuteDialogOpen(true);
    };

    const handleEdit = (server: McpServer) => {
        setEditingServer(server);
        setIsCreateDialogOpen(true);
    };

    const handleDeleteClick = (server: McpServer) => {
        setServerToDelete(server);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!serverToDelete) return;

        setDeleteLoading(true);
        try {
            await mcpService.deleteMcpServer(serverToDelete.server_id);
            showAlert({ title: 'Success', description: 'MCP Server deleted successfully', variant: 'success' });
            fetchServers();
            setIsDeleteDialogOpen(false);
        } catch (err: any) {
            showAlert({ title: 'Error', description: err.message || 'Failed to delete MCP server', variant: 'destructive' });
        } finally {
            setDeleteLoading(false);
            setServerToDelete(null);
        }
    };

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Model Context Protocol (MCP)
                </Typography>
                <Typography variant="page-description">
                    Manage your AI context through the Model Context Protocol.
                </Typography>
            </section>
            <header className="mb-4 space-y-4 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search by name or id..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        {
                            hasRole("platform-admin") && (
                                < Button
                                    variant="default"
                                    className="rounded-full gap-2 h-10 px-6"
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const { success, serverCount, toolCount } = await mcpService.syncTools();
                                            if (success) {
                                                fetchServers();
                                                alert(`Sync completed: ${serverCount} servers and ${toolCount} tools synced.`);
                                            }
                                        } catch (e: any) {
                                            alert(`Sync failed: ${e.message}`);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    <HugeiconsIcon icon={Refresh01Icon} className={loading ? "animate-spin" : ""} size={18} />
                                    Sync with AI Gateway
                                </Button>)
                        }
                        <Button
                            variant="default"
                            className="rounded-full gap-2 h-10 px-5"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <HugeiconsIcon icon={Add01Icon} size={18} />
                            Add MCP Server
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10"
                            onClick={() => fetchServers()}
                            disabled={loading}
                        >
                            <HugeiconsIcon icon={Refresh01Icon} className={loading ? "animate-spin" : ""} size={18} />
                        </Button>
                    </div>

                </div>

                {
                    totalItems > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-6">
                            <Badge variant="soft">
                                {totalItems}
                            </Badge>
                            <span>MCP servers found</span>
                            {Math.ceil(totalItems / limit) > 1 && (
                                <span className="ml-auto text-primary/60">
                                    Page {page} of {Math.ceil(totalItems / limit)}
                                </span>
                            )}
                        </div>
                    )
                }
            </header >

            {
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2" >
                        {
                            [1, 2, 3].map(i => (
                                <Card key={i} className="animate-pulse bg-card border-border/60">
                                    <CardHeader className="h-24 bg-muted/20"></CardHeader>
                                    <CardContent className="h-40"></CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : error ? (
                    <div className="p-10 border border-destructive/20 rounded-xl flex flex-col items-center justify-center bg-destructive/5 space-y-4">
                        <HugeiconsIcon icon={Alert01Icon} className="text-destructive size-10" />
                        <Typography className="text-destructive font-medium">{error}</Typography>
                        <Button variant="outline" onClick={fetchServers}>Try Again</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-20">
                        {servers.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="text-center space-y-2">
                                    <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                        {searchQuery ? 'No match found' : 'Ready to connect your MCP servers?'}
                                    </Typography>
                                    <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                        {searchQuery
                                            ? `We couldn't find any results for "${searchQuery}". Try a different search term or clear the filter.`
                                            : 'Register and manage your Model Context Protocol servers here to provide external tools to your AI agents.'}
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            servers.map((server, idx) => (
                                <Card key={server.server_id || idx} className="flex flex-col h-full group border-border hover:border-primary/30 transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl">{server.server_name || 'Unnamed Server'}</CardTitle>
                                                <CardDescription className="text-sm">{server.description || 'No description provided.'}</CardDescription>
                                            </div>
                                            {server.user_id === user?.id && (
                                                <div className="flex gap-1">
                                                    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                                    onClick={() => handleEdit(server)}
                                                                >
                                                                    <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit Server</p>
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 rounded-full hover:bg-destructive/20 hover:text-destructive"
                                                                    onClick={() => handleDeleteClick(server)}
                                                                >
                                                                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Delete Server</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="mt-auto">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-1">
                                                <Typography className="text-xs text-muted-foreground">Server Id</Typography>
                                                <CodeBlock>{server.server_id || 'N/A'}</CodeBlock>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Typography className="text-xs text-muted-foreground">Endpoint URL</Typography>
                                                <CodeBlock>{server.url || 'No endpoint configured'}</CodeBlock>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Typography className="text-xs text-muted-foreground">Transport & Visibility</Typography>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="soft">{server.transport || 'N/A'}</Badge>
                                                    <Badge variant="outline" className="capitalize py-0.5 px-2.5 rounded-full border-border/60">
                                                        {server.visibility === 'public' ? (
                                                            <div className="flex items-center gap-1">
                                                                <HugeiconsIcon icon={Globe02Icon} size={12} />
                                                                <span>Public</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <HugeiconsIcon icon={LockedIcon} size={12} />
                                                                <span>Private</span>
                                                            </div>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full rounded-full group/btn"
                                                variant="secondary"
                                                onClick={() => handleExploreTools(server)}
                                            >
                                                Explore Tools
                                                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

            {totalItems > 0 && servers.length > 0 && Math.ceil(totalItems / limit) > 1 && (
                <div className="mt-12">
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(totalItems / limit)}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Tools List Dialog */}
            <McpToolsListDialog
                isOpen={isToolsDialogOpen}
                onOpenChange={setIsToolsDialogOpen}
                server={selectedServer}
                tools={tools}
                loading={toolsLoading}
                onExecuteTool={handleOpenExecute}
            />

            {/* Execute Tool Dialog */}
            <ExecuteToolDialog
                isOpen={isExecuteDialogOpen}
                onOpenChange={setIsExecuteDialogOpen}
                tool={executingTool}
                onExecute={async (name, params) => await mcpService.callTool(name, params)}
                title={`Execute Tool: ${executingTool?.name}`}
                description="Enter parameters to call the MCP tool and see the response."
            />

            <CreateMcpServerDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={(open) => {
                    setIsCreateDialogOpen(open);
                    if (!open) setEditingServer(null);
                }}
                initialData={editingServer}
                onSuccess={() => {
                    fetchServers();
                    setIsCreateDialogOpen(false);
                }}
            />

            <DestructiveConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete MCP Server"
                description={`Are you sure you want to delete "${serverToDelete?.server_name}"? This action will remove the server and all its associated tools. This cannot be undone.`}
                onConfirm={handleConfirmDelete}
                confirmText="Delete Server"
                isLoading={deleteLoading}
            />
        </div >
    );
};

export default MCPPage;
