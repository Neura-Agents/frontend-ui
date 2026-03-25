import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    PencilEdit01Icon,
    Delete02Icon,
    PlayIcon,
    Alert01Icon,
    LockedIcon,
    Globe02Icon
} from '@hugeicons/core-free-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useAuth } from '@/context/AuthContext';

export interface ToolParameter {
    name: string;
    in: 'query' | 'path' | 'header' | 'body';
    required: boolean;
    type: string;
    description: string;
    itemType?: string;
    children?: ToolParameter[];
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    method: string;
    baseUrl: string;
    path: string;
    authType: string;
    authDetails?: {
        key?: string;
        value?: string;
        token?: string;
        username?: string;
        password?: string;
    };
    parameters: ToolParameter[];
    icon?: string;
    visibility: 'public' | 'private';
    user_id?: string;
}

interface ToolCardProps {
    tool: Tool;
    onEdit: (tool: Tool) => void;
    onDelete: (id: string) => void;
    onTest?: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onEdit, onDelete, onTest }) => {
    const { user } = useAuth();
    const isOwner = user?.id && tool.user_id && String(user.id).toLowerCase() === String(tool.user_id).toLowerCase();

    return (
        <Card className="overflow-hidden relative group">
            <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <div className="flex gap-1 shrink-0 ml-2 items-center">
                        {!tool.baseUrl && (
                            <div className="flex gap-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="text-warning hover:bg-primary/10" iconOnly><HugeiconsIcon icon={Alert01Icon} /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>URL not added</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                        {isOwner && (
                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                {onTest && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" iconOnly onClick={() => onTest(tool)} className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary">
                                                <HugeiconsIcon icon={PlayIcon} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Test Tool</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" iconOnly onClick={() => onEdit(tool)} className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary">
                                            <HugeiconsIcon icon={PencilEdit01Icon} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit Tool</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" iconOnly className="h-7 w-7 rounded-full hover:bg-destructive/20 hover:text-destructive" onClick={() => onDelete(tool.id)}>
                                            <HugeiconsIcon icon={Delete02Icon} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete Tool</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="">

                <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-muted/40 px-2 py-1.5 rounded-full truncate border border-border/30">
                        <Badge variant="soft">{tool.method}</Badge>
                        <Typography scale='sm' className='truncate text-muted-foreground'>{tool.path}</Typography>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <Badge variant="soft">{tool.parameters.length} {tool.parameters.length === 1 ? "Param" : "Params"}</Badge>
                        <Badge variant='outline'>{tool.authType}</Badge>
                        <Badge variant="outline" className="capitalize py-0.5 px-2.5 rounded-full border-border/60">
                            {tool.visibility === 'public' ? (
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
            </CardContent>
        </Card>
    );
};
