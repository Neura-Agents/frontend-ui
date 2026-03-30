import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { billingService } from '@/services/billingService';

const BillingPage: React.FC = () => {
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
        fetchBalance();
    }, []);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Billing
                </Typography>
                <Typography variant="page-description">
                    Manage your credits and payment history
                </Typography>
            </section>

            <section className='flex lg:items-center lg:justify-between justify-start flex-col lg:flex-row gap-4 mb-4 px-2'>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between'>
                            <span className='font-season-mix font-semibold'>${loading ? '...' : balance.toFixed(2)}</span>
                        </CardTitle>
                        <CardDescription>Credits Left</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2 pt-3'>
                        {/* Assuming $100 as a soft limit/progress indicator for demo */}
                        <Progress value={Math.min((balance / 100) * 100, 100)} max={100} className="w-full" />
                        <span className='font-matter text-muted-foreground text-sm'>
                            {balance > 0 ? `$${balance.toFixed(2)} of $100.00 Plan Limit` : '0 credits available'}
                        </span>
                    </CardContent>
                </Card>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between'>
                            <span className='font-season-mix font-semibold'>Auto-Recharge</span>
                        </CardTitle>
                        <CardDescription>Automatically top up credits when your balance runs low. Set a threshold and top-up amount.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <Button variant="default" className='rounded-full font-matter font-medium w-fit' size="sm" >
                            Setup Auto-Recharge
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default BillingPage;
