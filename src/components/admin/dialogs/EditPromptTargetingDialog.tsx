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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Cancel01Icon,
    Add01Icon
} from '@hugeicons/core-free-icons';
import { platformService, type Prompt, type Role } from '@/services/platformService';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EditPromptTargetingDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    prompt: Prompt | null;
    onUpdate: (id: string, targeting: { users: string[], agents: string[], roles: string[] }) => Promise<void>;
}

export const EditPromptTargetingDialog: React.FC<EditPromptTargetingDialogProps> = ({
    isOpen,
    onOpenChange,
    prompt,
    onUpdate
}) => {
    const [targetUsers, setTargetUsers] = useState('');
    const [targetAgents, setTargetAgents] = useState('');
    const [targetRoles, setTargetRoles] = useState<string[]>([]);

    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && prompt) {
            setTargetUsers(prompt.targeting_users?.join(', ') || '');
            setTargetAgents(prompt.targeting_agents?.join(', ') || '');
            setTargetRoles(prompt.targeting_roles || []);
            fetchAvailableData();
        }
    }, [isOpen, prompt]);

    const fetchAvailableData = async () => {
        setIsLoading(true);
        try {
            const rolesData = await platformService.getRoles();
            setAvailableRoles(rolesData);
        } catch (error) {
            console.error('Failed to fetch targeting data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRole = (roleName: string) => {
        setTargetRoles(prev =>
            prev.includes(roleName) ? prev.filter(r => r !== roleName) : [...prev, roleName]
        );
    };

    const handleSave = async () => {
        if (!prompt) return;
        setIsSubmitting(true);
        try {
            const users = targetUsers.split(',').map(u => u.trim()).filter(u => u !== '');
            const agents = targetAgents.split(',').map(a => a.trim()).filter(a => a !== '');

            await onUpdate(prompt.id, { users, agents, roles: targetRoles });
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update targeting', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Targeting Rules
                    </DialogTitle>
                    <DialogDescription>
                        Configure who can use <strong>{prompt?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Users Targeting */}
                    <div className="space-y-2">
                        <Label htmlFor="users" className="text-muted-foreground">Target User IDs</Label>
                        <Input
                            id="users"
                            placeholder="user-1, user-2..."
                            value={targetUsers}
                            onChange={(e) => setTargetUsers(e.target.value)}
                            className="bg-background/50"
                        />
                        <p className="text-[10px] text-muted-foreground/60">Comma-separated list of UUIDs or usernames.</p>
                    </div>

                    {/* Agents Targeting */}
                    <div className="space-y-2">
                        <Label htmlFor="agents" className="text-muted-foreground">Target Agent Slugs</Label>
                        <Input
                            id="agents"
                            placeholder="agent-slug-1, agent-slug-2..."
                            value={targetAgents}
                            onChange={(e) => setTargetAgents(e.target.value)}
                            className="bg-background/50"
                        />
                        <p className="text-[10px] text-muted-foreground/60">Comma-separated list of agent identifier slugs (e.g., medical-assistant).</p>
                    </div>

                    {/* Roles Targeting */}
                    <div className="space-y-3">
                        <Label className="text-muted-foreground">Target Roles</Label>
                        <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-xl bg-card border border-border">
                            <div className='flex flex-wrap gap-2'>
                                {targetRoles.length > 0 ? (
                                    targetRoles.map(role => (
                                        <Badge
                                            key={role}
                                            variant="soft"
                                            className="gap-1.5 px-2.5"
                                        >
                                            {role}
                                            <button
                                                onClick={() => toggleRole(role)}
                                                className="hover:text-destructive transition-colors"
                                            >
                                                <HugeiconsIcon icon={Cancel01Icon} size={10} />
                                            </button>
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-muted-foreground/50 py-1">No roles selected (Global)</span>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-xs" iconOnly className="rounded-full">
                                        <HugeiconsIcon icon={Add01Icon} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[200px] rounded-xl">
                                    {isLoading ? (
                                        <div className="p-2 text-center text-xs text-muted-foreground">Loading roles...</div>
                                    ) : availableRoles.length === 0 ? (
                                        <div className="p-2 text-center text-xs text-muted-foreground">No roles found</div>
                                    ) : (
                                        availableRoles.map(role => (
                                            <DropdownMenuCheckboxItem
                                                key={role.id}
                                                checked={targetRoles.includes(role.name)}
                                                onCheckedChange={() => toggleRole(role.name)}
                                            >
                                                {role.name}
                                            </DropdownMenuCheckboxItem>
                                        ))
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60">Select roles that should have access to this prompt template.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button
                        variant="default"
                        className="rounded-full px-8"
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
