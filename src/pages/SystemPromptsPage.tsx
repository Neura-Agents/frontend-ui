import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Search02Icon,
    Refresh01Icon,
    Add01Icon,
    File01Icon,
    Calendar03Icon,
    CheckmarkCircle02Icon,
    Clock01Icon,
    ArrowRight01Icon,
    UserMultiple02Icon,
    RoboticIcon,
    UserAccountIcon,
    Settings01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Input } from '@/components/ui/input';
import { platformService, type Prompt } from '@/services/platformService';
import { useAlert } from '@/context/AlertContext';
import { CreatePromptDialog } from '@/components/admin/dialogs/CreatePromptDialog';
import { ViewPromptDialog } from '@/components/admin/dialogs/ViewPromptDialog';
import { EditPromptTargetingDialog } from '@/components/admin/dialogs/EditPromptTargetingDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

const SystemPromptsPage: React.FC = () => {
    const { showAlert } = useAlert();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isTargetingDialogOpen, setIsTargetingDialogOpen] = useState(false);

    const fetchPrompts = async () => {
        try {
            setIsLoading(true);
            const data = await platformService.listPrompts();
            setPrompts(data);
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to fetch prompts', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleUploadPrompt = async (file: File, name: string, type: string) => {
        try {
            await platformService.uploadPrompt(file, name, type);
            showAlert({ title: 'Success', description: 'New system prompt activated successfully', variant: 'success' });
            fetchPrompts();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to upload prompt', variant: 'destructive' });
            throw error;
        }
    };

    const handleActivatePrompt = async (id: string) => {
        try {
            await platformService.activatePrompt(id);
            showAlert({ title: 'Success', description: 'System prompt activated successfully', variant: 'success' });
            fetchPrompts();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to activate prompt', variant: 'destructive' });
        }
    };

    const handleUpdateTargeting = async (id: string, targeting: { users: string[], agents: string[], roles: string[] }) => {
        try {
            await platformService.updatePromptTargeting(id, targeting);
            showAlert({ title: 'Success', description: 'Prompt targeting updated successfully', variant: 'success' });
            fetchPrompts();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to update targeting', variant: 'destructive' });
        }
    };

    const filteredPrompts = prompts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0">
            {/* Header Section */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    System Prompts
                </Typography>
                <Typography variant="page-description">
                    Manage agent execution templates and system instruction files.
                </Typography>
            </section>

            {/* Actions Bar */}
            <header className="mb-4 space-y-4 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search prompts by name or type..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="default"
                            className="rounded-full gap-2 h-10 px-5"
                            onClick={() => setIsUploadDialogOpen(true)}
                        >
                            <HugeiconsIcon icon={Add01Icon} size={18} />
                            Upload Prompt
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={fetchPrompts}>
                            <HugeiconsIcon icon={Refresh01Icon} size={18} />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-20">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse font-season-mix tracking-wider">
                        Synchronizing global templates...
                    </div>
                ) : filteredPrompts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="size-20 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center text-muted-foreground/40">
                            <HugeiconsIcon icon={File01Icon} size={40} />
                        </div>
                        <div className="text-center space-y-2">
                            <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                {searchQuery ? 'No match found' : 'No prompts managed yet'}
                            </Typography>
                            <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                {searchQuery
                                    ? `We couldn't find any results for "${searchQuery}".`
                                    : 'Upload your first system prompt template to control agent behavior dynamically.'}
                            </Typography>
                        </div>
                    </div>
                ) : filteredPrompts.map((prompt) => (
                    <Card key={prompt.id} className={`flex flex-col h-full hover:border-primary/40 transition-all group border-border relative overflow-hidden`}>
                        <CardHeader className="pb-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-lg tracking-tight font-season-mix">{prompt.name}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                            {
                                                !prompt.is_active && (
                                                    <>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleActivatePrompt(prompt.id)}
                                                                    className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                                >
                                                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Activate this version</p>
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setSelectedPrompt(prompt);
                                                                        setIsTargetingDialogOpen(true);
                                                                    }}
                                                                    className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                                >
                                                                    <HugeiconsIcon icon={Settings01Icon} size={14} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit Targetting</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </>
                                                )}

                                        </div>
                                    </div>
                                    {prompt.is_active && (
                                        <Badge variant="success" className="rounded-full gap-1 shadow-sm">
                                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                                            Active
                                        </Badge>
                                    )}
                                </div>

                                {/* Targeting Indicators */}
                                {(prompt.targeting_users?.length || prompt.targeting_agents?.length || prompt.targeting_roles?.length) ? (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {(prompt.targeting_users?.length ?? 0) > 0 && (
                                            <Badge variant="soft" className="rounded-md px-1.5 h-6 gap-1 text-[10px]">
                                                <HugeiconsIcon icon={UserMultiple02Icon} size={10} />
                                                {prompt.targeting_users?.length} Users
                                            </Badge>
                                        )}
                                        {(prompt.targeting_agents?.length ?? 0) > 0 && (
                                            <Badge variant="soft" className="rounded-md px-1.5 h-6 gap-1 text-[10px]">
                                                <HugeiconsIcon icon={RoboticIcon} size={10} />
                                                {prompt.targeting_agents?.length} Agents
                                            </Badge>
                                        )}
                                        {(prompt.targeting_roles?.length ?? 0) > 0 && (
                                            <Badge variant="soft" className="rounded-md px-1.5 h-6 gap-1 text-[10px]">
                                                <HugeiconsIcon icon={UserAccountIcon} size={10} />
                                                {prompt.targeting_roles?.length} Roles
                                            </Badge>
                                        )}
                                    </div>
                                ) : null}

                                <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed">
                                    {prompt.metadata?.description || `Stored at: ${prompt.storage_path}`}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto space-y-4">
                            <div className="flex flex-col gap-2">

                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="default" className="rounded-full font-mono text-[10px] tracking-tighter uppercase px-2">
                                        {prompt.type}
                                    </Badge>
                                    {prompt.metadata && Object.keys(prompt.metadata).length > 0 && (
                                        <>
                                            {prompt.metadata.version && (
                                                <Badge variant="outline">
                                                    v{prompt.metadata.version}
                                                </Badge>
                                            )}
                                            {prompt.metadata.agent && (
                                                <Badge variant="outline">
                                                    {prompt.metadata.agent}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <HugeiconsIcon icon={Calendar03Icon} size={14} />
                                        <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <HugeiconsIcon icon={Clock01Icon} size={14} />
                                        <span>{new Date(prompt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full rounded-full gap-2 group/btn"
                                    onClick={() => {
                                        setSelectedPrompt(prompt);
                                        setIsViewDialogOpen(true);
                                    }}
                                >
                                    View Details
                                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CreatePromptDialog
                isOpen={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                onUpload={handleUploadPrompt}
            />

            <ViewPromptDialog
                prompt={selectedPrompt}
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
            />

            <EditPromptTargetingDialog
                isOpen={isTargetingDialogOpen}
                onOpenChange={setIsTargetingDialogOpen}
                prompt={selectedPrompt}
                onUpdate={handleUpdateTargeting}
            />
        </div>
    );
};

export default SystemPromptsPage;
