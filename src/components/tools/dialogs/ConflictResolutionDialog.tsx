import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import type { Tool } from '@/components/tools/tool-card';

export interface ConflictItem {
    existing: any;
    incoming: Tool;
}

interface ConflictResolutionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    conflicts: ConflictItem[];
    onSkipCurrent: () => void;
    onReplaceCurrent: () => void;
    onSkipAll: () => void;
    onReplaceAll: () => void;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
    isOpen,
    onOpenChange,
    conflicts,
    onSkipCurrent,
    onReplaceCurrent,
    onSkipAll,
    onReplaceAll,
}) => {
    const currentConflict = conflicts[0];

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Parent handles clearing conflicts via onOpenChange
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Conflict</DialogTitle>
                    <DialogDescription>
                        {conflicts.length > 1
                            ? `There are ${conflicts.length} tools that already exist. How would you like to proceed?`
                            : `The tool "${currentConflict?.incoming.name}" already exists.`}
                    </DialogDescription>
                </DialogHeader>

                {currentConflict && (
                    <div className="py-4 space-y-4">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                            <Typography
                                scale="xs"
                                weight="bold"
                                className="uppercase text-muted-foreground mb-2 block"
                            >
                                Currently Resolving
                            </Typography>
                            <div className="flex items-center justify-between">
                                <Typography weight="semibold">{currentConflict.incoming.name}</Typography>
                                <Badge variant="soft">{currentConflict.incoming.method}</Badge>
                            </div>
                            <Typography scale="xs" className="text-muted-foreground mt-1">
                                {currentConflict.incoming.path}
                            </Typography>
                        </div>

                        {conflicts.length > 1 && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={onSkipAll}>
                                    Skip All
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1" onClick={onReplaceAll}>
                                    Replace All
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="sm:justify-between items-center">
                    <Typography scale="xs" className="text-muted-foreground hidden sm:block">
                        {conflicts.length} remaining
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onSkipCurrent}>Skip Current</Button>
                        <Button variant="default" onClick={onReplaceCurrent}>Replace Current</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
