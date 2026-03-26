import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { DataTable } from '@/tables/platform-features/data-table';
import { getColumns } from '@/tables/platform-features/columns';
import { platformService } from '@/services/platformService';
import type { FeatureFlag } from '@/services/platformService';
import { useAlert } from '@/context/AlertContext';
import { Button } from '@/components/ui/button';
import { Refresh01Icon, InformationCircleIcon, Cancel01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const PlatformFeaturesPage: React.FC = () => {
    const [features, setFeatures] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingFeature, setEditingFeature] = useState<FeatureFlag | null>(null);
    const { showAlert } = useAlert();

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetUsers, setTargetUsers] = useState<string>('');
    const [targetRoles, setTargetRoles] = useState<string[]>([]);
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);
    const [rolloutPercentage, setRolloutPercentage] = useState<number>(100);

    const fetchFeatures = async () => {
        setLoading(true);
        try {
            const [featuresData, rolesData] = await Promise.all([
                platformService.getFeatures(),
                platformService.getRoles()
            ]);
            setFeatures(featuresData);
            setAvailableRoles(rolesData);
        } catch (error) {
            console.error("Failed to fetch features:", error);
            showAlert({
                title: "Error",
                description: "Failed to load platform data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const handleToggle = async (feature: FeatureFlag) => {
        try {
            const updated = await platformService.updateFeature(feature.id, {
                enabled: !feature.enabled
            });
            setFeatures(prev => prev.map(f => f.id === feature.id ? updated : f));
            showAlert({
                title: feature.enabled ? "Feature disabled" : "Feature enabled",
                description: `${feature.name} is now ${feature.enabled ? 'disabled' : 'enabled'} globally.`,
                variant: "default"
            });
        } catch (error) {
            showAlert({
                title: "Error",
                description: "Failed to update feature status",
                variant: "destructive"
            });
        }
    };

    const handleEdit = (feature: FeatureFlag) => {
        setEditingFeature(feature);
        setName(feature.name);
        setDescription(feature.description);
        setTargetUsers(feature.targeting_rules.users?.join(', ') || '');
        setTargetRoles(feature.targeting_rules.roles || []);
        setRolloutPercentage(feature.targeting_rules.percentage ?? 100);
        setIsEditing(true);
    };

    const handleSaveRules = async () => {
        if (!editingFeature) return;

        try {
            const users = targetUsers.split(',').map(u => u.trim()).filter(u => u !== '');
            const roles = targetRoles;

            const updated = await platformService.updateFeature(editingFeature.id, {
                name,
                description,
                targeting_rules: {
                    users,
                    roles,
                    percentage: rolloutPercentage
                }
            });

            setFeatures(prev => prev.map(f => f.id === editingFeature.id ? updated : f));
            setIsEditing(false);
            showAlert({
                title: "Rules Updated",
                description: `Targeting rules for ${editingFeature.name} have been saved.`,
                variant: "default"
            });
        } catch (error: any) {
            showAlert({
                title: "Error",
                description: error.response?.data?.error || "Failed to save targeting rules",
                variant: "destructive"
            });
        }
    };

    const toggleRole = (roleName: string) => {
        setTargetRoles(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        );
    };

    const columns = getColumns(handleToggle, handleEdit);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 pr-4 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full flex flex-row items-center justify-between">
                <div>
                    <Typography variant="page-header">
                        Platform Features
                    </Typography>
                    <Typography variant="page-description">
                        Manage experimental features and rollout strategies for the platform.
                    </Typography>
                </div>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={fetchFeatures}>
                    <HugeiconsIcon icon={Refresh01Icon} size={18} />
                </Button>
            </section>

            {/* ─── CONTENT ─── */}
            <section className="px-4 md:px-0">
                <div className={loading ? "opacity-50 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                    <DataTable columns={columns} data={features} />
                </div>
            </section>

            {/* ─── ADVANCED RULES DIALOG ─── */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            Targeting Rules
                        </DialogTitle>
                        <DialogDescription>
                            Configure who can see <strong>{editingFeature?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-muted-foreground">Feature Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="key" className="text-muted-foreground">Key (Read-only)</Label>
                                <Input
                                    id="key"
                                    value={editingFeature?.key}
                                    disabled
                                    className="bg-muted/50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>

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
                                        {availableRoles.map(role => (
                                            <DropdownMenuCheckboxItem
                                                key={role.id}
                                                checked={targetRoles.includes(role.name)}
                                                onCheckedChange={() => toggleRole(role.name)}
                                            >
                                                {role.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60">Select roles that should have access to this feature.</p>
                        </div>

                        <div className="space-y-4 pt-4 bg-card/40 p-4 rounded-2xl border border-border/30">
                            <div className="flex items-center justify-between ml-1">
                                <div className="flex items-center gap-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground/80">Rollout Percentage</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[200px]">
                                            Percentage of users who will have this feature enabled.
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Typography scale="sm" weight="bold" className="text-primary font-mono">
                                    {rolloutPercentage}%
                                </Typography>
                            </div>
                            <Slider
                                value={[rolloutPercentage]}
                                onValueChange={(val) => setRolloutPercentage(val[0])}
                                min={0}
                                max={100}
                                step={5}
                                className="py-1"
                            />
                            <div className="flex justify-between text-[8px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold px-1 mt-1">
                                <span>Off</span>
                                <span>Partial Rollout</span>
                                <span>100% (Global)</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" className="rounded-full" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSaveRules} className="rounded-full">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PlatformFeaturesPage;
