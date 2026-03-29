import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowUpRight01Icon,
    PencilEdit02Icon,
    Delete02Icon,
    Globe02Icon,
    LockedIcon,
    Chat01Icon
} from '@hugeicons/core-free-icons';
import * as AllIcons from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export interface Agent {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    status: 'published' | 'draft';
    version: string;
    tags: string[];
    created_at: string;
    user_id?: string;
    visibility?: string;
    model_name?: string;
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    capabilities?: any[];
}
const KONG_URL = import.meta.env.VITE_API_URL;

interface AgentCardProps {
    agent: Agent;
    onDelete?: (id: string, e: React.MouseEvent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onDelete }) => {
    const { user } = useAuth();
    const isOwner = user?.id && agent.user_id && String(user.id).toLowerCase() === String(agent.user_id).toLowerCase();

    const openAgentDiscovery = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const discoveryUrl = `${KONG_URL}/${agent.slug}/.well-known/agent.json`;
        window.open(discoveryUrl, '_blank');
    };

    return (
        <Card className="flex flex-col h-full hover:border-primary/40 transition-all group border-border relative overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-2xl border border-border">
                                <HugeiconsIcon
                                    icon={(AllIcons as any)[agent.icon] || AllIcons.UserCircle02Icon}
                                    className="text-foreground size-5"
                                />
                            </div>
                            <CardTitle className="text-xl">
                                {agent.name}
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground mr-1">
                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to={`/agent-chat/${agent.slug}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                            >
                                                <HugeiconsIcon icon={Chat01Icon} size={14} />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Chat with Agent</p>
                                    </TooltipContent>
                                </Tooltip>
                                {isOwner && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link to={`/agent-edit/${agent.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                    >
                                                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit Agent</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        {onDelete && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-destructive/20 hover:text-destructive"
                                                        onClick={(e) => onDelete(agent.id, e)}
                                                    >
                                                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Agent</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed">
                        {agent.description}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                        {agent.version}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                        {agent.model_name || 'No Model'}
                    </Badge>
                    <Badge
                        variant={agent.status === 'published' ? 'soft' : 'outline'}
                        className="capitalize"
                    >
                        {agent.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                        {agent.visibility === 'public' ? (
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
                <div className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        className="rounded-full w-full gap-2"
                        onClick={openAgentDiscovery}
                    >
                        View Agent Card
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentCard;
