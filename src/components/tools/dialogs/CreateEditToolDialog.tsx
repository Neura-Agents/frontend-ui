import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon, PlusSignIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { InputField } from '@/components/ui/input-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import * as AllIcons from '@hugeicons/core-free-icons';
import type { Tool, ToolParameter } from '@/components/tools/tool-card';
import { VisibilitySelector } from '@/components/reusable/VisibilitySelector';

interface CreateEditToolDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    tool: Tool;
    onToolChange: (tool: Tool) => void;
    isEditing: boolean;
    onSave: () => void;
    onCancel: () => void;
    onOpenIconPicker: () => void;
}

export const CreateEditToolDialog: React.FC<CreateEditToolDialogProps> = ({
    isOpen,
    onOpenChange,
    tool,
    onToolChange,
    isEditing,
    onSave,
    onCancel,
    onOpenIconPicker,
}) => {
    // ─── Parameter Helpers ──────────────────────────────────────────────────────

    const addParameter = (parentPath?: number[]) => {
        const newParam: ToolParameter = {
            name: '',
            in: 'query',
            required: false,
            type: 'string',
            description: '',
        };
        const newTool = { ...tool };
        if (!parentPath) {
            newTool.parameters = [...newTool.parameters, newParam];
        } else {
            let current = newTool.parameters;
            for (let i = 0; i < parentPath.length; i++) {
                if (!current[parentPath[i]].children) current[parentPath[i]].children = [];
                if (i === parentPath.length - 1) {
                    current[parentPath[i]].children!.push({ ...newParam, in: current[parentPath[i]].in });
                } else {
                    current = current[parentPath[i]].children!;
                }
            }
        }
        onToolChange(newTool);
    };

    const removeParameter = (path: number[]) => {
        const newTool = { ...tool };
        if (path.length === 1) {
            newTool.parameters.splice(path[0], 1);
        } else {
            let current = newTool.parameters;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]].children!;
            }
            current.splice(path[path.length - 1], 1);
        }
        onToolChange(newTool);
    };

    const updateParameter = (path: number[], field: keyof ToolParameter, value: any) => {
        const newTool = { ...tool };
        let current = newTool.parameters;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children!;
        }
        (current[path[path.length - 1]] as any)[field] = value;

        if (field === 'type' && value !== 'object') {
            current[path[path.length - 1]].children = [];
        }
        if (field === 'type' && value !== 'array') {
            current[path[path.length - 1]].itemType = undefined;
        }
        onToolChange(newTool);
    };

    // ─── Parameter Item Renderer ────────────────────────────────────────────────

    const renderParameterItem = (param: ToolParameter, path: number[]): React.ReactNode => {
        return (
            <div
                key={path.join('-')}
                className={`p-4 border rounded-xl bg-card relative group animate-in fade-in slide-in-from-top-2 ${path.length > 1 ? 'ml-6 mt-4 border-l-4 border-l-primary/30' : ''
                    }`}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => removeParameter(path)}
                >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                </Button>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField
                        label="Name"
                        placeholder="Parameter name"
                        value={param.name}
                        onChange={(e) => updateParameter(path, 'name', e.target.value)}
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground/80">Location</label>
                        <Select
                            value={param.in}
                            disabled={path.length > 1}
                            onValueChange={(val: any) => updateParameter(path, 'in', val)}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="query">Query</SelectItem>
                                <SelectItem value="header">Header</SelectItem>
                                <SelectItem value="path">Path</SelectItem>
                                <SelectItem value="body">Body</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground/80">Type</label>
                        <Select
                            value={param.type}
                            onValueChange={(val: any) => updateParameter(path, 'type', val)}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="object">Object</SelectItem>
                                <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {param.type === 'array' && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2">
                            <label className="text-sm font-medium text-muted-foreground/80">Item Type</label>
                            <Select
                                value={param.itemType}
                                onValueChange={(val: any) => updateParameter(path, 'itemType', val)}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="string">String</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                    <SelectItem value="object">Object</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-center gap-3 h-10 px-1">
                        <Checkbox
                            checked={param.required}
                            onCheckedChange={(checked) => updateParameter(path, 'required', checked)}
                        />
                        <label htmlFor={`req-${path.join('-')}`} className="text-sm font-medium cursor-pointer">
                            Required
                        </label>
                    </div>
                </div>

                <div className="mt-4">
                    <InputField
                        label="Description"
                        placeholder="What is this parameter used for?"
                        value={param.description || ''}
                        onChange={(e) => updateParameter(path, 'description', e.target.value)}
                    />
                </div>

                {param.type === 'object' && (
                    <div className="mt-4 pt-4 border-t border-dashed border-border/60 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-3">
                            <Typography
                                scale="sm"
                                weight="medium"
                                className="text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]"
                            >
                                <HugeiconsIcon icon={PlayIcon} className="size-3" />
                                Object Properties
                            </Typography>
                            <Button
                                variant="outline"
                                size="xs"
                                className="h-7 text-[10px] py-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                                onClick={() => addParameter(path)}
                            >
                                <HugeiconsIcon icon={PlusSignIcon} className="mr-1 size-3" />
                                Add Sub-Property
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {param.children?.length
                                ? param.children.map((child, childIndex) =>
                                    renderParameterItem(child, [...path, childIndex])
                                )
                                : (
                                    <div className="py-4 text-center border-2 border-dashed rounded-xl bg-muted/5 border-border/40">
                                        <Typography className="text-[10px] text-muted-foreground italic">
                                            No properties added yet.
                                        </Typography>
                                    </div>
                                )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); else onOpenChange(open); }}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Tool' : 'Add Tool Manually'}</DialogTitle>
                    <DialogDescription>
                        Configure API details, authentication, and parameters.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col p-6 pt-2">
                    <TabsList className="mb-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="params">Parameters</TabsTrigger>
                        <TabsTrigger value="auth">Authentication</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto px-1">
                        {/* ── Basic Info ── */}
                        <TabsContent value="basic" className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="Tool Name"
                                        placeholder="e.g. Get Weather"
                                        value={tool.name}
                                        onChange={(e) => onToolChange({ ...tool, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium">Method</label>
                                    <Select
                                        value={tool.method}
                                        onValueChange={(val: any) => onToolChange({ ...tool, method: val })}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <InputField
                                label="Description"
                                placeholder="What does this tool do?"
                                value={tool.description}
                                onChange={(e) => onToolChange({ ...tool, description: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Base URL"
                                    placeholder="https://api.example.com"
                                    value={tool.baseUrl}
                                    onChange={(e) => onToolChange({ ...tool, baseUrl: e.target.value })}
                                />
                                <InputField
                                    label="Path"
                                    placeholder="/v1/weather"
                                    value={tool.path}
                                    onChange={(e) => onToolChange({ ...tool, path: e.target.value })}
                                />
                            </div>

                            <VisibilitySelector 
                                value={tool.visibility || 'private'} 
                                onChange={(val) => onToolChange({ ...tool, visibility: val })} 
                            />

                            <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/5">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                                    <HugeiconsIcon
                                        icon={(AllIcons as any)[tool.icon || 'PlayIcon'] || PlayIcon}
                                        className="text-primary size-6"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Typography weight="medium">Tool Icon</Typography>
                                    <Typography scale="sm" className="text-muted-foreground">
                                        Choose a visual identifier for this tool.
                                    </Typography>
                                </div>
                                <Button variant="outline" size="sm" onClick={onOpenIconPicker}>
                                    Change Icon
                                </Button>
                            </div>
                        </TabsContent>

                        {/* ── Parameters ── */}
                        <TabsContent value="params" className="space-y-4 pt-4 h-full flex flex-col min-h-0 overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                                <Typography weight="semibold">API Parameters</Typography>
                                <Button variant="outline" size="sm" className="h-8" onClick={() => addParameter()}>
                                    <HugeiconsIcon icon={PlusSignIcon} className="mr-1 size-3.5" />
                                    Add Param
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
                                {tool.parameters.map((param, index) => renderParameterItem(param, [index]))}

                                {tool.parameters.length === 0 && (
                                    <div className="py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-muted/5">
                                        <HugeiconsIcon icon={PlayIcon} className="size-12 text-muted-foreground/20 mb-4" />
                                        <Typography className="text-muted-foreground italic">
                                            No parameters defined yet.
                                        </Typography>
                                        <Button variant="ghost" size="sm" className="mt-2" onClick={() => addParameter()}>
                                            Add Your First Parameter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ── Authentication ── */}
                        <TabsContent value="auth" className="space-y-4 pt-4">
                            <div className="flex flex-col gap-1.5 max-w-[240px]">
                                <label className="text-sm font-medium">Authentication Type</label>
                                <Select
                                    value={tool.authType}
                                    onValueChange={(val: any) =>
                                        onToolChange({ ...tool, authType: val, authDetails: {} })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No Auth">No Auth</SelectItem>
                                        <SelectItem value="apiKey">API Key</SelectItem>
                                        <SelectItem value="bearer">Bearer Token</SelectItem>
                                        <SelectItem value="basic">Basic Auth</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {tool.authType === 'apiKey' && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                    <InputField
                                        label="Header/Query Name"
                                        placeholder="e.g. X-API-Key"
                                        value={tool.authDetails?.key || ''}
                                        onChange={(e) =>
                                            onToolChange({
                                                ...tool,
                                                authDetails: { ...tool.authDetails, key: e.target.value },
                                            })
                                        }
                                    />
                                    <InputField
                                        label="API Key Value"
                                        type="password"
                                        value={tool.authDetails?.value || ''}
                                        onChange={(e) =>
                                            onToolChange({
                                                ...tool,
                                                authDetails: { ...tool.authDetails, value: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            )}

                            {tool.authType === 'bearer' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <InputField
                                        label="Token"
                                        type="password"
                                        value={tool.authDetails?.token || ''}
                                        onChange={(e) =>
                                            onToolChange({
                                                ...tool,
                                                authDetails: { ...tool.authDetails, token: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            )}

                            {tool.authType === 'basic' && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                    <InputField
                                        label="Username"
                                        value={tool.authDetails?.username || ''}
                                        onChange={(e) =>
                                            onToolChange({
                                                ...tool,
                                                authDetails: { ...tool.authDetails, username: e.target.value },
                                            })
                                        }
                                    />
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={tool.authDetails?.password || ''}
                                        onChange={(e) =>
                                            onToolChange({
                                                ...tool,
                                                authDetails: { ...tool.authDetails, password: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSave}>Save Tool</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
