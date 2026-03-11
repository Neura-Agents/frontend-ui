import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService, type User } from '../services/authService';
import { setAuthToken } from '../api/client';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (idp?: string) => void;
    register: () => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetching = useRef(false);

    useEffect(() => {
        if (fetching.current) return;
        fetching.current = true;

        const fetchUser = async () => {
            const { user: userData, token: userToken } = await authService.checkAuth();
            setAuthToken(userToken);
            setUser(userData);
            setToken(userToken);
            setLoading(false);
            fetching.current = false;
        };

        fetchUser();
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

    const login = (idp?: string) => authService.login(idp);
    const register = () => authService.register();
    const logout = () => authService.logout();

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, token }}>
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
