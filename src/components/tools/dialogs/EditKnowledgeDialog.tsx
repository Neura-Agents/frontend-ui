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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VisibilitySelector } from '@/components/reusable/VisibilitySelector';

interface EditKnowledgeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    item: { id: string; name: string; description: string; visibility: 'public' | 'private' } | null;
    onUpdate: (id: string, name: string, description: string, visibility: 'public' | 'private') => void;
    type: 'base' | 'graph';
}

export const EditKnowledgeDialog: React.FC<EditKnowledgeDialogProps> = ({
    isOpen,
    onOpenChange,
    item,
    onUpdate,
    type
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('private');

    useEffect(() => {
        if (item && isOpen) {
            setName(item.name);
            setDescription(item.description || '');
            setVisibility(item.visibility || 'private');
        }
    }, [item, isOpen]);

    const handleUpdate = () => {
        if (!name.trim() || !item) return;
        onUpdate(item.id, name, description, visibility);
        onOpenChange(false);
    };

    const title = type === 'base' ? 'Edit Knowledge Base' : 'Edit Knowledge Graph';
    const descriptionText = type === 'base' ?
        'Update the name and description of your knowledge base.' :
        'Update the name and description of your knowledge graph.';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {descriptionText}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 pb-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-kb-name" className="text-sm font-semibold">Name</Label>
                            <Input
                                id="edit-kb-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-kb-desc" className="text-sm font-semibold">Description</Label>
                            <Textarea
                                id="edit-kb-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px] rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/20 resize-none"
                            />
                        </div>
                        <VisibilitySelector 
                            value={visibility} 
                            onChange={setVisibility} 
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="default"
                        className="rounded-full px-6"
                        onClick={handleUpdate}
                        disabled={!name.trim()}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
