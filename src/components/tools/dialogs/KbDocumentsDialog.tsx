import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/tables/knowledge-base/data-table';
import { getColumns, type Document } from '@/tables/knowledge-base/columns';

import { knowledgeService } from '@/services/knowledgeService';
import { useAlert } from '@/context/AlertContext';

interface KbDocumentsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    kbName: string | undefined;
    documents: Document[];
    kbId: string | undefined;
    type: 'base' | 'graph';
    onUploadSuccess?: () => void;
    onDeleteDocument?: (docId: string, docName: string) => void;
}

interface PendingDoc {
    id: string;
    file: File;
}

export const KbDocumentsDialog: React.FC<KbDocumentsDialogProps> = ({
    isOpen,
    onOpenChange,
    kbName,
    documents,
    kbId,
    type,
    onUploadSuccess,
    onDeleteDocument
}) => {
    const { showAlert } = useAlert();
    const [localDocs, setLocalDocs] = useState<Document[]>(documents);
    const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local documents when initial documents prop changes
    useEffect(() => {
        setLocalDocs(documents);
        if (!isOpen) {
            setPendingDocs([]);
            setActiveWorkflowId(null);
        }
    }, [documents, isOpen]);

    // SSE Subscription logic
    useEffect(() => {
        if (!activeWorkflowId || !isOpen) return;

        console.log(`Subscribing to ingestion SSE: ${activeWorkflowId}`);
        const unsubscribe = knowledgeService.subscribeToIngestion(
            activeWorkflowId, 
            type, 
            (eventType, data) => {
                console.log('SSE Event:', eventType, data);
                
                if (eventType === 'doc_progress' || eventType === 'doc_start' || eventType === 'doc_completed' || eventType === 'doc_failed') {
                    const { docId, processedChunks, totalChunks } = data;
                    
                    setLocalDocs(prev => prev.map(doc => {
                        if (doc.id === docId) {
                            return {
                                ...doc,
                                status: eventType === 'doc_completed' ? 'completed' : 
                                        eventType === 'doc_failed' ? 'failed' : 'processing',
                                processed_chunks: processedChunks !== undefined ? processedChunks : doc.processed_chunks,
                                total_chunks: totalChunks !== undefined ? totalChunks : doc.total_chunks
                            };
                        }
                        return doc;
                    }));
                }

                if (eventType === 'status' && data.status === 'active') {
                    // Ingestion fully complete
                    showAlert({ title: 'Success', description: 'Knowledge ingestion complete', variant: 'success' });
                    setActiveWorkflowId(null);
                    if (onUploadSuccess) onUploadSuccess();
                }

                if (eventType === 'status' && data.status === 'failed') {
                    const message = data.message || 'Workflow finished with errors';
                    if (message.toLowerCase().includes('insufficient balance') || message.toLowerCase().includes('insufficient credits')) {
                         showAlert({ 
                            title: 'Payment Required', 
                            description: `Ingestion stopped due to insufficient balance. Please top up your credits to continue.`, 
                            variant: 'destructive' 
                        });
                    } else {
                        showAlert({ title: 'Ingestion Failed', description: message, variant: 'destructive' });
                    }
                    setActiveWorkflowId(null);
                }
            }
        );

        return () => {
            console.log('Unsubscribing from SSE');
            unsubscribe();
        };
    }, [activeWorkflowId, isOpen, type]);

    const hasNewDocs = pendingDocs.length > 0;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const newPending: PendingDoc[] = fileArray.map((file, index) => ({
            id: `temp-${Date.now()}-${index}`,
            file
        }));

        setPendingDocs(prev => [...prev, ...newPending]);

        const newDocs: Document[] = newPending.map(({ id, file }) => ({
            id,
            storageId: '',
            name: file.name,
            type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: new Date().toISOString().split('T')[0],
            isNew: true,
            status: 'pending'
        }));

        setLocalDocs(prev => [...newDocs, ...prev]);
        event.target.value = '';
    };

    const handleSave = async () => {
        if (!kbId || pendingDocs.length === 0) return;

        try {
            setIsUploading(true);
            const filesToUpload = pendingDocs.map(p => p.file);
            const response = await knowledgeService.uploadDocuments(kbId, type, filesToUpload);
            
            showAlert({ title: 'Ingestion Started', description: 'Your documents are being processed.', variant: 'success' });
            
            // The response contains the initial document objects and the workflowId
            if (response.documents) {
                // Replace temp docs with actual docs from server
                const actualDocs = response.documents.map((d: any) => ({
                    id: d.id,
                    storageId: d.storage_id,
                    name: d.file_name,
                    type: d.file_type.split('/')[1]?.toUpperCase() || 'FILE',
                    size: `${(d.file_size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadedAt: new Date(d.uploaded_at).toISOString().split('T')[0],
                    status: 'processing',
                    processed_chunks: 0,
                    total_chunks: 0
                }));

                setLocalDocs(prev => {
                    const nonTemp = prev.filter(d => !d.id.startsWith('temp-'));
                    return [...actualDocs, ...nonTemp];
                });
            }

            setPendingDocs([]);
            if (response.workflowId) {
                setActiveWorkflowId(response.workflowId);
            }
        } catch (error: any) {
            if (error.status === 402) {
                showAlert({ 
                    title: 'Payment Required', 
                    description: `Insufficient balance: ${error.message}. Please top up your credits to ingest documents.`, 
                    variant: 'destructive' 
                });
            } else {
                showAlert({ title: 'Error', description: 'Failed to upload documents', variant: 'destructive' });
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setLocalDocs(documents);
        setPendingDocs([]);
    };

    const handleInternalDelete = (docId: string, docName: string) => {
        if (docId.startsWith('temp-')) {
            setLocalDocs(prev => prev.filter(d => d.id !== docId));
            setPendingDocs(prev => prev.filter(p => p.id !== docId));
        } else if (onDeleteDocument) {
            onDeleteDocument(docId, docName);
        }
    };

    const columns = getColumns(handleInternalDelete);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div>
                            <DialogTitle>Documents for {kbName}</DialogTitle>
                            <DialogDescription>
                                Explore the context files available in this {type === 'base' ? 'knowledge base' : 'knowledge graph'}.
                            </DialogDescription>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="default"
                            className='rounded-full w-fit'
                            onClick={handleUploadClick}
                            disabled={isUploading || !!activeWorkflowId}
                        >
                            Upload Documents
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 px-8 pb-8 overflow-y-auto mt-2">
                    <DataTable
                        columns={columns}
                        data={localDocs}
                    />
                </div>

                {hasNewDocs && !activeWorkflowId && (
                    <DialogFooter className="animate-in slide-in-from-bottom-2 duration-300 gap-2">
                        <Button variant="ghost" className="rounded-full" onClick={handleCancel} disabled={isUploading}>Cancel</Button>
                        <Button variant="default" className="rounded-full" onClick={handleSave} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Start Ingestion'}
                        </Button>
                    </DialogFooter>
                )}
                
                {activeWorkflowId && (
                    <div className="px-8 pb-4 text-xs text-primary font-medium flex items-center gap-2 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Live processing documents... Keep this window open for progress updates.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
