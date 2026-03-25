import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import IconGallery from '@/components/reusable/IconGallery';

interface IconPickerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIcon: string;
    onSelect: (iconName: string) => void;
}

export const IconPickerDialog: React.FC<IconPickerDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedIcon,
    onSelect,
}) => {
    const handleSelect = (name: string) => {
        onSelect(name);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Tool Icon</DialogTitle>
                    <DialogDescription>
                        Choose an icon that best represents this tool.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6">
                    <IconGallery
                        pageSize={24}
                        lg={8}
                        md={6}
                        sm={4}
                        selectMode
                        selectedIcon={selectedIcon}
                        onSelect={handleSelect}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
