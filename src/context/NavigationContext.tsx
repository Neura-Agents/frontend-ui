import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { platformService } from '../services/platformService';
import { useAuth } from './AuthContext';

interface NavigationItem {
    url: string;
    name: string;
    description: string;
    tab_title: string;
    role: string | null;
}

interface SidebarItem {
    title: string;
    url: string;
    icon: string;
    role: string | null;
}

interface SidebarGroup {
    label: string;
    collapsible: boolean;
    items: SidebarItem[];
}

interface NavigationContextType {
    sidebar: SidebarGroup[];
    allUrls: NavigationItem[];
    loading: boolean;
    refreshNavigation: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebar, setSidebar] = useState<SidebarGroup[]>([]);
    const [allUrls, setAllUrls] = useState<NavigationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const lastUserId = useRef<string | undefined>(undefined);

    const fetchNav = async () => {
        try {
            const data = await platformService.getNavigation();
            setSidebar(data.sidebar);
            setAllUrls(data.all_urls);
        } catch (error) {
            console.error("Failed to fetch navigation:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch when auth loading is finished
        if (!authLoading) {
            // Re-fetch only if userId has actually changed to avoid redundant calls
            if (user?.id !== lastUserId.current) {
                lastUserId.current = user?.id;
                fetchNav();
            }
        }
    }, [user?.id, authLoading]);

    useEffect(() => {
        const APP_NAME = import.meta.env.VITE_APP_NAME || "WormLabs";
        if (allUrls.length > 0) {
            const currentPath = location.pathname;
            // Exact match first
            const match = allUrls.find(u => u.url === currentPath);
            if (match && match.tab_title) {
                document.title = match.tab_title;
            } else {
                // Handle dynamic routes like /agent-chat/:slug or /agent-edit/:id
                if (currentPath.startsWith('/agent-chat/')) {
                    // This will be handled by the AgentChat component itself usually, 
                    // but we can set a default here
                    document.title = `Chat | ${APP_NAME}`;
                } else if (currentPath.startsWith('/agent-edit/')) {
                    document.title = `Edit Agent | ${APP_NAME}`;
                }
            }
        }
    }, [location.pathname, allUrls]);

    return (
        <NavigationContext.Provider value={{ sidebar, allUrls, loading, refreshNavigation: fetchNav }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
