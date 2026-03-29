import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService, type User } from '../services/authService';
import { setAuthToken } from '../api/client';

const decodeToken = (token: string) => {
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

        // Refresh token 1 minute before it expires (Keycloak default is 5 mins)
        // So we refresh every 4 minutes (240,000ms)
        const refreshInterval = setInterval(async () => {
            console.log('🔄 Triggering automatic token refresh...');
            const newToken = await authService.refreshToken();
            if (newToken) {
                const payload = decodeToken(newToken);
                setUser(prev => prev ? { ...prev, roles: payload?.realm_access?.roles || [] } : null);
                setAuthToken(newToken);
                setToken(newToken);
                console.log('✅ Token refreshed successfully');
            } else {
                console.warn('❌ Failed to auto-refresh token, session may have expired.');
                setAuthToken(null);
                setUser(null);
                setToken(null);
            }
        }, 4 * 60 * 1000);

        return () => clearInterval(refreshInterval);
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
