import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toolsService } from '@/services/toolsService';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import axios from 'axios';
import { Alert01Icon, Link01Icon, Search02Icon, Add01Icon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { ToolCard, type Tool, type ToolParameter } from '@/components/tools/tool-card';
import { ExecuteToolDialog } from '@/components/tools/dialogs/ExecuteToolDialog';
import { CreateEditToolDialog } from '@/components/tools/dialogs/CreateEditToolDialog';
import { ImportToolsDialog } from '@/components/tools/dialogs/ImportToolsDialog';
import { IconPickerDialog } from '@/components/tools/dialogs/IconPickerDialog';
import { ConflictResolutionDialog, type ConflictItem } from '@/components/tools/dialogs/ConflictResolutionDialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useAlert } from '@/context/AlertContext';

const ToolsPage: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Create / Edit dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingToolId, setEditingToolId] = useState<string | null>(null);
    const [currentTool, setCurrentTool] = useState<Tool>({
        id: '',
        name: '',
        description: '',
        method: 'GET',
        baseUrl: '',
        path: '',
        authType: 'No Auth',
        authDetails: {},
        parameters: [],
        icon: '',
        visibility: 'private'
    });

    // Icon picker
    const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);
    const { showAlert } = useAlert();

    // Pagination / search
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalTools, setTotalTools] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');

    // URL Import
    const [isUrlImportDialogOpen, setIsUrlImportDialogOpen] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [previewJson, setPreviewJson] = useState('');
    const [previewFileName, setPreviewFileName] = useState('');

    // Conflict resolution
    const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
    const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
    const [pendingTools, setPendingTools] = useState<Tool[]>([]);
    const [resolvedNames, setResolvedNames] = useState<Set<string>>(new Set());

    // Test Tool
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
    const [testTool, setTestTool] = useState<Tool | null>(null);

    // ─── Debounce and URL Sync ───────────────────────────────────────────────────
    useEffect(() => {
        const queryFromUrl = searchParams.get('q') || '';
        if (queryFromUrl !== searchQuery) {
            setSearchQuery(queryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            fetchTools(1, searchQuery);

            // Update URL search params - functional way to avoid dependency cycle
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                if (searchQuery) next.set('q', searchQuery);
                else next.delete('q');
                if (next.toString() === prev.toString()) return prev;
                return next;
            }, { replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ─── Fetch ────────────────────────────────────────────────────────────────────
    const fetchTools = async (pageNum: number = currentPage, query: string = debouncedSearch) => {
        try {
            setLoading(true);
            const { tools: data, total, totalPages: pages } = await toolsService.getTools(
                pageNum,
                pageSize,
                query,
            );
            setTools(data);
            setTotalTools(total);
            setTotalPages(pages);
            setCurrentPage(pageNum);
        } catch {
            showAlert({ title: 'Error', description: 'Failed to fetch tools', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    // ─── File upload ──────────────────────────────────────────────────────────────
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                JSON.parse(content);
                setPreviewJson(content);
                setPreviewFileName(file.name);
            } catch {
                setError('Invalid JSON file. Please upload a valid OpenAPI spec.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // ─── URL import ───────────────────────────────────────────────────────────────
    const handleUrlImport = async () => {
        if (!importUrl.trim()) {
            setError('Please enter a valid URL.');
            return;
        }
        setIsImportLoading(true);
        setError(null);
        try {
            const response = await axios.get(importUrl);
            const content = JSON.stringify(response.data, null, 2);
            setPreviewJson(content);
            setPreviewFileName(importUrl.split('/').pop() || 'URL Import');
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Failed to fetch from URL. Ensure CORS is allowed.',
            );
        } finally {
            setIsImportLoading(false);
        }
    };

    const handleConfirmImport = async () => {
        try {
            const json = JSON.parse(previewJson);
            await processImport(json);
            setIsUrlImportDialogOpen(false);
            setPreviewJson('');
            setPreviewFileName('');
            setImportUrl('');
        } catch {
            setError('Failed to parse JSON for import.');
        }
    };

    // ─── Batch helpers ────────────────────────────────────────────────────────────
    const batchCreateTools = async (toolsToCreate: Tool[]) => {
        const BATCH_SIZE = 30;
        for (let i = 0; i < toolsToCreate.length; i += BATCH_SIZE) {
            await toolsService.createTool(toolsToCreate.slice(i, i + BATCH_SIZE));
        }
    };

    const batchCheckConflicts = async (toolsToCheck: Tool[]) => {
        const BATCH_SIZE = 30;
        let all: any[] = [];
        for (let i = 0; i < toolsToCheck.length; i += BATCH_SIZE) {
            const result = await toolsService.checkConflicts(toolsToCheck.slice(i, i + BATCH_SIZE));
            all = [...all, ...result];
        }
        return all;
    };

    // ─── Import processing ────────────────────────────────────────────────────────
    const processImport = async (data: any) => {
        const extracted = parseOpenApi(data);
        if (extracted.length === 0) {
            setError('No tools found in the uploaded JSON.');
            return;
        }
        try {
            setIsImportLoading(true);
            const backendConflicts = await batchCheckConflicts(extracted);
            if (backendConflicts.length > 0) {
                const mapped: ConflictItem[] = backendConflicts.map((c) => ({
                    existing: c.existing,
                    incoming: c.incoming as Tool,
                }));
                setConflicts(mapped);
                setPendingTools(extracted);
                setResolvedNames(new Set());
                setIsConflictDialogOpen(true);
            } else {
                await batchCreateTools(extracted);
                await fetchTools();
            }
        } catch {
            setError('Failed to process imports and check for conflicts.');
        } finally {
            setIsImportLoading(false);
        }
    };

    // ─── OpenAPI parser ───────────────────────────────────────────────────────────
    const parseOpenApi = (data: any): Tool[] => {
        const extractedTools: Tool[] = [];
        const paths = data.paths || {};
        const securitySchemes = data.components?.securitySchemes || {};
        const baseUrl = data.servers?.[0]?.url || '';

        const resolveRef = (ref: string) => {
            if (!ref || typeof ref !== 'string' || !ref.startsWith('#/')) return null;
            const parts = ref.split('/').slice(1);
            let current = data;
            for (const part of parts) {
                current = current?.[part];
                if (!current) break;
            }
            return current;
        };

        const parseSchema = (
            schema: any,
            name: string,
            location: 'query' | 'path' | 'header' | 'body',
        ): ToolParameter => {
            if (schema?.$ref) schema = resolveRef(schema.$ref);
            let rawType = schema?.type || 'string';
            if (Array.isArray(rawType)) rawType = rawType[0];
            let type = 'string';
            if (['number', 'integer'].includes(rawType)) type = 'number';
            else if (rawType === 'boolean') type = 'boolean';
            else if (rawType === 'object') type = 'object';
            else if (rawType === 'array') type = 'array';

            const param: ToolParameter = {
                name,
                in: location,
                required: false,
                type,
                description: schema?.description || '',
            };

            if (type === 'object' && schema.properties) {
                param.children = Object.entries(schema.properties).map(
                    ([propName, propSchema]: [string, any]) => {
                        const child = parseSchema(propSchema, propName, location);
                        child.required =
                            Array.isArray(schema.required) && schema.required.includes(propName);
                        return child;
                    },
                );
            } else if (type === 'array' && schema.items) {
                const itemsSchema = schema.items.$ref ? resolveRef(schema.items.$ref) : schema.items;
                let rawItemType = itemsSchema?.type || 'string';
                if (Array.isArray(rawItemType)) rawItemType = rawItemType[0];
                let itemType = 'string';
                if (['number', 'integer'].includes(rawItemType)) itemType = 'number';
                else if (rawItemType === 'boolean') itemType = 'boolean';
                else if (rawItemType === 'object') itemType = 'object';
                param.itemType = itemType;
                if (itemType === 'object') {
                    const dummy = parseSchema(itemsSchema, 'items', location);
                    param.children = dummy.children;
                }
            }
            return param;
        };

        Object.keys(paths).forEach((path) => {
            const methods = paths[path];
            Object.keys(methods).forEach((method) => {
                const details = methods[method];
                let authType = 'No Auth';
                const security = details.security || data.security || [];
                if (security.length > 0) {
                    const schemeKey = Object.keys(security[0])[0];
                    const scheme = securitySchemes[schemeKey];
                    if (scheme) {
                        if (scheme.type === 'apiKey') authType = 'apiKey';
                        else if (scheme.type === 'http' && scheme.scheme === 'bearer') authType = 'bearer';
                        else if (scheme.type === 'http' && scheme.scheme === 'basic') authType = 'basic';
                        else authType = scheme.type;
                    }
                }

                const parameters: ToolParameter[] = (details.parameters || []).map((p: any) => {
                    const resolvedParam = p.$ref ? resolveRef(p.$ref) : p;
                    const parsed = parseSchema(
                        resolvedParam.schema,
                        resolvedParam.name,
                        resolvedParam.in || 'query',
                    );
                    parsed.required = !!resolvedParam.required;
                    parsed.description = resolvedParam.description || parsed.description;
                    return parsed;
                });

                if (details.requestBody) {
                    const resolvedBody = details.requestBody.$ref
                        ? resolveRef(details.requestBody.$ref)
                        : details.requestBody;
                    const content =
                        resolvedBody.content?.['application/json'] ||
                        resolvedBody.content?.['*/*'] ||
                        (Object.values(resolvedBody.content || {}) as any[])[0];
                    if (content?.schema) {
                        const schema = content.schema.$ref
                            ? resolveRef(content.schema.$ref)
                            : content.schema;
                        if (schema?.type === 'object' && schema?.properties) {
                            Object.entries(schema.properties).forEach(
                                ([propName, propSchema]: [string, any]) => {
                                    const parsed = parseSchema(propSchema, propName, 'body');
                                    parsed.required =
                                        Array.isArray(schema.required) &&
                                        schema.required.includes(propName);
                                    parameters.push(parsed);
                                },
                            );
                        } else {
                            const bodyParam = parseSchema(schema, 'body', 'body');
                            bodyParam.required = !!resolvedBody.required;
                            parameters.push(bodyParam);
                        }
                    }
                }

                extractedTools.push({
                    id: crypto.randomUUID(),
                    name:
                        details.operationId ||
                        details.summary ||
                        `${method.toUpperCase()} ${path}`,
                    description: details.description || details.summary || 'No description.',
                    method: method.toUpperCase(),
                    baseUrl,
                    path,
                    authType,
                    authDetails: {},
                    parameters,
                    visibility: 'private'
                });
            });
        });

        return extractedTools;
    };

    // ─── Save / Delete / Edit ─────────────────────────────────────────────────────
    const handleSaveTool = async () => {
        if (!currentTool.name || !currentTool.path) {
            setError('Name and Path are required.');
            return;
        }
        try {
            if (editingToolId) {
                await toolsService.updateTool(editingToolId, currentTool);
            } else {
                await toolsService.createTool(currentTool);
            }
            await fetchTools();
            resetForm();
        } catch {
            setError('Failed to save tool. Please check your connection.');
        }
    };

    const resetForm = () => {
        setIsDialogOpen(false);
        setEditingToolId(null);
        setCurrentTool({
            id: '',
            name: '',
            description: '',
            method: 'GET',
            baseUrl: '',
            path: '',
            authType: 'No Auth',
            authDetails: {},
            parameters: [],
            icon: '',
            visibility: 'private'
        });
        setError(null);
    };

    const handleDeleteTool = async (id: string) => {
        try {
            await toolsService.deleteTool(id);
            if (tools.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                await fetchTools();
            }
        } catch {
            setError('Failed to delete tool.');
        }
    };

    const handleEditTool = (tool: Tool) => {
        setCurrentTool(tool);
        setEditingToolId(tool.id);
        setIsDialogOpen(true);
    };

    // ─── Conflict resolution ──────────────────────────────────────────────────────
    const handleConflictAction = async (
        action: 'replace' | 'skip',
        conflict: ConflictItem,
    ) => {
        setResolvedNames((prev) => new Set([...prev, conflict.incoming.name]));
        if (action === 'replace') {
            try {
                const updated = await toolsService.updateTool(conflict.existing.id, conflict.incoming);
                if (updated && !Array.isArray(updated)) {
                    setTools((prev) =>
                        prev.map((t) => (t.id === conflict.existing.id ? updated : t)),
                    );
                }
            } catch {
                setError(`Failed to replace tool: ${conflict.incoming.name}`);
                return;
            }
        }
        const remaining = conflicts.filter((c) => c !== conflict);
        setConflicts(remaining);
        if (remaining.length === 0) {
            await finalizeImport(new Set([...resolvedNames, conflict.incoming.name]));
        }
    };

    const handleReplaceAll = async () => {
        const newResolved = new Set(resolvedNames);
        for (const conflict of conflicts) {
            try {
                const updated = await toolsService.updateTool(conflict.existing.id, conflict.incoming);
                if (updated && !Array.isArray(updated)) {
                    setTools((prev) =>
                        prev.map((t) => (t.id === conflict.existing.id ? updated : t)),
                    );
                }
                newResolved.add(conflict.incoming.name);
            } catch {
                console.error(`Failed to replace tool: ${conflict.incoming.name}`);
            }
        }
        setConflicts([]);
        await finalizeImport(newResolved);
    };

    const handleSkipAll = async () => {
        const newResolved = new Set(resolvedNames);
        conflicts.forEach((c) => newResolved.add(c.incoming.name));
        setConflicts([]);
        await finalizeImport(newResolved);
    };

    const finalizeImport = async (resolved: Set<string>) => {
        setIsConflictDialogOpen(false);
        const toSave = pendingTools.filter((t) => !resolved.has(t.name));
        if (toSave.length > 0) {
            try {
                await batchCreateTools(toSave);
                await fetchTools();
            } catch {
                setError('Failed to save some imported tools.');
            }
        }
        setPendingTools([]);
        setResolvedNames(new Set());
    };

    // ─── Search ───────────────────────────────────────────────────────────────────
    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleOpenTest = (tool: Tool) => {
        setTestTool(tool);
        setIsTestDialogOpen(true);
    };

    // ─── Render ───────────────────────────────────────────────────────────────────
    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">Tools</Typography>
                <Typography variant="page-description">
                    Manage and organize your tools for the AI agent.
                </Typography>
            </section>

            <header className="mb-4 space-y-4 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search tools by name, path, or method..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="default"
                            className="rounded-full gap-2 h-10 px-5"
                            onClick={() => setIsUrlImportDialogOpen(true)}
                        >
                            <HugeiconsIcon icon={Link01Icon} />
                            Import JSON/URL
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 h-10"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <HugeiconsIcon icon={Add01Icon} />
                            Create Tool
                        </Button>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-10 w-10 shrink-0"
                                    onClick={() => fetchTools()}
                                    disabled={loading}
                                >
                                    <HugeiconsIcon icon={Refresh01Icon} className={loading ? "animate-spin" : ""} size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Refresh Tools</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {totalPages > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-6">
                        <Badge variant="soft">
                            {totalTools}
                        </Badge>
                        <span>tools found</span>
                        {totalPages > 1 && (
                            <span className="ml-auto text-primary/60">
                                Page {currentPage} of {totalPages}
                            </span>
                        )}
                    </div>
                )}
            </header>

            {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in">
                    <HugeiconsIcon icon={Alert01Icon} className="size-4 shrink-0" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden relative group border-border animate-pulse bg-card/30">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="h-7 w-1/2 bg-muted rounded" />
                                    <div className="h-8 w-24 bg-muted/40 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-muted/50 rounded" />
                                    <div className="h-4 w-5/6 bg-muted/50 rounded" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="h-10 w-full bg-muted/40 rounded-full" />
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-muted/40 rounded-full" />
                                        <div className="h-6 w-20 bg-muted/40 rounded-full" />
                                        <div className="h-6 w-16 bg-muted/40 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-20">
                    {totalTools === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center space-y-2">
                                <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                    {searchQuery ? 'No match found' : 'Ready to build your tools?'}
                                </Typography>
                                <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                    {searchQuery
                                        ? `We couldn't find any results for "${searchQuery}". Try a different search term or clear the filter.`
                                        : 'Create and manage your custom tools here to extend the capabilities of your AI agents.'}
                                </Typography>
                            </div>
                        </div>
                    ) : (
                        tools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                onEdit={handleEditTool}
                                onDelete={handleDeleteTool}
                                onTest={handleOpenTest}
                            />
                        ))
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                            setCurrentPage(p);
                            fetchTools(p, debouncedSearch);
                        }}
                        className="mt-4"
                    />
                </div>
            )}

            {/* ── Create / Edit Tool Dialog ── */}
            <CreateEditToolDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                tool={currentTool}
                onToolChange={setCurrentTool}
                isEditing={!!editingToolId}
                onSave={handleSaveTool}
                onCancel={resetForm}
                onOpenIconPicker={() => setIsIconDialogOpen(true)}
            />

            {/* ── Icon Picker Dialog ── */}
            <IconPickerDialog
                isOpen={isIconDialogOpen}
                onOpenChange={setIsIconDialogOpen}
                selectedIcon={currentTool.icon || ''}
                onSelect={(name) => setCurrentTool({ ...currentTool, icon: name })}
            />

            {/* ── Import JSON/URL Dialog ── */}
            <ImportToolsDialog
                isOpen={isUrlImportDialogOpen}
                onOpenChange={setIsUrlImportDialogOpen}
                importUrl={importUrl}
                onImportUrlChange={setImportUrl}
                previewFileName={previewFileName}
                onPreviewFileNameChange={setPreviewFileName}
                previewJson={previewJson}
                onPreviewJsonChange={setPreviewJson}
                isImportLoading={isImportLoading}
                onFetchUrl={handleUrlImport}
                onConfirmImport={handleConfirmImport}
                onFileUpload={handleFileUpload}
            />

            {/* ── Conflict Resolution Dialog ── */}
            <ConflictResolutionDialog
                isOpen={isConflictDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setConflicts([]);
                        setIsConflictDialogOpen(false);
                    } else {
                        setIsConflictDialogOpen(true);
                    }
                }}
                conflicts={conflicts}
                onSkipCurrent={() => handleConflictAction('skip', conflicts[0])}
                onReplaceCurrent={() => handleConflictAction('replace', conflicts[0])}
                onSkipAll={handleSkipAll}
                onReplaceAll={handleReplaceAll}
            />

            {/* ── Execute / Test Tool Dialog ── */}
            <ExecuteToolDialog
                isOpen={isTestDialogOpen}
                onOpenChange={setIsTestDialogOpen}
                tool={testTool}
                onExecute={async (_name, params) => {
                    if (!testTool) return;
                    // executeTool called via toolsService using the correct signature
                    const { toolsService: importedToolsService } = await import('@/services/toolsService');
                    return importedToolsService.executeTool(testTool.name, params);
                }}
            />
        </div>
    );
};

export default ToolsPage;
