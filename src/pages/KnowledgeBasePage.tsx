import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Search02Icon,
    Refresh01Icon,
    Add01Icon,
    ArrowRight01Icon,
    Folder01Icon,
    Calendar03Icon,
    PencilEdit02Icon,
    Delete02Icon,
    LockedIcon,
    Globe02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { KbDocumentsDialog } from '@/components/tools/dialogs/KbDocumentsDialog';
import { CreateKbDialog } from '@/components/tools/dialogs/CreateKbDialog';
import { EditKnowledgeDialog } from '@/components/tools/dialogs/EditKnowledgeDialog';
import { DestructiveConfirmDialog } from '@/components/reusable/DestructiveConfirmDialog';
import Pagination from '@/components/ui/pagination';
import { useAuth } from '@/context/AuthContext';
import { knowledgeService, type KnowledgeBase, type KnowledgeDocument } from '@/services/knowledgeService';
import { useAlert } from '@/context/AlertContext';
import { ExecuteToolDialog } from '@/components/tools/dialogs/ExecuteToolDialog';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { useUmami } from '@/hooks/useUmami';

const KnowledgeBasePage: React.FC = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const { track } = useUmami();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(9); // 3x3 grid
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null);

    // Dialog States
    const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [kbToEdit, setKbToEdit] = useState<KnowledgeBase | null>(null);
    const [isQueryDialogOpen, setIsQueryDialogOpen] = useState(false);
    const [testKB, setTestKB] = useState<KnowledgeBase | null>(null);

    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { }
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [isLoading, setIsLoading] = useState(true);

    const fetchKnowledgeBases = async (query?: string, pageNum: number = 1) => {
        try {
            setIsLoading(true);
            const response = await knowledgeService.getKnowledgeBases({ name: query, page: pageNum, limit });
            setKnowledgeBases(response.items);
            setTotalItems(response.total);
            setPage(response.page);
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to fetch knowledge bases', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    // Consolidated debounced fetch effect and URL sync
    React.useEffect(() => {
        const queryFromUrl = searchParams.get('q') || '';
        if (queryFromUrl !== searchQuery) {
            setSearchQuery(queryFromUrl);
        }
    }, [searchParams]);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            fetchKnowledgeBases(searchQuery, 1);
            
            // Update URL search params
            if (searchQuery) {
                setSearchParams({ q: searchQuery }, { replace: true });
            } else {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams, { replace: true });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, setSearchParams]);


    const handleExplore = async (kb: KnowledgeBase) => {
        try {
            setSelectedKB(kb);
            const docs = await knowledgeService.getDocuments(kb.id);
            setDocuments(docs);
            setIsDocumentsDialogOpen(true);
            
            // Track exploration
            track('kb-explore', {
                kb_id: kb.id,
                kb_name: kb.name,
                doc_count: kb.documentCount
            });
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to fetch documents', variant: 'destructive' });
        }
    };

    const handleCreateKB = async (name: string, description: string, visibility: 'public' | 'private', files: File[]) => {
        try {
            const newKB = await knowledgeService.createKnowledgeBase(name, description, visibility);
            if (files.length > 0) {
                await knowledgeService.uploadDocuments(newKB.id, 'base', files);
            }
            showAlert({ title: 'Success', description: 'Knowledge base created successfully', variant: 'success' });
            
            // Track creation
            track('kb-create', {
                kb_id: newKB.id,
                kb_name: name,
                file_count: files.length,
                visibility
            });
            
            setIsCreateDialogOpen(false);
            fetchKnowledgeBases();
        } catch (error: any) {
            if (error.status === 402) {
                showAlert({ 
                    title: 'Payment Required', 
                    description: `Insufficient balance: ${error.message}. Please go to the Billing page to top up.`, 
                    variant: 'destructive' 
                });
            } else {
                showAlert({ title: 'Error', description: 'Failed to create knowledge base', variant: 'destructive' });
            }
        }
    };

    const handleUpdateKB = async (id: string, name: string, description: string, visibility: 'public' | 'private') => {
        try {
            await knowledgeService.updateKnowledgeBase(id, name, description, visibility);
            showAlert({ title: 'Success', description: 'Knowledge base updated successfully', variant: 'success' });
            fetchKnowledgeBases();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to update knowledge base', variant: 'destructive' });
        }
    };

    const handleDeleteKB = (kb: KnowledgeBase, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            title: `Delete ${kb.name}`,
            description: 'Are you sure you want to delete this knowledge base? This action cannot be undone and all associated documents will be unlinked.',
            onConfirm: async () => {
                try {
                    await knowledgeService.deleteKnowledgeBase(kb.id);
                    showAlert({ title: 'Success', description: 'Knowledge base deleted successfully', variant: 'success' });
                    
                    // Track deletion
                    track('kb-delete', {
                        kb_id: kb.id,
                        kb_name: kb.name
                    });
                    
                    fetchKnowledgeBases();
                } catch (error) {
                    showAlert({ title: 'Error', description: 'Failed to delete knowledge base', variant: 'destructive' });
                }
            }
        });
    };

    const handleDeleteDocument = (docId: string, docName: string) => {
        setConfirmDialog({
            isOpen: true,
            title: `Delete Document`,
            description: `Are you sure you want to delete ${docName}? This action will permanently remove the document from the knowledge base.`,
            onConfirm: async () => {
                try {
                    await knowledgeService.deleteDocument(docId);
                    showAlert({ title: 'Success', description: 'Document deleted successfully', variant: 'success' });
                    // Refresh documents for selected KB
                    if (selectedKB) {
                        const docs = await knowledgeService.getDocuments(selectedKB.id);
                        setDocuments(docs);
                    }
                    fetchKnowledgeBases(); // Update counts
                } catch (error) {
                    showAlert({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
                }
            }
        });
    };

    const getStatusVariant = (status: KnowledgeBase['status']): "success" | "destructive" | "soft" => {
        switch (status) {
            case 'active': return 'success';
            case 'processing': return 'soft';
            case 'inactive': return 'soft';
            default: return 'soft';
        }
    };

    const formatDocsForDialog = (docs: KnowledgeDocument[]) => {
        return docs.map(doc => ({
            id: doc.id,
            storageId: doc.storage_id,
            name: doc.file_name,
            type: doc.file_type.split('/')[1]?.toUpperCase() || 'FILE',
            size: `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: new Date(doc.uploaded_at).toISOString().split('T')[0],
            fileUrl: doc.file_url,
            status: doc.status,
            processed_chunks: doc.processed_chunks,
            total_chunks: doc.total_chunks
        }));
    };

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0">
            {/* Header Section */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Knowledge Base
                </Typography>
                <Typography variant="page-description">
                    Manage and explore your organization's knowledge assets.
                </Typography>
            </section>

            {/* Actions Bar */}
            <header className="mb-4 space-y-4 px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            <HugeiconsIcon icon={Search02Icon} size={18} />
                        </div>
                        <Input
                            placeholder="Search knowledge bases..."
                            className="pl-10 rounded-full h-10 focus-visible:ring-primary/20 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="default"
                            className="rounded-full gap-2 h-10 px-5"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <HugeiconsIcon icon={Add01Icon} size={18} />
                            Create KB
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => fetchKnowledgeBases(searchQuery, 1)}>
                            <HugeiconsIcon icon={Refresh01Icon} size={18} />
                        </Button>
                    </div>
                </div>

                {totalItems > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-6">
                        <Badge variant="soft">
                            {totalItems}
                        </Badge>
                        <span>knowledge bases found</span>
                        {Math.ceil(totalItems / limit) > 1 && (
                            <span className="ml-auto text-primary/60">
                                Page {page} of {Math.ceil(totalItems / limit)}
                            </span>
                        )}
                    </div>
                )}
            </header>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 pb-20">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="flex flex-col h-full border-border animate-pulse bg-card/30">
                            <CardHeader>
                                <div className="space-y-2">
                                    <div className="h-7 w-2/3 bg-muted rounded" />
                                    <div className="h-4 w-full bg-muted/50 rounded" />
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-6 w-16 bg-muted/40 rounded-full" />
                                    <div className="h-6 w-16 bg-muted/40 rounded-full" />
                                </div>
                                <div className="h-10 w-full bg-muted/50 rounded-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : knowledgeBases.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-2">
                            <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                {searchQuery ? 'No match found' : 'Ready to build your knowledge base?'}
                            </Typography>
                            <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                {searchQuery
                                    ? `We couldn't find any results for "${searchQuery}". Try a different search term or clear the filter.`
                                    : 'Upload and organize your source documents here to provide context for your AI agents.'}
                            </Typography>
                        </div>
                    </div>
                ) : knowledgeBases.map((kb) => (
                    <Card key={kb.id} className="flex flex-col h-full hover:border-primary/40 transition-all group border-border relative min-w-0">
                        <CardHeader className="pb-3 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-3 min-w-0 mb-2">
                                <CardTitle className="text-lg sm:text-xl font-season-mix tracking-tight truncate flex-1 min-w-0">
                                    {kb.name}
                                </CardTitle>
                                <div className="flex items-center gap-1 shrink-0 ml-auto">
                                    {user?.id && kb.user_id && String(user.id).toLowerCase() === String(kb.user_id).toLowerCase() && (
                                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTestKB(kb);
                                                            setIsQueryDialogOpen(true);
                                                        }}
                                                    >
                                                        <HugeiconsIcon icon={PlayIcon} size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Query KB</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setKbToEdit(kb);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit KB</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-destructive/20 hover:text-destructive"
                                                        onClick={(e) => handleDeleteKB(kb, e)}
                                                    >
                                                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete KB</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CardDescription className="line-clamp-2 min-h-[40px] text-xs sm:text-sm leading-relaxed">
                                {kb.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto min-w-0">
                            <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-muted-foreground py-2 gap-2 min-w-0">
                                <div className="flex items-center gap-1.5 bg-muted/30 py-1 px-2.5 rounded-md shrink-0">
                                    <HugeiconsIcon icon={Folder01Icon} size={12} />
                                    <span className="font-medium text-foreground/80">{kb.documentCount} Docs</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                    <HugeiconsIcon icon={Calendar03Icon} size={12} />
                                    <span>{kb.lastUpdated}</span>
                                </div>
                            </div>
                            <div className='pb-4 flex flex-wrap items-center gap-2 min-w-0'>
                                <Badge variant={getStatusVariant(kb.status)} className="capitalize py-0.5 px-2.5 rounded-full text-[10px] sm:text-xs shrink-0">
                                    {kb.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize py-0.5 px-3 rounded-full border-border/60 text-[10px] sm:text-xs shrink-0">
                                    {kb.visibility === 'public' ? (
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={Globe02Icon} size={10} />
                                            <span>Public</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={LockedIcon} size={10} />
                                            <span>Private</span>
                                        </div>
                                    )}
                                </Badge>
                            </div>
                            <Button
                                className="w-full rounded-full group/btn h-9 sm:h-10 text-xs sm:text-sm"
                                variant="secondary"
                                onClick={() => handleExplore(kb)}
                            >
                                Explore Knowledge Base
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    size={14}
                                    className="group-hover/btn:translate-x-1 transition-transform"
                                />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalItems / limit)}
                onPageChange={(p) => fetchKnowledgeBases(searchQuery, p)}
                className="pb-20"
            />

            {/* Documents Dialog */}
            <KbDocumentsDialog
                isOpen={isDocumentsDialogOpen}
                onOpenChange={setIsDocumentsDialogOpen}
                kbName={selectedKB?.name}
                documents={formatDocsForDialog(documents)}
                kbId={selectedKB?.id}
                type="base"
                onUploadSuccess={() => {
                    fetchKnowledgeBases();
                    if (selectedKB) handleExplore(selectedKB);
                }}
                onDeleteDocument={handleDeleteDocument}
            />

            {/* Create Knowledge Base Dialog */}
            <CreateKbDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreate={handleCreateKB}
            />

            {/* Edit Knowledge Base Dialog */}
            <EditKnowledgeDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                item={kbToEdit}
                onUpdate={handleUpdateKB}
                type="base"
            />

            {/* Delete Confirmation Dialog */}
            <DestructiveConfirmDialog
                isOpen={confirmDialog.isOpen}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
                title={confirmDialog.title}
                description={confirmDialog.description}
                onConfirm={confirmDialog.onConfirm}
            />

            {/* Execute / Test KB Query Dialog */}
            <ExecuteToolDialog
                isOpen={isQueryDialogOpen}
                onOpenChange={setIsQueryDialogOpen}
                tool={testKB ? {
                    id: testKB.id,
                    name: testKB.name,
                    description: testKB.description,
                    parameters: [
                        { name: 'query', type: 'string', in: 'body', required: true, description: 'Enter your question for the knowledge base...' },
                        { name: 'limit', type: 'number', in: 'body', required: false, description: 'Number of results to return (default: 5)' }
                    ]
                } as any : null}
                title={`Query Knowledge Base: ${testKB?.name}`}
                description="Perform a semantic search against the ingested documents in this knowledge base."
                onExecute={async (_name, params) => {
                    if (!testKB) return;
                    try {
                        const result = await knowledgeService.queryKnowledgeBase(testKB.id, params.query, params.limit);
                        
                        // Track query
                        track('kb-query', {
                            kb_id: testKB.id,
                            kb_name: testKB.name,
                            query_length: params.query.length
                        });
                        
                        return result;
                    } catch (error: any) {
                        if (error.status === 402) {
                            showAlert({ 
                                title: 'Payment Required', 
                                description: `Insufficient balance: ${error.message}. Please top up your credits to query knowledge.`, 
                                variant: 'destructive' 
                            });
                        }
                        throw error;
                    }
                }}
            />
        </div>
    );
};

export default KnowledgeBasePage;
