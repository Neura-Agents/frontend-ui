import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Search02Icon,
    Add01Icon,
    CheckmarkCircle01Icon,
    ToolsIcon,
    McpServerIcon,
    BrainIcon,
    AiNetworkIcon,
    Alert01Icon
} from '@hugeicons/core-free-icons';
import { toolsService } from '@/services/toolsService';
import type { Tool } from '@/components/tools/tool-card';
import { mcpService, type McpServer, type McpTool } from '@/services/mcpService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { knowledgeService, type KnowledgeBase, type KnowledgeGraph } from '@/services/knowledgeService';
import { useUmami } from '@/hooks/useUmami';


interface CapabilityItem {
    id: string;
    name: string;
    description: string;
    type: 'tool' | 'mcp' | 'kb' | 'kg';
    icon: any;
    data: any;
    meta?: string;
}

interface AgentCapabilitiesProps {
    selectedIds: Set<string>;
    setSelectedIds: (val: Set<string>) => void;
}

const AgentCapabilities: React.FC<AgentCapabilitiesProps> = ({ selectedIds, setSelectedIds }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tools, setTools] = useState<Tool[]>([]);
    const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
    const [mcpTools, setMcpTools] = useState<Record<string, McpTool[]>>({});
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [knowledgeGraphs, setKnowledgeGraphs] = useState<KnowledgeGraph[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);


    const { track } = useUmami();
    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // Fetch Tools
                    const toolsData = await toolsService.getTools(1, 100);
                    setTools(toolsData.tools);

                    // Fetch MCP Servers (Page 1, higher limit for selection)
                    const serversData = await mcpService.getServers({ page: 1, limit: 100 });
                    setMcpServers(serversData.mcp_servers);

                    // Fetch ALL MCP Tools in one shot
                    const allTools = await mcpService.getTools();
                    const mcpToolsMap: Record<string, McpTool[]> = {};
                    
                    allTools.forEach(tool => {
                        // Use 'default' if server_id is missing (matches sync logic)
                        const sId = (tool as any).server_id || 'default';
                        if (!mcpToolsMap[sId]) mcpToolsMap[sId] = [];
                        mcpToolsMap[sId].push(tool);
                    });
                    setMcpTools(mcpToolsMap);


                    // Fetch Knowledge Bases (Page 1, 100 items for selection)
                    const kbData = await knowledgeService.getKnowledgeBases({ page: 1, limit: 100 });
                    setKnowledgeBases(kbData.items);

                    // Fetch Knowledge Graphs (Page 1, 100 items for selection)
                    const kgData = await knowledgeService.getKnowledgeGraphs({ page: 1, limit: 100 });
                    setKnowledgeGraphs(kgData.items);
                } catch (error) {
                    console.error("Failed to fetch capabilities", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        const isDeselect = next.has(id);
        if (isDeselect) {
            next.delete(id);
        } else {
            next.add(id);
        }
        track('capability-toggle', { id, action: isDeselect ? 'deselect' : 'select' });
        setSelectedIds(next);
    };

    const filterItems = (items: any[], query: string) => {
        return items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );
    };

    const renderCard = (item: CapabilityItem) => {
        const isSelected = selectedIds.has(item.id);
        return (
            <div
                key={item.id}
                className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${isSelected
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-border/40 bg-card/30 hover:border-primary/20 hover:bg-card/60'
                    }`}
            >
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex items-center justify-center size-11 rounded-xl shrink-0 transition-colors duration-300 ${isSelected ? 'bg-primary/10 text-primary shadow-inner' : 'bg-muted/40 text-muted-foreground group-hover:bg-muted/60'
                        }`}>
                        <HugeiconsIcon icon={item.icon} size={22} />
                    </div>
                    <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Typography scale="sm" weight="medium" className="truncate leading-none">
                                {item.name}
                            </Typography>
                            {item.meta && (
                                <Badge variant="soft" className="h-4 px-1 text-[8px] uppercase tracking-wider font-bold opacity-60">
                                    {item.meta}
                                </Badge>
                            )}
                        </div>
                        <Typography scale="xs" className="text-muted-foreground truncate max-w-[200px] opacity-70">
                            {item.description || "No description provided."}
                        </Typography>
                    </div>
                </div>
                <div className="shrink-0">
                    <Button
                        variant={isSelected ? "default" : "outline"}
                        size="icon"
                        className={`size-8 rounded-full transition-all duration-500 shadow-sm ${isSelected
                            ? 'scale-110 rotate-0 shadow-primary/20'
                            : 'opacity-0 group-hover:opacity-100 hover:border-primary/50'
                            }`}
                        onClick={() => toggleSelection(item.id)}
                    >
                        <HugeiconsIcon icon={isSelected ? CheckmarkCircle01Icon : Add01Icon} size={16} strokeWidth={2.5} />
                    </Button>
                </div>
            </div>
        );
    };

    const allMcpTools: CapabilityItem[] = [];
    Object.entries(mcpTools).forEach(([serverId, tools]) => {
        const server = mcpServers.find(s => s.server_id === serverId);
        tools.forEach(tool => {
            allMcpTools.push({
                id: `mcp-${(tool as any).id}`,

                name: tool.name,
                description: tool.description || `From ${server?.server_name || serverId}`,
                type: 'mcp',
                icon: McpServerIcon,
                data: tool
            });
        });
    });

    const capabilityTools: CapabilityItem[] = tools.map(t => ({
        id: `tool-${t.id}`,
        name: t.name,
        description: t.description || "",
        type: 'tool',
        icon: ToolsIcon,
        data: t
    }));

    const capabilityKbs: CapabilityItem[] = knowledgeBases.map(kb => ({
        id: `kb-${kb.id}`,
        name: kb.name,
        description: kb.description,
        type: 'kb',
        icon: BrainIcon,
        data: kb
    }));

    const capabilityKgs: CapabilityItem[] = knowledgeGraphs.map(kg => ({
        id: `kg-${kg.id}`,
        name: kg.name,
        description: kg.description,
        type: 'kg',
        icon: AiNetworkIcon,
        data: kg
    }));

    const allItems = [...capabilityTools, ...allMcpTools, ...capabilityKbs, ...capabilityKgs];
    const selectedItems = allItems.filter(item => selectedIds.has(item.id));

    return (
        <div className="flex flex-col h-full space-y-4 px-4 pb-2">
            <div className="relative shrink-0 pt-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pt-1">
                    <HugeiconsIcon icon={Search02Icon} size={18} />
                </div>
                <Input
                    placeholder="Search tools, MCP, knowledge..."
                    className="pl-10 h-10 rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Tabs defaultValue="tools" className="flex-1 flex flex-col min-h-0">
                <TabsList>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                    <TabsTrigger value="mcp">MCP Tools</TabsTrigger>
                    <TabsTrigger value="kb">KBs</TabsTrigger>
                    <TabsTrigger value="kg">KGs</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                    <TabsContent value="tools" className="m-0 mt-0 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                        {loading && <div className="p-4 text-center col-span-full"><Typography scale="sm" className="text-muted-foreground">Loading tools...</Typography></div>}
                        {!loading && filterItems(capabilityTools, searchQuery).length === 0 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-40 col-span-full">
                                <HugeiconsIcon icon={Alert01Icon} size={24} className="mb-2" />
                                <Typography scale="xs">No tools found.</Typography>
                            </div>
                        )}
                        {filterItems(capabilityTools, searchQuery).map(renderCard)}
                    </TabsContent>

                    <TabsContent value="mcp" className="m-0 mt-0 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                        {loading && <div className="p-4 text-center col-span-full"><Typography scale="sm" className="text-muted-foreground">Loading MCP tools...</Typography></div>}
                        {!loading && filterItems(allMcpTools, searchQuery).length === 0 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-40 col-span-full">
                                <HugeiconsIcon icon={Alert01Icon} size={24} className="mb-2" />
                                <Typography scale="xs">No MCP tools found.</Typography>
                            </div>
                        )}
                        {filterItems(allMcpTools, searchQuery).map(renderCard)}
                    </TabsContent>

                    <TabsContent value="kb" className="m-0 mt-0 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                        {loading && <div className="p-4 text-center col-span-full"><Typography scale="sm" className="text-muted-foreground">Loading KBs...</Typography></div>}
                        {!loading && filterItems(capabilityKbs, searchQuery).length === 0 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-40 col-span-full">
                                <HugeiconsIcon icon={Alert01Icon} size={24} className="mb-2" />
                                <Typography scale="xs">No Knowledge Bases found.</Typography>
                            </div>
                        )}
                        {filterItems(capabilityKbs, searchQuery).map(renderCard)}
                    </TabsContent>

                    <TabsContent value="kg" className="m-0 mt-0 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                        {loading && <div className="p-4 text-center col-span-full"><Typography scale="sm" className="text-muted-foreground">Loading KGs...</Typography></div>}
                        {!loading && filterItems(capabilityKgs, searchQuery).length === 0 && (
                            <div className="py-8 flex flex-col items-center justify-center text-center opacity-40 col-span-full">
                                <HugeiconsIcon icon={Alert01Icon} size={24} className="mb-2" />
                                <Typography scale="xs">No Knowledge Graphs found.</Typography>
                            </div>
                        )}
                        {filterItems(capabilityKgs, searchQuery).map(renderCard)}
                    </TabsContent>
                </div>
            </Tabs>

            <div className="shrink-0 pt-2 mt-2 border-t border-border/40 flex items-center justify-between bg-card/50 backdrop-blur-sm -mx-2 px-2 rounded-b-2xl">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    <Typography scale="xs" weight="medium" className="text-muted-foreground">
                        {selectedIds.size} {selectedIds.size === 1 ? 'capability' : 'capabilities'} selected
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.size > 0 && (
                        <>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    setIsSelectionDialogOpen(true);
                                    track('capability-preview-open');
                                }}
                            >
                                Preview
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                Clear All
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Selected Capabilities Dialog */}
            <Dialog open={isSelectionDialogOpen} onOpenChange={setIsSelectionDialogOpen}>
                <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Selected Capabilities</DialogTitle>
                        <DialogDescription>
                            Review the tools and knowledge bases added to this agent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {selectedItems.length === 0 ? (
                            <div className="py-12 text-center opacity-40">
                                <Typography scale="sm">No capabilities selected.</Typography>
                            </div>
                        ) : (
                            selectedItems.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/40"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <HugeiconsIcon icon={item.icon} size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Typography scale="sm" weight="medium" className="truncate leading-none">
                                                    {item.name}
                                                </Typography>
                                                <Badge variant="soft" className="h-4 px-1 text-[8px] uppercase font-bold opacity-60">
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <Typography scale="xs" className="text-muted-foreground truncate max-w-[200px] mt-0.5">
                                                {item.description}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                        onClick={() => toggleSelection(item.id)}
                                    >
                                        <HugeiconsIcon icon={Add01Icon} size={14} className="rotate-45" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 bg-muted/5 border-t border-border/50 flex justify-end">
                        <Button variant="default" className="rounded-full" onClick={() => setIsSelectionDialogOpen(false)}>
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgentCapabilities;
