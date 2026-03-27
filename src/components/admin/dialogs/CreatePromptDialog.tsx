import React, { useState, useRef, useEffect } from 'react';
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
import { Upload01Icon, File01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Typography } from '@/components/ui/typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { platformService } from '@/services/platformService';

interface CreatePromptDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUpload: (file: File, name: string, type: string) => Promise<void>;
}

export const CreatePromptDialog: React.FC<CreatePromptDialogProps> = ({
    isOpen,
    onOpenChange,
    onUpload
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('agent-execution');
    const [promptTypes, setPromptTypes] = useState<{ id: string, name: string, description: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const types = await platformService.getPromptTypes();
                setPromptTypes(types);
                if (types.length > 0) {
                    setType(types[0].name);
                }
            } catch (error) {
                console.error('Failed to fetch prompt types', error);
            }
        };
        fetchTypes();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!name.trim() || !selectedFile || !type) return;
        
        setIsSubmitting(true);
        try {
            await onUpload(selectedFile, name, type);
            // Reset and close
            setName('');
            if (promptTypes.length > 0) setType(promptTypes[0].name);
            setSelectedFile(null);
            onOpenChange(false);
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Upload System Prompt</DialogTitle>
                    <DialogDescription>
                        Upload a new system prompt file. This will automatically become the active prompt for its type.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="prompt-name" className="text-sm font-semibold">Prompt Name</Label>
                            <Input
                                id="prompt-name"
                                placeholder="e.g., Default Agent Prompt V2"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/20"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="prompt-type" className="text-sm font-semibold">Prompt Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {promptTypes.map((pt) => (
                                        <SelectItem key={pt.id} value={pt.name}>
                                            <span className="capitalize">{pt.name.replace(/-/g, ' ')}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Prompt File (.prompt or .txt)</Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`group border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                                selectedFile ? 'bg-primary/5 border-primary/40' : 'border-border/60 hover:bg-muted/30 hover:border-primary/20'
                            }`}
                        >
                            <div className={`size-12 rounded-full border flex items-center justify-center transition-all ${
                                selectedFile ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/50 border-border/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20'
                            }`}>
                                <HugeiconsIcon icon={Upload01Icon} size={24} />
                            </div>
                            <div>
                                <Typography className="text-sm font-semibold text-foreground/80 block">
                                    {selectedFile ? 'Change prompt file' : 'Click to upload prompt'}
                                </Typography>
                                <Typography scale="sm" className="text-muted-foreground mt-1 text-xs">
                                    {selectedFile ? `Current: ${selectedFile.name}` : 'Upload your system prompt template'}
                                </Typography>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".prompt,.txt,.md"
                                onChange={handleFileChange}
                            />
                        </div>

                        {selectedFile && (
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/40">
                                <div className="flex items-center gap-3 min-w-0">
                                    <HugeiconsIcon icon={File01Icon} size={18} className="text-muted-foreground shrink-0" />
                                    <span className="text-xs font-medium truncate">{selectedFile.name}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                    className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-8">
                    <Button variant="ghost" className="rounded-full px-6" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button
                        variant="default"
                        className="rounded-full px-6"
                        onClick={handleUpload}
                        disabled={!name.trim() || !selectedFile || isSubmitting}
                    >
                        {isSubmitting ? 'Uploading...' : 'Activate Prompt'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
