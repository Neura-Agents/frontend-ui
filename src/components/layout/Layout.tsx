import React, { useEffect } from 'react';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from './app-sidebar';
import { useAuth } from '../../context/AuthContext';
import Logo from '../reusable/Logo';
import { cn } from '@/lib/utils';

const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';

const DashboardContent: React.FC = () => {
    const { openMobile } = useSidebar();
    const { pathname } = useLocation();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, [pathname]);

    return (
        <>
            <AppSidebar />
            <SidebarInset className={cn("bg-background text-foreground flex flex-col h-svh transition-all duration-300 ease-in-out relative overflow-hidden")}>
                {!openMobile && (
                    <div className="md:hidden absolute top-7.5 left-4 z-60">
                        <SidebarTrigger variant="outline" className="text-foreground p-2 w-10 h-10" />
                    </div>
                )}
                <main className="grow flex flex-col pl-0 lg:pl-0 lg:p-2 md:pl-0 md:pt-2 h-full w-full overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="bg-card w-full h-full lg:px-6 lg:py-3 md:px-4 md:py-8 px-0 py-0 pt-6 overflow-y-auto lg:rounded-4xl md:rounded-3xl rounded-xl light:border light:border-border/60"
                    >
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>
        </>
    );
};

const PublicContent: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground w-full transition-all duration-300 ease-in-out">
            <Header />
            <main className="grow flex flex-col h-full w-full">
                <Outlet />
            </main>
        </div>
    );
};

const Layout: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background animate-in fade-in duration-500">
                <div className="animate-pulse">
                    <Logo variant="lg" />
                </div>
            </div>
        );
    }

    if (APP_MODE === "public") {
        return <PublicContent />;
    }

    // Dashboard Mode: Never show the Header layout.
    // Use SidebarProvider and DashboardContent even if not logged in 
    // (Protected Routes in App.tsx will handle the actual access control)
    return (
        <SidebarProvider>
            <DashboardContent />
        </SidebarProvider>
    );
};

export default Layout;
