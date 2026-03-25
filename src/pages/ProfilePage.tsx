import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Link, Navigate } from 'react-router-dom';
import { authService, type DeviceSession, type LinkedAccount, type CredentialCategory } from '../services/authService';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link04Icon, Unlink04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeBlock } from '@/components/ui/code-block';
import { DestructiveConfirmDialog } from '@/components/reusable/DestructiveConfirmDialog';

const Profile: React.FC = () => {
    const { user, loading, token, hasRole } = useAuth();
    const { showAlert } = useAlert();
    const [sessions, setSessions] = useState<DeviceSession[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [credentials, setCredentials] = useState<CredentialCategory[]>([]);
    const [secureData, setSecureData] = useState<any>(null);
    const [secureDataLoading, setSecureDataLoading] = useState(false);

    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        providerName: string;
        displayName: string;
    }>({
        isOpen: false,
        providerName: '',
        displayName: ''
    });

    const fetchingSessions = React.useRef(false);
    const fetchingLinked = React.useRef(false);
    const fetchingCredentials = React.useRef(false);
    const fetchingSecureData = React.useRef(false);

    const fetchSessionsData = async (force = false) => {
        if (token && (!fetchingSessions.current || force)) {
            if (!force) fetchingSessions.current = true;
            setSessionsLoading(true);
            const data = await authService.getSessions();
            setSessions(data);
            setSessionsLoading(false);
        }
    };

    const fetchLinkedAccounts = async (force = false) => {
        if (token && (!fetchingLinked.current || force)) {
            if (!force) fetchingLinked.current = true;
            const data = await authService.getLinkedAccounts();
            setLinkedAccounts(data);
        }
    };

    const fetchCredentials = async (force = false) => {
        if (token && (!fetchingCredentials.current || force)) {
            if (!force) fetchingCredentials.current = true;
            const data = await authService.getCredentials();
            setCredentials(data);
        }
    };

    const fetchSecureData = async (force = false) => {
        if (token && (!fetchingSecureData.current || force)) {
            if (!force) fetchingSecureData.current = true;
            setSecureDataLoading(true);
            const data = await authService.getSecureData();
            setSecureData(data);
            setSecureDataLoading(false);
        }
    };

    const handleUnlink = async (providerName: string) => {
        if (!token) return;

        try {
            await authService.unlinkAccount(providerName);
            fetchingLinked.current = false;
            fetchLinkedAccounts();
            showAlert({
                description: `Successfully disconnected account`,
                variant: 'success'
            });
        } catch (err: any) {
            showAlert({
                title: "Error",
                description: err.message || 'Failed to unlink account.',
                variant: 'destructive'
            });
        }
    };

    const handleLink = (providerAlias: string) => {
        authService.login(providerAlias);
    };

    useEffect(() => {
        if (token) {
            fetchSessionsData();
            fetchLinkedAccounts();
            fetchCredentials();
            fetchSecureData();
        }

        return () => {
        };
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }


    const joinedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    User Profile
                </Typography>
                <Typography variant="page-description">
                    User Profile Identity and Account Management
                </Typography>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                {/* Account Info */}
                <div className="space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle>Identity Summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2 overflow-scroll'>
                            <Typography scale="sm" className="leading-relaxed">
                                {user.name || user.preferred_username || user.username}
                            </Typography>
                            <div className="flex items-center gap-2">
                                <Typography scale="sm" className="leading-relaxed">
                                    {user.email}
                                </Typography>
                                {user.email_verified && <Badge variant="default">Verified</Badge>}
                            </div>
                            <Typography scale="sm" className="leading-relaxed">
                                Joined on <Badge variant="outline">{joinedDate}</Badge>
                            </Typography>
                            {user.roles && user.roles.length > 0 && hasRole("platform-admin") && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {user.roles.map(role => (
                                        <Badge key={role} variant="default">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="default" size="sm" className="w-full">
                                <Link to='http://localhost:8000/backend/auth/login?action=UPDATE_PROFILE'>Edit Profile</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Accounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 overflow-scroll">
                            {(() => {
                                const passwordAuth = credentials.find(c => c.type === 'password');
                                const hasPassword = passwordAuth && passwordAuth.userCredentialMetadatas && passwordAuth.userCredentialMetadatas.length > 0;
                                return (
                                    <div className="flex items-center justify-between"><div className="flex items-center gap-2">
                                        <Typography scale="sm" className="leading-relaxed">Password Authentication</Typography>
                                        {hasPassword && <Badge variant="default">Connected</Badge>}
                                    </div>
                                        <Button asChild variant="default" size="xs">
                                            <Link to='http://localhost:8000/backend/auth/login?action=UPDATE_PASSWORD'>{hasPassword ? 'Update Password' : 'Set Password'}</Link>
                                        </Button>
                                    </div>
                                );
                            })()}

                            {linkedAccounts.map((provider) => (
                                <div key={provider.providerAlias} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Typography scale="sm" className="leading-relaxed">{provider.displayName}</Typography>
                                        {provider.connected && <Badge variant="default">Connected</Badge>}
                                    </div>
                                    {provider.connected ? (
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className=' hover:cursor-pointer'
                                            onClick={() => setConfirmDialog({
                                                isOpen: true,
                                                providerName: provider.providerName,
                                                displayName: provider.displayName
                                            })}
                                        >
                                            <HugeiconsIcon icon={Unlink04Icon} />
                                        </Button>
                                    ) : (
                                        <Button variant="default" size="icon" onClick={() => handleLink(provider.providerAlias)} className=' hover:cursor-pointer'><HugeiconsIcon icon={Link04Icon} /></Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Technical / Sessions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security & Sessions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {sessionsLoading ? (
                                <Typography scale="sm" className="text-muted-foreground">Loading sessions...</Typography>
                            ) : (
                                sessions.map((device, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-background space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Typography scale="sm" weight="semibold" className="leading-relaxed">
                                                {device.device}
                                            </Typography>
                                            {device.current && <Badge variant="default">Current</Badge>}
                                        </div>
                                        <Typography scale="sm" className="text-muted-foreground leading-relaxed">
                                            {device.os} {device.osVersion}
                                        </Typography>
                                        <Typography scale="xs" className="text-muted-foreground/60 leading-relaxed">
                                            Last active: {formatTimestamp(device.lastAccess)}
                                        </Typography>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {hasRole('platform-admin') && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Access Token & JWT Data Payload</CardTitle>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-1'>
                                    <CodeBlock>{token || ''}</CodeBlock>
                                    {secureDataLoading ? (
                                        <Typography scale="sm" className="text-muted-foreground italic">Decrypting secure context...</Typography>
                                    ) : secureData ? (
                                        <CodeBlock>{JSON.stringify(secureData, null, 2)}</CodeBlock>
                                    ) : (
                                        <Typography scale="sm" className="text-destructive">Failed to retrieve secure data.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            <DestructiveConfirmDialog
                isOpen={confirmDialog.isOpen}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
                title={`Disconnect ${confirmDialog.displayName}`}
                description={`Are you sure you want to disconnect your ${confirmDialog.displayName} account? This may affect your ability to sign in through ${confirmDialog.displayName}.`}
                onConfirm={() => handleUnlink(confirmDialog.providerName)}
                confirmText="Disconnect"
            />
        </div>
    );
};

export default Profile;
