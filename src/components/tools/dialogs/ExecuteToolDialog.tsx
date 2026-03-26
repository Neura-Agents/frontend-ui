import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon, PlusSignIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputField } from '@/components/ui/input-field';
import type { Tool, ToolParameter } from '@/components/tools/tool-card';
import type { McpTool } from '@/services/mcpService';

interface ExecuteToolDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    tool: Tool | McpTool | null;
    onExecute: (name: string, params: any) => Promise<any>;
    title?: string;
    description?: string;
}

export const ExecuteToolDialog: React.FC<ExecuteToolDialogProps> = ({
    isOpen,
    onOpenChange,
    tool,
    onExecute,
    title,
    description
}) => {
    const [testParams, setTestParams] = useState<Record<string, any>>({});
    const [testResult, setTestResult] = useState<any>(null);
    const [testLoading, setTestLoading] = useState(false);
    const [testError, setTestError] = useState<string | null>(null);

    // Identify if it's an MCP tool or a Custom tool
    const isMcpTool = (t: Tool | McpTool): t is McpTool => 'inputSchema' in t;

    useEffect(() => {
        if (!tool || !isOpen) return;

        setTestResult(null);
        setTestError(null);

        const initializeValues = (params: ToolParameter[]): Record<string, any> => {
            const values: Record<string, any> = {};
            params?.forEach(p => {
                if (p.type === 'object') {
                    values[p.name] = p.children ? initializeValues(p.children) : {};
                } else if (p.type === 'array') {
                    values[p.name] = [];
                } else {
                    values[p.name] = '';
                }
            });
            return values;
        };

        if (isMcpTool(tool)) {
            const initial: Record<string, any> = {};
            if (tool.inputSchema?.properties) {
                Object.keys(tool.inputSchema.properties).forEach(k => initial[k] = '');
            }
            setTestParams(initial);
        } else {
            setTestParams(initializeValues(tool.parameters || []));
        }
    }, [tool, isOpen]);

    const handleExecute = async () => {
        if (!tool) return;
        setTestLoading(true);
        setTestResult(null);
        setTestError(null);
        try {
            // Recursive function to clean empty parameters (from ToolsPage)
            const cleanParams = (obj: any): any => {
                if (typeof obj !== 'object' || obj === null) return obj;

                if (Array.isArray(obj)) {
                    return obj
                        .map(item => cleanParams(item))
                        .filter(v => v !== '' && v !== null && v !== undefined);
                }

                return Object.keys(obj).reduce((acc: any, key) => {
                    let value = cleanParams(obj[key]);

                    // Keep explicit numbers and booleans
                    if (typeof value === 'number' || typeof value === 'boolean') {
                        acc[key] = value;
                        return acc;
                    }

                    // Only add if not empty/null
                    if (value !== '' && value !== null && value !== undefined) {
                        // For objects/arrays, check if they actually have content
                        if (typeof value === 'object') {
                            const hasContent = Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0;
                            if (hasContent) acc[key] = value;
                        } else {
                            acc[key] = value;
                        }
                    }
                    return acc;
                }, {});
            };

            const preparedParams = isMcpTool(tool) ? testParams : cleanParams(testParams);
            const result = await onExecute(tool.name, preparedParams);
            setTestResult(result);
        } catch (err: any) {
            setTestError(err.response?.data?.details || err.response?.data?.error || err.message || "Execution failed");
        } finally {
            setTestLoading(false);
        }
    };

    const renderTestParameterInput = (param: any, value: any, onChange: (val: any) => void) => {
        const type = param.type;
        const name = param.name;

        if (type === 'object') {
            return (
                <div key={name} className="space-y-3 p-3 border border-border/50 rounded-xl bg-muted/5 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={PlayIcon} className="size-3 text-muted-foreground/60" />
                        <Typography scale="xs" weight="medium" className="text-muted-foreground uppercase tracking-wider text-[10px] leading-none">
                            {name} properties
                        </Typography>
                    </div>
                    <div className="space-y-4 pl-1">
                        {param.children?.length ? param.children.map((child: any) => (
                            <div key={child.name} className="space-y-1.5">
                                <label className="text-[11px] font-medium text-muted-foreground/80 flex items-center gap-1.5">
                                    {child.name}
                                    {child.required && <span className="text-destructive font-bold">*</span>}
                                </label>
                                {renderTestParameterInput(child, value?.[child.name], (newVal) => {
                                    onChange({ ...value, [child.name]: newVal });
                                })}
                            </div>
                        )) : (
                            <div className="py-2 text-center text-[10px] text-muted-foreground/60 italic border border-dashed rounded-lg border-border/40">
                                No properties defined.
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (type === 'array') {
            const items = Array.isArray(value) ? value : [];
            const itemType = param.itemType || 'item';

            const addNewItem = () => {
                let defaultVal: any = '';
                if (param.itemType === 'number') defaultVal = 0;
                else if (param.itemType === 'boolean') defaultVal = false;
                else if (param.itemType === 'object') {
                    const initChildren = (children?: any[]): any => {
                        const obj: any = {};
                        children?.forEach(c => {
                            if (c.type === 'object') obj[c.name] = initChildren(c.children);
                            else if (c.type === 'array') obj[c.name] = [];
                            else obj[c.name] = (c.type === 'number' ? 0 : (c.type === 'boolean' ? false : ''));
                        });
                        return obj;
                    };
                    defaultVal = initChildren(param.children);
                }
                onChange([...items, defaultVal]);
            };

            return (
                <div key={name} className="space-y-3 p-3 border border-border/50 rounded-xl bg-muted/5 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={PlayIcon} className="size-3 text-muted-foreground/60" />
                            <Typography scale="xs" weight="medium" className="text-muted-foreground uppercase tracking-wider text-[10px] leading-none">
                                {name} list ({items.length} items)
                            </Typography>
                        </div>
                        <Button
                            variant="outline"
                            size="xs"
                            className="h-7 text-[10px] py-1 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                            onClick={addNewItem}
                        >
                            <HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1" /> Add {itemType}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <div className="py-6 text-center border border-dashed rounded-lg bg-muted/20 border-border/40">
                                <Typography scale="xs" className="text-muted-foreground italic">No items added to {name}.</Typography>
                            </div>
                        ) : (
                            items.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-start group animate-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 px-1">
                                            <Badge variant="soft" className="h-4 px-1 text-[8px] bg-primary/10 text-primary border-primary/20">#{idx + 1}</Badge>
                                        </div>
                                        {renderTestParameterInput(
                                            {
                                                name: `item-${idx}`,
                                                type: (param.itemType as any) || 'string',
                                                children: param.children,
                                                in: param.in,
                                                required: false
                                            },
                                            item,
                                            (newVal) => {
                                                const newItems = [...items];
                                                newItems[idx] = newVal;
                                                onChange(newItems);
                                            }
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity mt-6"
                                        onClick={() => onChange(items.filter((_, i) => i !== idx))}
                                    >
                                        <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            );
        }

        if (type === 'boolean') {
            return (
                <Select key={name} value={String(value)} onValueChange={(val) => onChange(val === 'true')}>
                    <SelectTrigger className="h-9 w-full bg-card border-border/60">
                        <SelectValue placeholder="Select boolean" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                </Select>
            )
        }

        return (
            <InputField
                key={name}
                className="h-9 text-sm bg-card border-border/60"
                placeholder={param.description || `Enter ${name}`}
                value={value ?? ''}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(type === 'number' ? (val === '' ? '' : Number(val)) : val);
                }}
            />
        );
    };

    const renderMcpParams = () => {
        if (!tool || !isMcpTool(tool)) return null;
        const properties = tool.inputSchema?.properties || {};
        const required = tool.inputSchema?.required || [];

        if (Object.keys(properties).length === 0) {
            return (
                <div className="py-8 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                    <Typography className="text-muted-foreground italic scale-sm">No arguments required for this tool.</Typography>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <Typography weight="semibold" scale="sm">Arguments</Typography>
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(properties).map(([name, prop]: [string, any]) => (
                        <div key={name} className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                                    {name}
                                    {required.includes(name) && <span className="text-destructive">*</span>}
                                </label>
                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-border/40 text-muted-foreground font-normal uppercase">{prop.type}</Badge>
                            </div>
                            <InputField
                                placeholder={prop.description || `Enter ${name}...`}
                                value={testParams[name] || ''}
                                onChange={(e) => setTestParams({ ...testParams, [name]: e.target.value })}
                                className="bg-card/50"
                            />
                            {prop.description && (
                                <Typography scale="xs" className="text-muted-foreground/60 px-1 italic">
                                    {prop.description}
                                </Typography>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCustomParams = () => {
        if (!tool || isMcpTool(tool)) return null;
        const parameters = tool.parameters || [];

        if (parameters.length === 0) {
            return (
                <div className="py-8 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                    <Typography className="text-muted-foreground italic scale-sm">No parameters required for this tool.</Typography>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <Typography weight="semibold" scale="sm">Parameters</Typography>
                <div className="grid grid-cols-1 gap-6">
                    {parameters.map((param) => (
                        <div key={param.name} className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                                    {param.name}
                                    {param.required && <span className="text-destructive">*</span>}
                                    <Badge variant="soft" className="text-[9px] py-0 h-4 px-1.5 uppercase font-bold tracking-tighter">{param.in}</Badge>
                                </label>
                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-border/40 text-muted-foreground font-normal">{param.type}</Badge>
                            </div>

                            {renderTestParameterInput(
                                param,
                                testParams[param.name],
                                (val) => setTestParams({ ...testParams, [param.name]: val })
                            )}

                            {param.description && (
                                <Typography scale="xs" className="text-muted-foreground/60 px-1 leading-relaxed">
                                    {param.description}
                                </Typography>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{title || `Execute Tool: ${tool?.name}`}</DialogTitle>
                    <DialogDescription>
                        {description || "Enter parameters to call the tool and see the response."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {tool && (isMcpTool(tool) ? renderMcpParams() : renderCustomParams())}

                    {(testResult || testError) && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center justify-between">
                                <Typography weight="semibold" scale="sm">Result</Typography>
                                <Badge variant={testError ? "destructive" : "soft"} className="text-[10px]">
                                    {testError ? "Error" : (testResult?.status ? `Status: ${testResult.status}` : "Success")}
                                </Badge>
                            </div>
                            <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-[300px] ${testError ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-muted/30 border-border/50 text-foreground'}`}>
                                <pre className='whitespace-pre-wrap wrap-break-words'>{testError || JSON.stringify(testResult, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="animate-in slide-in-from-bottom-2 duration-300">
                    <Button variant="ghost" className='rounded-full' onClick={() => onOpenChange(false)}>Close</Button>
                    <Button
                        variant="default"
                        onClick={handleExecute}
                        className='rounded-full'
                        disabled={testLoading}
                    >
                        {testLoading ? (
                            <>
                                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Calling...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={PlayIcon} />
                                Run Tool
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
