import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-white">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
