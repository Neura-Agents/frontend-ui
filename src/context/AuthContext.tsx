import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService, type User } from '../services/authService';
import { setAuthToken } from '../api/client';

const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';

const decodeToken = (token: string) => {
    if (APP_MODE === 'public') return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (idp?: string, redirectTo?: string) => void;
    register: () => void;
    logout: (redirectTo?: string) => void;
    token: string | null;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetching = useRef(false);

    useEffect(() => {
        if (APP_MODE === 'public') {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            if (fetching.current) return;
            fetching.current = true;
            
            try {
                const { user: userData, token: userToken } = await authService.checkAuth();
                if (userData && userToken) {
                    const payload = decodeToken(userToken);
                    if (payload) {
                        userData.roles = payload.realm_access?.roles || [];
                        if (payload.sub) {
                            userData.id = payload.sub;
                        }
                    }
                }
                setAuthToken(userToken);
                setUser(userData);
                setToken(userToken);
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
                fetching.current = false;
            }
        };

        fetchUser();

        // Listen for browser navigation (like back button) out of bfcache
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                console.log("🔄 Restored from bfcache, re-checking auth...");
                fetchUser();
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    // Automatic token refresh
    useEffect(() => {
        if (!token) return;

        const payload = decodeToken(token);
        if (!payload || !payload.exp) return;

        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        
        // Refresh 1 minute (60,000ms) before it expires, or immediately if it is already close to expiring
        const refreshIn = Math.max(0, (expiresAt - now) - 60 * 1000);

        console.log(`Token expires in ${Math.round((expiresAt - now) / 1000)}s. Scheduling refresh in ${Math.round(refreshIn / 1000)}s.`);

        const timeoutId = setTimeout(async () => {
            console.log('🔄 Triggering automatic token refresh...');
            const newToken = await authService.refreshToken();
            if (newToken) {
                const newPayload = decodeToken(newToken);
                setUser(prev => prev ? { ...prev, roles: newPayload?.realm_access?.roles || [] } : null);
                setAuthToken(newToken);
                setToken(newToken);
                console.log('✅ Token refreshed successfully');
            } else {
                console.warn('❌ Failed to auto-refresh token, session may have expired.');
                setAuthToken(null);
                setUser(null);
                setToken(null);
            }
        }, refreshIn);

        return () => clearTimeout(timeoutId);
    }, [token]);

    const login = (idp?: string, redirectTo?: string) => authService.login(idp, redirectTo);
    const register = () => authService.register();
    const logout = (redirectTo?: string) => {
        authService.logout(redirectTo);
    };
    const hasRole = (role: string) => user?.roles?.includes(role) || false;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, token, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
