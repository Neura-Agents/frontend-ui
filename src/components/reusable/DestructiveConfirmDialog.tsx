import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DestructiveConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const DestructiveConfirmDialog: React.FC<DestructiveConfirmDialogProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className='text-destructive'>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" className="rounded-full">{cancelText}</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
