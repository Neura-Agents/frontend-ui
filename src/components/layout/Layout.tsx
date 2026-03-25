import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from './app-sidebar';
import { useAuth } from '../../context/AuthContext';

const LayoutContent: React.FC = () => {
    const { user } = useAuth();
    const { openMobile } = useSidebar();

    return (
        <>
            {user && <AppSidebar />}
            {user ? (
                <SidebarInset className="bg-background text-foreground flex flex-col h-svh w-full transition-all duration-300 ease-in-out overflow-hidden relative">
                    {!openMobile && (
                        <div className="md:hidden absolute top-7.5 left-4 z-60">
                            <SidebarTrigger variant="outline" className="text-foreground p-2 w-10 h-10" />
                        </div>
                    )}
                    <main className="grow flex flex-col lg:p-2 md:pt-2 h-full w-full overflow-hidden">
                        <div className="bg-card w-full h-full lg:px-6 lg:py-3 md:px-4 md:py-8 px-0 py-0 pt-6 overflow-y-auto lg:rounded-4xl md:rounded-3xl rounded-xl light:border light:border-border/60">
                            <Outlet />
                        </div>
                    </main>
                </SidebarInset>
            ) : (
                <div className="flex flex-col min-h-screen bg-background text-foreground w-full transition-all duration-300 ease-in-out overflow-x-hidden">
                    <Header />
                    <main className="grow flex flex-col items-center justify-center p-6 h-full w-full">
                        <Outlet />
                    </main>
                </div>
            )}
        </>
    );
};

const Layout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default Layout;
