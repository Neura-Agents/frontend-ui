import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockedIcon, Globe02Icon } from '@hugeicons/core-free-icons';

interface VisibilitySelectorProps {
    value: string;
    onChange: (value: 'public' | 'private') => void;
    label?: string;
    id?: string;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({ 
    value, 
    onChange, 
    label = "Visibility", 
    id = "visibility-select" 
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold ml-1 text-muted-foreground/80">{label}</Label>
            <Select value={value} onValueChange={(val) => onChange(val as 'public' | 'private')}>
                <SelectTrigger id={id} className="bg-muted/10 border-border/40 h-10 rounded-xl focus:ring-primary/10">
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
    );
};
