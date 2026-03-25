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
    Calendar03Icon,
    PencilEdit02Icon,
    Delete02Icon,
    LockedIcon,
    Globe02Icon,
    PlayIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { KbDocumentsDialog } from '@/components/tools/dialogs/KbDocumentsDialog';
import { CreateKgDialog } from '@/components/tools/dialogs/CreateKgDialog';
import { EditKnowledgeDialog } from '@/components/tools/dialogs/EditKnowledgeDialog';
import { DestructiveConfirmDialog } from '@/components/reusable/DestructiveConfirmDialog';
import Pagination from '@/components/ui/pagination';
import { knowledgeService, type KnowledgeGraph, type KnowledgeDocument } from '@/services/knowledgeService';
import { GraphVisualizationDialog } from '@/components/tools/dialogs/GraphVisualizationDialog';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/context/AlertContext';

const KnowledgeGraphPage: React.FC = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [knowledgeGraphs, setKnowledgeGraphs] = useState<KnowledgeGraph[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(9); // 3x3 grid
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [selectedKG, setSelectedKG] = useState<KnowledgeGraph | null>(null);

    // Dialog States
    const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [kgToEdit, setKgToEdit] = useState<KnowledgeGraph | null>(null);
    const [isQueryDialogOpen, setIsQueryDialogOpen] = useState(false);
    const [testKG, setTestKG] = useState<KnowledgeGraph | null>(null);

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

    const fetchKnowledgeGraphs = async (query?: string, pageNum: number = 1) => {
        try {
            setIsLoading(true);
            const response = await knowledgeService.getKnowledgeGraphs({ name: query, page: pageNum, limit });
            setKnowledgeGraphs(response.items);
            setTotalItems(response.total);
            setPage(response.page);
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to fetch knowledge graphs', variant: 'destructive' });
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
            fetchKnowledgeGraphs(searchQuery, 1);
            
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


    const handleExplore = async (kg: KnowledgeGraph) => {
        try {
            setSelectedKG(kg);
            const docs = await knowledgeService.getDocuments(kg.id);
            setDocuments(docs);
            setIsDocumentsDialogOpen(true);
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to fetch documents', variant: 'destructive' });
        }
    };

    const handleCreateKG = async (name: string, description: string, visibility: 'public' | 'private', files: File[]) => {
        try {
            const newKG = await knowledgeService.createKnowledgeGraph(name, description, visibility);
            if (files.length > 0) {
                await knowledgeService.uploadDocuments(newKG.id, 'graph', files);
            }
            showAlert({ title: 'Success', description: 'Knowledge graph created successfully', variant: 'success' });
            setIsCreateDialogOpen(false);
            fetchKnowledgeGraphs();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to create knowledge graph', variant: 'destructive' });
        }
    };

    const handleUpdateKG = async (id: string, name: string, description: string, visibility: 'public' | 'private') => {
        try {
            await knowledgeService.updateKnowledgeGraph(id, name, description, visibility);
            showAlert({ title: 'Success', description: 'Knowledge graph updated successfully', variant: 'success' });
            fetchKnowledgeGraphs();
        } catch (error) {
            showAlert({ title: 'Error', description: 'Failed to update knowledge graph', variant: 'destructive' });
        }
    };

    const handleDeleteKG = (kg: KnowledgeGraph, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            title: `Delete ${kg.name}`,
            description: 'Are you sure you want to delete this knowledge graph? This action cannot be undone and all associated documents will be unlinked.',
            onConfirm: async () => {
                try {
                    await knowledgeService.deleteKnowledgeGraph(kg.id);
                    showAlert({ title: 'Success', description: 'Knowledge graph deleted successfully', variant: 'success' });
                    fetchKnowledgeGraphs();
                } catch (error) {
                    showAlert({ title: 'Error', description: 'Failed to delete knowledge graph', variant: 'destructive' });
                }
            }
        });
    };

    const handleDeleteDocument = (docId: string, docName: string) => {
        setConfirmDialog({
            isOpen: true,
            title: `Delete Document`,
            description: `Are you sure you want to delete ${docName}? This action will permanently remove the document from the knowledge graph.`,
            onConfirm: async () => {
                try {
                    await knowledgeService.deleteDocument(docId);
                    showAlert({ title: 'Success', description: 'Document deleted successfully', variant: 'success' });
                    if (selectedKG) {
                        const docs = await knowledgeService.getDocuments(selectedKG.id);
                        setDocuments(docs);
                    }
                    fetchKnowledgeGraphs();
                } catch (error) {
                    showAlert({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
                }
            }
        });
    };

    const getStatusVariant = (status: KnowledgeGraph['status']): "success" | "destructive" | "soft" => {
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
                    Knowledge Graph
                </Typography>
                <Typography variant="page-description">
                    Visualize and manage entity relationships and semantic data.
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
                            placeholder="Search knowledge graphs..."
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
                            Create KG
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => fetchKnowledgeGraphs(searchQuery, 1)}>
                            <HugeiconsIcon icon={Refresh01Icon} size={18} />
                        </Button>
                    </div>
                </div>

                {totalItems > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-6">
                        <Badge variant="soft">
                            {totalItems}
                        </Badge>
                        <span>knowledge graphs found</span>
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
                    <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse">
                        Loading knowledge graphs...
                    </div>
                ) : knowledgeGraphs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-2">
                            <Typography as="h3" scale="xl" className="text-foreground tracking-tight font-season-mix">
                                {searchQuery ? 'No match found' : 'Ready to build your knowledge graph?'}
                            </Typography>
                            <Typography className="max-w-[400px] mx-auto text-sm text-muted-foreground">
                                {searchQuery
                                    ? `We couldn't find any results for "${searchQuery}". Try a different search term or clear the filter.`
                                    : 'Visualize and manage complex entity relationships by creating a knowledge graph.'}
                            </Typography>
                        </div>
                    </div>
                ) : knowledgeGraphs.map((kg) => (
                    <Card key={kg.id} className="flex flex-col h-full hover:border-primary/40 transition-all group border-border relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-xl">{kg.name}</CardTitle>
                                <div className="flex items-center gap-1">
                                    {user?.id && kg.user_id && String(user.id).toLowerCase() === String(kg.user_id).toLowerCase() && (
                                        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTestKG(kg);
                                                            setIsQueryDialogOpen(true);
                                                        }}
                                                    >
                                                        <HugeiconsIcon icon={PlayIcon} size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Visualize KG</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setKgToEdit(kg);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit KG</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={(e) => handleDeleteKG(kg, e)}
                                                    >
                                                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete KG</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CardDescription className="line-clamp-2 min-h-[40px] text-sm leading-relaxed">{kg.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-foreground">{kg.nodeCount}</span>
                                        <span>Nodes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-foreground">{kg.relationCount}</span>
                                        <span>Relations</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <HugeiconsIcon icon={Calendar03Icon} size={14} />
                                    <span>{kg.lastUpdated}</span>
                                </div>
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <Badge variant={getStatusVariant(kg.status)} className="capitalize py-0.5 px-2.5 rounded-full">
                                    {kg.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize py-0.5 px-2.5 rounded-full">
                                    {kg.visibility === 'public' ? (
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={Globe02Icon} size={12} />
                                            <span>Public</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={LockedIcon} size={12} />
                                            <span>Private</span>
                                        </div>
                                    )}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    className="w-full rounded-full group/btn"
                                    variant="secondary"
                                    onClick={() => handleExplore(kg)}
                                >
                                    Explore Documents
                                    <HugeiconsIcon
                                        icon={ArrowRight01Icon}
                                        size={16}
                                        className="group-hover/btn:translate-x-1 transition-transform"
                                    />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalItems / limit)}
                onPageChange={(p) => fetchKnowledgeGraphs(searchQuery, p)}
                className="pb-20"
            />

            {/* Documents Dialog */}
            <KbDocumentsDialog
                isOpen={isDocumentsDialogOpen}
                onOpenChange={setIsDocumentsDialogOpen}
                kbName={selectedKG?.name}
                documents={formatDocsForDialog(documents)}
                kbId={selectedKG?.id}
                type="graph"
                onUploadSuccess={() => {
                    fetchKnowledgeGraphs();
                    if (selectedKG) handleExplore(selectedKG);
                }}
                onDeleteDocument={handleDeleteDocument}
            />

            {/* Create Knowledge Graph Dialog */}
            <CreateKgDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreate={handleCreateKG}
            />

            {/* Edit Knowledge Graph Dialog */}
            <EditKnowledgeDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                item={kgToEdit}
                onUpdate={handleUpdateKG}
                type="graph"
            />

            {/* Delete Confirmation Dialog */}
            <DestructiveConfirmDialog
                isOpen={confirmDialog.isOpen}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
                title={confirmDialog.title}
                description={confirmDialog.description}
                onConfirm={confirmDialog.onConfirm}
            />

            {/* Graph Visualization Dialog */}
            <GraphVisualizationDialog
                isOpen={isQueryDialogOpen}
                onOpenChange={setIsQueryDialogOpen}
                kgId={testKG?.id}
                kgName={testKG?.name}
            />
        </div>
    );
};

export default KnowledgeGraphPage;
