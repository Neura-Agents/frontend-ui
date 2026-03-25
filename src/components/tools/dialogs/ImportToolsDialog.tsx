import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon, Trash2 } from '@hugeicons/core-free-icons';
import { InputField } from '@/components/ui/input-field';

interface ImportToolsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    importUrl: string;
    onImportUrlChange: (url: string) => void;
    previewFileName: string;
    onPreviewFileNameChange: (name: string) => void;
    /** Controlled by parent for JSON parsing; not rendered inside dialog */
    previewJson?: string;
    onPreviewJsonChange: (json: string) => void;
    isImportLoading: boolean;
    onFetchUrl: () => void;
    onConfirmImport: () => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportToolsDialog: React.FC<ImportToolsDialogProps> = ({
    isOpen,
    onOpenChange,
    importUrl,
    onImportUrlChange,
    previewFileName,
    onPreviewFileNameChange,
    onPreviewJsonChange,
    isImportLoading,
    onFetchUrl,
    onConfirmImport,
    onFileUpload,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            onPreviewFileNameChange('');
            onPreviewJsonChange('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{previewFileName ? 'Confirm Import' : 'Import from URL'}</DialogTitle>
                    <DialogDescription>
                        {previewFileName
                            ? 'Review the source before importing.'
                            : 'Enter the URL of your OpenAPI spec (json).'}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className="py-4 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-500">
                        <InputField
                            label="OpenAPI URL"
                            placeholder="https://api.example.com/openapi.json"
                            value={importUrl}
                            onChange={(e) => onImportUrlChange(e.target.value)}
                            disabled={!!previewFileName}
                        />

                        {!previewFileName && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-muted-foreground/80">Local File</label>
                                <Button
                                    variant="outline"
                                    className="rounded-xl gap-2 h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all w-full"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <HugeiconsIcon icon={Upload01Icon} className="size-5 text-primary" />
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="font-semibold">Choose JSON File</span>
                                        <span className="text-[10px] text-muted-foreground">Upload from your computer</span>
                                    </div>
                                </Button>
                            </div>
                        )}

                        {previewFileName && (
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-base tracking-tight leading-none">
                                    {previewFileName}
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    iconOnly
                                    onClick={() => {
                                        onPreviewFileNameChange('');
                                        onPreviewJsonChange('');
                                    }}
                                >
                                    <HugeiconsIcon icon={Trash2} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => handleClose(false)}>Cancel</Button>
                    {previewFileName ? (
                        <Button onClick={onConfirmImport}>Import Tools</Button>
                    ) : (
                        <Button onClick={onFetchUrl} disabled={isImportLoading}>
                            {isImportLoading ? 'Fetching...' : 'Fetch Tools'}
                        </Button>
                    )}
                </DialogFooter>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileUpload}
                    className="hidden"
                    accept=".json"
                />
            </DialogContent>
        </Dialog>
    );
};
