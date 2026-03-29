import React, { useState, useEffect, useCallback } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/tables/api-keys/data-table';
import { getColumns, type ApiKey } from '@/tables/api-keys/columns';
import { apiKeysService } from '@/services/apiKeysService';
import { Add01Icon, Copy01Icon, Tick02Icon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DestructiveConfirmDialog } from '@/components/reusable/DestructiveConfirmDialog';

const ApiKeysPage: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Dialog state for confirmation
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        confirmText: string;
        onConfirm: () => void;
        type: 'rotate' | 'revoke' | null;
        id: string | null;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: '',
        onConfirm: () => { },
        type: null,
        id: null
    });

    const fetchKeys = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiKeysService.listKeys();
            setKeys(data);
        } catch (error) {
            console.error('Failed to fetch API keys:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);

    const handleCreateKey = async () => {
        if (!newKeyName) return;
        try {
            const result = await apiKeysService.createKey(newKeyName);
            setGeneratedKey(result.apiKey);
            setNewKeyName('');
            fetchKeys();
        } catch (error) {
            console.error('Failed to create API key:', error);
        }
    };

    const handleRotateKey = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Rotate API Key?',
            description: 'Rotating will immediately revoke the current key and issue a new one. This action cannot be reversed.',
            confirmText: 'Rotate Key',
            type: 'rotate',
            id: id,
            onConfirm: async () => {
                try {
                    const result = await apiKeysService.rotateKey(id);
                    setGeneratedKey(result.apiKey);
                    setIsCreateDialogOpen(true);
                    fetchKeys();
                } catch (error) {
                    console.error('Failed to rotate API key:', error);
                }
            }
        });
    };

    const handleDeleteKey = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Revoke API Key?',
            description: 'Are you sure you want to revoke this API key? This will permanently disable it and any applications using it will lose access.',
            confirmText: 'Revoke Key',
            type: 'revoke',
            id: id,
            onConfirm: async () => {
                try {
                    await apiKeysService.revokeKey(id);
                    fetchKeys();
                } catch (error) {
                    console.error('Failed to revoke API key:', error);
                }
            }
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const columns = getColumns(handleRotateKey, handleDeleteKey);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            {/* ─── HEADER ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <Typography variant="page-header">
                            API Keys
                        </Typography>
                        <Typography variant="page-description">
                            Use API Keys to authenticate your requests from external applications.
                        </Typography>
                    </div>
                </div>
            </section>

            <section tabIndex={0} className="px-2">
                {loading ? (
                    <div className="flex items-center justify-center p-20 opacity-50">
                        <HugeiconsIcon icon={Refresh01Icon} size={32} className="animate-spin" />
                    </div>
                ) : (
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-end justify-end'>
                            <div className="flex gap-2">
                                <Button className="rounded-full gap-2 h-10" onClick={() => {
                                    setGeneratedKey(null);
                                    setNewKeyName('');
                                    setIsCreateDialogOpen(true);
                                }}>
                                    <HugeiconsIcon icon={Add01Icon} size={18} />
                                    Create New Key
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => fetchKeys()}>
                                    <HugeiconsIcon icon={Refresh01Icon} size={18} />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <DataTable columns={columns} data={keys} />
                        </div>
                    </div>
                )}
            </section>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) setGeneratedKey(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                        <DialogDescription>
                            Give your key a name to identify it later.
                        </DialogDescription>
                    </DialogHeader>
                    {!generatedKey ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Key Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. My Production App"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                                <strong>Important:</strong> Copy this key now. You won&apos;t be able to see it again!
                            </div>
                            <div className="relative group">
                                <Input
                                    readOnly
                                    value={generatedKey}
                                    className="pr-12 font-mono text-sm"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md h-8 w-8"
                                    onClick={() => copyToClipboard(generatedKey)}
                                >
                                    <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} className={copied ? "text-green-500" : ""} />
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {!generatedKey ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateKey} disabled={!newKeyName}>Create Key</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsCreateDialogOpen(false)}>Close</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DestructiveConfirmDialog
                isOpen={confirmDialog.isOpen}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
                title={confirmDialog.title}
                description={confirmDialog.description}
                confirmText={confirmDialog.confirmText}
                onConfirm={confirmDialog.onConfirm}
            />
        </div>
    );
};

export default ApiKeysPage;
