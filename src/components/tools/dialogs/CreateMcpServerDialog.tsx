import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Tick01Icon,
    Refresh01Icon,
    Shield01Icon,
    InformationCircleIcon
} from '@hugeicons/core-free-icons';
import { Typography } from '@/components/ui/typography';
import { mcpService, type McpTool } from '@/services/mcpService';
import { useAlert } from '@/context/AlertContext';
import { Badge } from '@/components/ui/badge';
import { InputField } from '@/components/ui/input-field';
import { VisibilitySelector } from '@/components/reusable/VisibilitySelector';

interface CreateMcpServerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    initialData?: any; // To support edit mode
}

export const CreateMcpServerDialog: React.FC<CreateMcpServerDialogProps> = ({
    isOpen,
    onOpenChange,
    onSuccess,
    initialData
}) => {
    const isEdit = !!initialData;
    const { showAlert } = useAlert();
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [isAliasAuto, setIsAliasAuto] = useState(true);
    const [description, setDescription] = useState('');
    const [transport, setTransport] = useState('http');
    const [url, setUrl] = useState('');
    const [authType, setAuthType] = useState('none');
    const [visibility, setVisibility] = useState<'public' | 'private'>('private');

    // Tools management
    const [availableTools, setAvailableTools] = useState<McpTool[]>([]);
    const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
    const [isTesting, setIsTesting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchToolsForEdit = async (serverId: string) => {
            setIsTesting(true);
            try {
                const tools = await mcpService.getTools(serverId);
                setAvailableTools(tools);
                setSelectedTools(new Set(tools.map(t => t.name)));
            } catch (err) {
                console.error("Failed to fetch tools for edit", err);
            } finally {
                setIsTesting(false);
            }
        };

        if (isOpen && initialData) {
            setName(initialData.server_name || '');
            setAlias(initialData.alias || '');
            setIsAliasAuto(false);
            setDescription(initialData.description || '');
            setTransport(initialData.transport || 'http');
            setUrl(initialData.url || '');
            setAuthType(initialData.auth_type || 'none');
            setVisibility(initialData.visibility || 'private');

            // If we have local tools, show them
            if (initialData.tools && initialData.tools.length > 0) {
                setAvailableTools(initialData.tools);
                setSelectedTools(new Set(initialData.tools.map((t: any) => t.name)));
            } else if (initialData.server_id) {
                fetchToolsForEdit(initialData.server_id);
            }
        }
    }, [isOpen, initialData]);

    // Auto-reset when dialog CLOSES and wasn't successful
    useEffect(() => {
        if (!isOpen) {
            // Delay reset slightly to avoid flickering during close animation
            const timer = setTimeout(resetForm, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleGetTools = async () => {
        if (!url.trim()) {
            showAlert({ title: 'Error', description: 'Please enter a valid MCP Server URL', variant: 'destructive' });
            return;
        }

        setIsTesting(true);
        try {
            const tools = await mcpService.testTools({
                server_name: name || url,
                url,
                transport,
                auth_type: authType
            });

            setAvailableTools(tools);
            const toolNames = new Set(tools.map(t => t.name));
            setSelectedTools(toolNames); // Select all by default

            showAlert({
                title: 'Success',
                description: `Successfully fetched ${tools.length} tools.`,
                variant: 'success'
            });
        } catch (error: any) {
            showAlert({
                title: 'Failed to fetch tools',
                description: error.response?.data?.message || error.message || 'Check the URL and transport settings.',
                variant: 'destructive'
            });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = async () => {
        if (!url.trim()) return;

        setIsSaving(true);
        try {
            const payload = {
                transport,
                url,
                auth_type: authType,
                mcp_info: {
                    server_name: name || url,
                    description: description,
                    mcp_server_cost_info: null
                },
                allowed_tools: Array.from(selectedTools),
                disallowed_tools: [],
                mcp_access_groups: [],
                extra_headers: [],
                visibility: visibility,
                server_id: initialData?.server_id,
                alias: alias,
                server_name: name || url,
                description: description
            };

            if (isEdit) {
                await mcpService.updateMcpServer(payload);
                showAlert({ title: 'Success', description: 'MCP Server updated successfully', variant: 'success' });
            } else {
                await mcpService.createMcpServer(payload);
                showAlert({ title: 'Success', description: 'MCP Server added successfully', variant: 'success' });
            }

            onSuccess();
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            showAlert({
                title: 'Error',
                description: error.response?.data?.message || error.message || `Failed to ${isEdit ? 'update' : 'add'} MCP server.`,
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setName('');
        setAlias('');
        setIsAliasAuto(true);
        setDescription('');
        setTransport('http');
        setUrl('');
        setAuthType('none');
        setVisibility('private');
        setAvailableTools([]);
        setSelectedTools(new Set());
    };

    const handleNameChange = (newName: string) => {
        setName(newName);
        if (isAliasAuto) {
            setAlias(newName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
        }
    };

    const handleAliasChange = (newAlias: string) => {
        setAlias(newAlias);
        setIsAliasAuto(false);
    };

    const toggleTool = (toolName: string) => {
        const next = new Set(selectedTools);
        if (next.has(toolName)) next.delete(toolName);
        else next.add(toolName);
        setSelectedTools(next);
    };

    const toggleAllTools = () => {
        if (selectedTools.size === availableTools.length) {
            setSelectedTools(new Set());
        } else {
            setSelectedTools(new Set(availableTools.map(t => t.name)));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <DialogTitle>{isEdit ? 'Edit MCP Server' : 'Add MCP Server'}</DialogTitle>
                            <DialogDescription>
                                {isEdit ? 'Update existing registration for this MCP server.' : 'Configure and register a new Model Context Protocol server.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1 space-y-6 ">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="MCP Server Name"
                                placeholder="e.g. GitHub_MCP, Zapier_MCP"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                            <InputField
                                label="Alias"
                                placeholder="Short identifier"
                                value={alias}
                                onChange={(e) => handleAliasChange(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-muted-foreground/80">Transport Type</label>
                                <Select value={transport} onValueChange={setTransport}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select transport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="http">HTTP</SelectItem>
                                        <SelectItem value="sse">SSE (Server-Sent Events)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-muted-foreground/80">Authentication</label>
                                <Select value={authType} onValueChange={setAuthType}>
                                    <SelectTrigger className="h-11">
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={Shield01Icon} size={14} className="text-muted-foreground" />
                                            <SelectValue placeholder="Select auth" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="api_key">API Key</SelectItem>
                                        <SelectItem value="bearer_token">Bearer Token</SelectItem>
                                        <SelectItem value="basic_auth">Basic Auth</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <InputField
                            label="MCP Server URL"
                            placeholder="https://mcp.deepwiki.com/mcp"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-muted-foreground/80">Description</label>
                            <Textarea
                                placeholder="Brief description of what this server does..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[80px] rounded-xl border-border/60 hover:border-border focus:border-primary/50"
                            />
                        </div>

                        <VisibilitySelector
                            value={visibility}
                            onChange={setVisibility}
                        />
                    </div>

                    <div className="pt-4 border-t border-dashed border-border/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Typography weight="semibold" className="text-sm">Capability Discovery</Typography>
                                {availableTools.length > 0 && (
                                    <Badge variant="soft" className="rounded-full bg-primary/10 text-primary border-primary/20">
                                        {availableTools.length} Tools Found
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 h-9 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                                onClick={handleGetTools}
                                disabled={isTesting || !url}
                            >
                                <HugeiconsIcon icon={Refresh01Icon} size={16} className={isTesting ? 'animate-spin' : ''} />
                                {isTesting ? 'Discovering...' : 'Get Tools'}
                            </Button>
                        </div>

                        {availableTools.length > 0 ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="flex items-center justify-between">
                                    <Typography scale="sm" className="text-muted-foreground italic">
                                        Select the tools you want to authorize for this AI.
                                    </Typography>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-7 px-2 hover:bg-primary/10"
                                        onClick={toggleAllTools}
                                    >
                                        {selectedTools.size === availableTools.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableTools.map((tool) => (
                                        <div
                                            key={tool.name}
                                            onClick={() => toggleTool(tool.name)}
                                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${selectedTools.has(tool.name)
                                                ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                                                : 'bg-muted/5 border-border/40 hover:border-border hover:bg-muted/10'
                                                }`}
                                        >
                                            <div className={`mt-0.5 size-4 rounded flex items-center justify-center border transition-all ${selectedTools.has(tool.name)
                                                ? 'bg-primary border-primary text-primary-foreground'
                                                : 'border-border/60 group-hover:border-primary/40'
                                                }`}>
                                                {selectedTools.has(tool.name) && <HugeiconsIcon icon={Tick01Icon} size={10} />}
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                <Typography weight="medium" scale="sm" className="truncate block">{tool.name}</Typography>
                                                {tool.description && (
                                                    <Typography scale="xs" className="text-muted-foreground line-clamp-2">
                                                        {tool.description}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : !isTesting && (
                            <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border-2 border-dashed border-border/40 bg-muted/5">
                                <div className="size-12 rounded-full bg-muted/10 flex items-center justify-center mb-3">
                                    <HugeiconsIcon icon={InformationCircleIcon} size={24} className="text-muted-foreground opacity-50" />
                                </div>
                                <Typography className="text-muted-foreground max-w-[300px]" scale="sm">
                                    Discovery allows you to inspect and authorize specific tools before adding the server.
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t border-border/60">
                    <Button variant="ghost" className='rounded-full' onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="default"
                        className='rounded-full'
                        onClick={handleSave}
                        disabled={isSaving || !url || (availableTools.length > 0 && selectedTools.size === 0)}
                    >
                        {isEdit ? 'Save Changes' : 'Add MCP Server'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
