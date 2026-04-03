import React, { useState } from 'react';

import { PromptInput } from '@/components/reusable/prompt-input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Add01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InputField } from '@/components/ui/input-field';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import IconGallery from '../components/reusable/IconGallery';
import * as AllIcons from '@hugeicons/core-free-icons';
import AgentCapabilities from '@/components/agents/AgentCapabilities';
import AgentConfiguration from '@/components/agents/AgentConfiguration';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { agentsService, type AgentCapability } from '@/services/agentsService';
import { useEffect } from 'react';

interface CreateEditAgentPageProps {
    isEdit?: boolean;
}

const CreateEditAgentPage: React.FC<CreateEditAgentPageProps> = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [prompt, setPrompt] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);

    // Initial state from search params (if not editing)
    const [agentName, setAgentName] = useState(() => (!isEdit && searchParams.get('name')) || "");
    const [agentVersion, setAgentVersion] = useState(() => (!isEdit && searchParams.get('version')) || "1.0.0");
    const [agentIcon, setAgentIcon] = useState(() => (!isEdit && searchParams.get('icon')) || "UserCircle02Icon");
    const [description, setDescription] = useState(() => (!isEdit && searchParams.get('description')) || "");
    const [systemPrompt, setSystemPrompt] = useState(() => (!isEdit && searchParams.get('systemPrompt')) || "");
    const [model, setModel] = useState(() => (!isEdit && searchParams.get('model')) || "");
    const [temperature, setTemperature] = useState(() => {
        const temp = !isEdit && searchParams.get('temperature');
        return temp ? [parseFloat(temp)] : [0.7];
    });
    const [tags, setTags] = useState<string[]>(() => {
        const tgs = !isEdit && searchParams.get('tags');
        return tgs ? tgs.split(',').filter(t => t !== '') : [];
    });
    const [visibility, setVisibility] = useState(() => (!isEdit && searchParams.get('visibility')) || "private");
    const [maxTokens, setMaxTokens] = useState(() => {
        const tokens = !isEdit && searchParams.get('maxTokens');
        return tokens ? [parseInt(tokens)] : [2048];
    });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
        const caps = !isEdit && searchParams.get('capabilities');
        return caps ? new Set(caps.split(',').filter(c => c !== '')) : new Set();
    });

    // Update URL when state changes (only if not editing)
    useEffect(() => {
        if (!isEdit) {
            const params = new URLSearchParams();
            if (agentName) params.set('name', agentName);
            if (agentVersion && agentVersion !== "1.0.0") params.set('version', agentVersion);
            if (agentIcon && agentIcon !== "UserCircle02Icon") params.set('icon', agentIcon);
            if (description) params.set('description', description);
            if (systemPrompt) params.set('systemPrompt', systemPrompt);
            if (model) params.set('model', model);
            if (temperature[0] !== 0.7) params.set('temperature', temperature[0].toString());
            if (tags.length > 0) params.set('tags', tags.join(','));
            if (visibility !== "private") params.set('visibility', visibility);
            if (maxTokens[0] !== 2048) params.set('maxTokens', maxTokens[0].toString());
            if (selectedIds.size > 0) params.set('capabilities', Array.from(selectedIds).join(','));

            // Check if current params match to avoid redundant updates
            const currentParams = searchParams.toString();
            const nextParams = params.toString();
            if (currentParams !== nextParams) {
                setSearchParams(params, { replace: true });
            }
        }
    }, [
        isEdit, agentName, agentVersion, agentIcon, description, systemPrompt,
        model, temperature, tags, visibility, maxTokens, selectedIds,
        searchParams, setSearchParams
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isEdit && id) {
                const fetchAgent = async () => {
                    try {
                        const agent = await agentsService.getAgentById(id);
                        setAgentName(agent.name);
                        setAgentVersion(agent.version || "1.0.0");
                        setAgentIcon(agent.icon || "UserCircle02Icon");
                        setDescription(agent.description || "");
                        setSystemPrompt(agent.system_prompt || "");
                        setModel(agent.model_name || "");
                        setTemperature([Number(agent.temperature || 0.7)]);
                        setTags(agent.tags || []);
                        setVisibility(agent.visibility || "private");
                        setMaxTokens([Number(agent.max_tokens || 2048)]);


                        if (agent.capabilities) {
                            const newSelectedIds = new Set<string>();
                            agent.capabilities.forEach((cap: any) => {
                                newSelectedIds.add(`${cap.capability_type}-${cap.capability_id}`);
                            });
                            setSelectedIds(newSelectedIds);
                        }
                    } catch (error) {
                        console.error("Failed to fetch agent:", error);
                        alert("Failed to fetch agent details");
                    }
                };
                fetchAgent();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isEdit, id]);

    const handleCreateAgent = async (status: 'published' | 'draft' = 'published') => {
        if (!agentName.trim()) {
            alert("Please enter an agent name");
            return;
        }

        setIsSubmitting(true);
        try {
            const capabilities: AgentCapability[] = Array.from(selectedIds).map(id => {
                const parts = id.split('-');
                const type = parts[0];
                const capabilityId = parts.slice(1).join('-');
                return {
                    capability_id: capabilityId,
                    capability_type: type as any
                };
            });

            const agentData = {
                name: agentName,
                icon: agentIcon,
                description,
                version: agentVersion,
                tags,
                visibility,
                model_name: model,
                temperature: temperature[0],
                max_tokens: maxTokens[0],
                system_prompt: systemPrompt,
                status,
                capabilities
            };

            if (isEdit && id) {
                await agentsService.updateAgent(id, agentData);
                alert("Agent updated successfully!");
            } else {
                await agentsService.createAgent(agentData);
                alert("Agent created successfully!");
            }
            navigate('/agents');
        } catch (error: any) {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} agent:`, error);
            alert(error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} agent`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleReset = () => {
        setAgentName("");
        setAgentVersion("1.0.0");
        setAgentIcon("UserCircle02Icon");
        setDescription("");
        setSystemPrompt("");
        setModel("");
        setTemperature([0.7]);
        setTags([]);
        setVisibility("private");
        setMaxTokens([2048]);
        setSelectedIds(new Set());
    };

    const handleSend = () => {
        if (!prompt.trim()) return;
        setIsThinking(true);
        // Mocking agent response
        setTimeout(() => {
            setIsThinking(false);
            setPrompt("");
        }, 1500);
    };

    // Check if form is dirty (changed from default values), ignoring the model brain
    const isDirty = 
        agentName !== "" ||
        agentVersion !== "1.0.0" ||
        agentIcon !== "UserCircle02Icon" ||
        description !== "" ||
        systemPrompt !== "" ||
        temperature[0] !== 0.7 ||
        tags.length > 0 ||
        visibility !== "private" ||
        maxTokens[0] !== 2048 ||
        selectedIds.size > 0;

    return (
        <>
            {/* Desktop Only View */}
            <div className="hidden md:flex container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 flex-col h-full">
                {/* ─── HERO / PREVIEW ─── */}
                <section className="flex flex-row items-center justify-between mb-2 shrink-0">
                    <div className='flex flex-row items-center gap-4'>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsIconDialogOpen(true)}
                                iconOnly
                            >
                                <HugeiconsIcon
                                    icon={(AllIcons as any)[agentIcon] || AllIcons.UserCircle02Icon}
                                />
                            </Button>
                            <Typography scale="2xl" font="season-mix" weight="normal" className="tracking-tight shrink-0 whitespace-nowrap">
                                {isEdit ? 'Edit Agent' : 'Create Agents'}
                            </Typography>
                        </div>
                        <Typography scale="2xl" font="season-mix" weight="normal" className="tracking-tight shrink-0">
                            /
                        </Typography>
                        <div className="flex flex-col gap-1">
                            <InputField
                                placeholder='Enter Agent Name'
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                className="w-64 rounded-full"
                            />
                        </div>
                        <Typography scale="2xl" font="season-mix" weight="normal" className="tracking-tight shrink-0">
                            /
                        </Typography>
                        <InputField
                            placeholder='Enter Version No Eg: 1.0.0'
                            value={agentVersion}
                            onChange={(e) => setAgentVersion(e.target.value)}
                            className="w-64 rounded-full"
                        />
                    </div>
                    <div className="flex gap-4">
                        {!isEdit && isDirty && (
                            <Button
                                variant="destructive"
                                className="rounded-full gap-2 px-5"
                                onClick={handleReset}
                            >
                                Clear Form
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            disabled={isSubmitting}
                            className="rounded-full gap-2 px-5"
                            onClick={() => handleCreateAgent('draft')}
                        >
                            {isEdit ? 'Save as Draft' : 'Draft Agent'}
                        </Button>
                        <Button
                            variant="default"
                            loading={isSubmitting}
                            className="rounded-full gap-2 px-5"
                            onClick={() => handleCreateAgent('published')}
                        >
                            {isEdit ? 'Update Agent' : 'Create Agent'}
                        </Button>
                    </div>
                </section>
                <ResizablePanelGroup
                    orientation="horizontal"
                    className="w-full rounded-2xl border flex-1"
                >
                    <ResizablePanel defaultSize="40%" className='flex flex-col h-full bg-card'>
                        <div className='flex flex-row border-b border-border p-4 shrink-0'>
                            <div className='flex flex-row items-center gap-2'>
                                <Typography scale="xl" font="season-mix" weight="normal" className="tracking-tight shrink-0 whitespace-nowrap">
                                    Configure your agent
                                </Typography>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HugeiconsIcon icon={HelpCircleIcon} size={16} className=' text-muted-foreground transition-colors hover:text-foreground' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Set the basic identity and behavior of your agent.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden mt-4">
                            <AgentConfiguration
                                description={description}
                                setDescription={setDescription}
                                systemPrompt={systemPrompt}
                                setSystemPrompt={setSystemPrompt}
                                model={model}
                                setModel={setModel}
                                temperature={temperature}
                                setTemperature={setTemperature}
                                tags={tags}
                                setTags={setTags}
                                visibility={visibility}
                                setVisibility={setVisibility}
                                maxTokens={maxTokens}
                                setMaxTokens={setMaxTokens}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize="50%">
                        <ResizablePanelGroup orientation="vertical">
                            <ResizablePanel defaultSize="40%" className='flex flex-col h-full bg-card'>
                                <div className='flex flex-row items-center justify-between border-b border-border p-4 shrink-0'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <Typography scale="xl" font="season-mix" weight="normal" className="tracking-tight shrink-0 whitespace-nowrap">
                                            Add tools and Capabilities to your agent
                                        </Typography>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HugeiconsIcon icon={HelpCircleIcon} size={16} className=' text-muted-foreground transition-colors hover:text-foreground' />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Enhance your agent with specific tools and capabilities.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <Link to="/tools">
                                        <Button variant="outline" size="sm" className='rounded-full'>
                                            <HugeiconsIcon icon={Add01Icon} />
                                            Add new tool
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex-1 overflow-hidden mt-4">
                                    <AgentCapabilities
                                        selectedIds={selectedIds}
                                        setSelectedIds={setSelectedIds}
                                    />
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize="60%" className='flex flex-col h-full bg-card'>
                                <div className='flex flex-row items-center justify-between border-b border-border p-4 shrink-0'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <Typography scale="xl" font="season-mix" weight="normal" className="tracking-tight shrink-0 whitespace-nowrap">
                                            Try out your agent before deploying
                                        </Typography>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HugeiconsIcon icon={HelpCircleIcon} size={16} className=' text-muted-foreground transition-colors hover:text-foreground' />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Test your agent's responses in real-time.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <Button variant="outline" size="sm" className='rounded-full'>
                                        <HugeiconsIcon icon={Add01Icon} />
                                        New Chat
                                    </Button>
                                </div>

                                {/* Empty state or message area */}
                                <div className="flex-1 flex flex-col items-center justify-center p-4 opacity-40 select-none">
                                    <div className="p-4 rounded-full bg-background mb-4">
                                        <HugeiconsIcon icon={Add01Icon} size={32} />
                                    </div>
                                    <Typography scale="sm" className="font-matter text-center max-w-[240px]">
                                        Enter a message below to test your agent's current configuration.
                                    </Typography>
                                </div>

                                <div className="mt-auto shrink-0 p-4">
                                    <PromptInput
                                        value={prompt}
                                        onChange={setPrompt}
                                        onSubmit={handleSend}
                                        isRunning={isThinking}
                                    />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Mobile Fallback */}
            <div className="md:hidden flex flex-col items-center justify-center p-12 text-center space-y-6 h-full min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-6 rounded-full bg-primary/5 ring-1 ring-primary/20">
                    <HugeiconsIcon icon={Add01Icon} size={48} className="text-primary animate-pulse" />
                </div>
                <div className="space-y-4">
                    <Typography scale="3xl" font="season-mix" weight="bold" className="tracking-tight">
                        Desktop Optimization Required
                    </Typography>
                    <Typography scale="lg" className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        The Agent Creation Studio is a complex workspace designed for desktop screens. Please switch to a larger device to build and configure your agents.
                    </Typography>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                    <Badge variant="soft" className="px-4 py-2 text-sm">Requires 768px+ Width</Badge>
                </div>
            </div>

            {/* Icon Selection Dialog */}
            <Dialog open={isIconDialogOpen} onOpenChange={setIsIconDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select Agent Icon</DialogTitle>
                        <DialogDescription>
                            Give your agent a distinct visual identity.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <IconGallery
                            pageSize={32}
                            lg={8}
                            md={6}
                            sm={4}
                            selectMode
                            selectedIcon={agentIcon}
                            onSelect={(name) => {
                                setAgentIcon(name);
                                setIsIconDialogOpen(false);
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsIconDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateEditAgentPage;

