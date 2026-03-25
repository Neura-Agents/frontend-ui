import React, { useState, useRef } from 'react';
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
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, File01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Typography } from '@/components/ui/typography';
import { VisibilitySelector } from '@/components/reusable/VisibilitySelector';

interface CreateKgDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (name: string, description: string, visibility: 'public' | 'private', files: File[]) => void;
}

export const CreateKgDialog: React.FC<CreateKgDialogProps> = ({
    isOpen,
    onOpenChange,
    onCreate
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('private');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate(name, description, visibility, selectedFiles);
        // Reset and close
        setName('');
        setDescription('');
        setVisibility('private');
        setSelectedFiles([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Create Knowledge Graph</DialogTitle>
                    <DialogDescription>
                        Define a new semantic network by uploading source documents for relationship extraction.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="kg-name" className="text-sm font-semibold">Knowledge Graph Name</Label>
                            <Input
                                id="kg-name"
                                placeholder="e.g., Product Ontology, User Interests..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="kg-desc" className="text-sm font-semibold">Description</Label>
                            <Textarea
                                id="kg-desc"
                                placeholder="Briefly describe the domain of this knowledge graph..."
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

                    {/* File Upload Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Source Documents</Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group border-2 border-dashed border-border/60 rounded-2xl p-8 transition-all hover:bg-primary/5 hover:border-primary/40 cursor-pointer flex flex-col items-center justify-center gap-3 text-center"
                        >
                            <div className="size-12 rounded-full bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                <HugeiconsIcon icon={Upload01Icon} size={24} />
                            </div>
                            <div>
                                <Typography className="text-sm font-semibold text-foreground/80 block">Click to upload files</Typography>
                                <Typography scale="sm" className="text-muted-foreground mt-1">Upload unstructured data for entity & relation extraction</Typography>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                            <div className="max-h-[120px] overflow-y-auto space-y-2 pr-1">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/40 group/item">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <HugeiconsIcon icon={File01Icon} size={18} className="text-muted-foreground shrink-0" />
                                            <span className="text-sm font-medium truncate">{file.name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                            className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover/item:opacity-100"
                                        >
                                            <HugeiconsIcon icon={Cancel01Icon} size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="default"
                        className="rounded-full"
                        onClick={handleCreate}
                        disabled={!name.trim()}
                    >
                        Create Knowledge Graph
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
