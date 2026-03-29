import React from 'react';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet03Icon } from '@hugeicons/core-free-icons';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            {/* ─── HEADER ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 border-b border-border pb-4 pt-9 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full flex flex-row items-center justify-between">
                <div className="flex justify-between items-end">
                    <div>
                        <Typography font='season-mix' scale='2xl'>
                            Welcome, {user?.given_name}
                        </Typography>
                    </div>
                </div>
                <Button className='rounded-full px-4 py-4' variant='outline'><HugeiconsIcon icon={Wallet03Icon} /> 1000 Credits </Button>
            </section>
        </div>
    );
};

export default DashboardPage;
