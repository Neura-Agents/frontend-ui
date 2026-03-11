import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { authService, type DeviceSession, type LinkedAccount, type CredentialCategory } from '../services/authService';

const Profile: React.FC = () => {
    const { user, loading, token } = useAuth();
    const [copied, setCopied] = useState(false);
    const [sessions, setSessions] = useState<DeviceSession[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [credentials, setCredentials] = useState<CredentialCategory[]>([]);

    const fetchingSessions = React.useRef(false);
    const fetchingLinked = React.useRef(false);
    const fetchingCredentials = React.useRef(false);

    const fetchSessionsData = async () => {
        if (token && !fetchingSessions.current) {
            fetchingSessions.current = true;
            setSessionsLoading(true);
            const data = await authService.getSessions();
            setSessions(data);
            setSessionsLoading(false);
        }
    };

    const fetchLinkedAccounts = async () => {
        if (token && !fetchingLinked.current) {
            fetchingLinked.current = true;
            const data = await authService.getLinkedAccounts();
            setLinkedAccounts(data);
        }
    };

    const fetchCredentials = async () => {
        if (token && !fetchingCredentials.current) {
            fetchingCredentials.current = true;
            const data = await authService.getCredentials();
            setCredentials(data);
        }
    };

    const handleUnlink = async (providerName: string) => {
        if (!token) return;

        if (!confirm(`Are you sure you want to disconnect ${providerName}?`)) {
            return;
        }

        try {
            await authService.unlinkAccount(providerName);
            fetchingLinked.current = false;
            fetchLinkedAccounts();
        } catch (err: any) {
            alert(err.message || 'Failed to unlink account.');
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
        }

        return () => {
            fetchingSessions.current = false;
            fetchingLinked.current = false;
            fetchingCredentials.current = false;
        };
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const copyToken = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-8 bg-background text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-8">User Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Account Info */}
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Identity Summary</h2>
                        <div className="space-y-2">
                            <p><span className="text-gray-400">Name:</span> {user.name || user.preferred_username || user.username}</p>
                            <p><span className="text-gray-400">Email:</span> {user.email} {user.email_verified && <span className="text-accent ml-2">(Verified)</span>}</p>
                            <p><span className="text-gray-400">Joined:</span> {joinedDate}</p>
                        </div>
                        <button
                            onClick={() => window.location.href = 'http://localhost:8000/backend/auth/login?action=UPDATE_PROFILE'}
                            className="mt-4 text-accent hover:underline text-sm"
                        >
                            Edit Profile Details
                        </button>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Connected Accounts</h2>
                        <div className="space-y-4">
                            {(() => {
                                const passwordAuth = credentials.find(c => c.type === 'password');
                                const hasPassword = passwordAuth && passwordAuth.userCredentialMetadatas && passwordAuth.userCredentialMetadatas.length > 0;
                                return (
                                    <div className="flex items-center justify-between">
                                        <span>Password Authentication</span>
                                        <button
                                            onClick={() => window.location.href = 'http://localhost:8000/backend/auth/login?action=UPDATE_PASSWORD'}
                                            className="text-accent text-sm hover:underline"
                                        >
                                            {hasPassword ? 'Update' : 'Set Password'}
                                        </button>
                                    </div>
                                );
                            })()}

                            {linkedAccounts.map((provider) => (
                                <div key={provider.providerAlias} className="flex items-center justify-between">
                                    <span>{provider.displayName}</span>
                                    {provider.connected ? (
                                        <button onClick={() => handleUnlink(provider.providerName)} className="text-red-400 text-sm hover:underline">Disconnect</button>
                                    ) : (
                                        <button onClick={() => handleLink(provider.providerAlias)} className="text-accent text-sm hover:underline">Connect</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Technical / Sessions */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Security & Sessions</h2>
                        {sessionsLoading ? <p>Loading sessions...</p> : (
                            <div className="space-y-4">
                                {sessions.map((device, idx) => (
                                    <div key={idx} className="p-4 border border-white/10 rounded">
                                        <p className="font-bold">{device.device} {device.current && <span className="text-accent text-xs ml-2">(Current)</span>}</p>
                                        <p className="text-sm text-gray-400">{device.os} {device.osVersion}</p>
                                        <p className="text-xs text-gray-500 mt-2">Last active: {formatTimestamp(device.lastAccess)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Access Token</h2>
                        <div className="relative">
                            <pre className="text-[10px] bg-white/5 p-4 rounded overflow-hidden text-ellipsis whitespace-nowrap">
                                {token}
                            </pre>
                            <button
                                onClick={copyToken}
                                className="mt-2 text-accent text-xs hover:underline"
                            >
                                {copied ? 'Copied!' : 'Copy JWT Token'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-white/10 text-center">
                <button
                    onClick={() => window.open('http://localhost:8081/realms/agentic-ai/account/', '_blank')}
                    className="text-gray-500 hover:text-white text-sm"
                >
                    Advanced Account Management
                </button>
            </footer>
        </div>
    );
};

export default Profile;
