import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet03Icon } from '@hugeicons/core-free-icons';
import { billingService } from '@/services/billingService';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchBalance = async () => {
        try {
            const data = await billingService.getBalance();
            setBalance(data.balance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBalance();
        }, 100);
        return () => clearTimeout(timer);
    }, []);
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
                <Link to="/billing">
                    <Button className='rounded-full px-4 py-4' variant='outline'><HugeiconsIcon icon={Wallet03Icon} /> {loading ? '...' : balance.toFixed(2)} Credits </Button>
                </Link>
            </section>
        </div>
    );
};

export default DashboardPage;
