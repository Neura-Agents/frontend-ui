import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    InformationCircleIcon,
    Cancel01Icon,
    LockedIcon,
    Globe02Icon
} from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { modelsService, type Model } from '@/services/modelsService';

interface AgentConfigurationProps {
    description: string;
    setDescription: (val: string) => void;
    systemPrompt: string;
    setSystemPrompt: (val: string) => void;
    model: string;
    setModel: (val: string) => void;
    temperature: number[];
    setTemperature: (val: number[]) => void;
    tags: string[];
    setTags: (val: string[]) => void;
    visibility: string;
    setVisibility: (val: string) => void;
    maxTokens: number[];
    setMaxTokens: (val: number[]) => void;
}

const AgentConfiguration: React.FC<AgentConfigurationProps> = ({
    description, setDescription,
    systemPrompt, setSystemPrompt,
    model, setModel,
    temperature, setTemperature,
    tags, setTags,
    visibility, setVisibility,
    maxTokens, setMaxTokens
}) => {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const fetchedModels = await modelsService.getModels();
                setModels(fetchedModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModels();
    }, []);

    // Auto-select first model if none is selected and we are NOT in edit mode (or agent load is done)
    useEffect(() => {
        if (!isLoading && models.length > 0 && !model) {
            setModel(models[0].model_name);
        }
    }, [isLoading, models, model, setModel]);


    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                setTagInput("");
            }
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const clearTags = () => {
        setTags([]);
    };

    return (
        <div className="flex flex-col h-full space-y-7 pt-2 overflow-y-auto custom-scrollbar p-4">
            {/* Identity Section */}
            <div className="space-y-2">
                <Label htmlFor="agent-description" className="text-xs font-semibold ml-1 text-muted-foreground/80">Short Description</Label>
                <Input
                    id="agent-description"
                    placeholder="e.g. A helpful assistant for financial analysis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-muted/10 border-border/40 focus:border-primary/40 focus:ring-primary/10 h-10 rounded-xl"
                />
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold ml-1 text-muted-foreground/80">Tags</Label>
                    {tags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 px-1 text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive hover:bg-transparent transition-all"
                            onClick={clearTags}
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 empty:hidden py-1">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="soft"
                            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-primary/10 bg-primary/5 text-primary text-[11px] animate-in zoom-in-95 duration-200"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(index)}
                                className="group/tag inline-flex items-center justify-center p-0.5 -mr-1 hover:bg-primary/10 rounded transition-colors"
                            >
                                <HugeiconsIcon
                                    icon={Cancel01Icon}
                                    size={12}
                                    strokeWidth={2.5}
                                    className="opacity-60 group-hover/tag:opacity-100"
                                />
                            </button>
                        </Badge>
                    ))}
                </div>

                <Input
                    placeholder="Type tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="bg-muted/10 border-border/40 focus:border-primary/40 focus:ring-primary/10 h-10 rounded-xl"
                />
            </div>

            {/* Visibility Section */}
            <div className="space-y-2">
                <Label htmlFor="agent-visibility" className="text-xs font-semibold ml-1 text-muted-foreground/80">Visibility</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="bg-muted/10 border-border/40 h-10 rounded-xl focus:ring-primary/10">
                        <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                        <SelectItem value="private">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={LockedIcon} size={16} />
                                <span>Private</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="public">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={Globe02Icon} size={16} />
                                <span>Public</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Brain Section */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="model-select" className="text-xs font-semibold ml-1 text-muted-foreground/80">Model Brain</Label>
                    </div>
                    <Select value={model} onValueChange={setModel} disabled={isLoading}>
                        <SelectTrigger className="bg-muted/10 border-border/40 h-10 rounded-xl focus:ring-primary/10">
                            <SelectValue placeholder={isLoading ? "Loading models..." : "Select a model"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            {models.length > 0 ? (
                                models.map((m) => (
                                    <SelectItem key={m.model_name} value={m.model_name}>
                                        <span className="font-medium">{m.model_name}</span>
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-xs text-center text-muted-foreground">
                                    No models available
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-2 bg-card/40 p-4 rounded-2xl border border-border/30">
                    <div className="flex items-center justify-between ml-1">
                        <div className="flex items-center gap-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground/80">Creativity (Temperature)</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                    Lower values are precise and factual. Higher values are creative and varied.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Typography scale="sm" weight="bold" className="text-primary font-mono">
                            {Number(temperature?.[0] || 0.7).toFixed(1)}
                        </Typography>

                    </div>
                    <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={1}
                        step={0.1}
                        className="py-1"
                    />
                    <div className="flex justify-between text-[8px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold px-1 mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                    </div>
                </div>

                <div className="space-y-4 pt-2 bg-card/40 p-4 rounded-2xl border border-border/30">
                    <div className="flex items-center justify-between ml-1">
                        <div className="flex items-center gap-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground/80">Max Tokens</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                    The maximum length of the model's response.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Typography scale="sm" weight="bold" className="text-primary font-mono">
                            {maxTokens[0]}
                        </Typography>
                    </div>
                    <Slider
                        value={maxTokens}
                        onValueChange={setMaxTokens}
                        min={2000}
                        max={64000}
                        step={256}
                        className="py-1"
                    />
                    <div className="flex justify-between text-[8px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold px-1 mt-1">
                        <span>Concise</span>
                        <span>Balanced</span>
                        <span>Extensive</span>
                    </div>
                </div>
            </div>

            {/* Guidelines Section */}
            <div className="space-y-3">
                <Label htmlFor="system-prompt" className="text-xs font-semibold ml-1 text-muted-foreground/80">System Instructions</Label>
                <Textarea
                    id="system-prompt"
                    placeholder="Define the agent's expertise, tone, and specific rules it must follow..."
                    className="min-h-[220px] bg-muted/10 border-border/40 focus:border-primary/40 focus:ring-primary/10 rounded-2xl resize-none leading-relaxed text-sm p-4 placeholder:opacity-40"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                />
            </div>

            <div className="h-4 shrink-0" />
        </div>
    );
};

export default AgentConfiguration;
