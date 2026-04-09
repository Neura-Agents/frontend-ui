import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { billingService } from '@/services/billingService';
import { Skeleton } from '@/components/ui/skeleton';
import { useUmami } from '@/hooks/useUmami';
import { DataTable } from '@/tables/billing/data-table';
import { columns, type Transaction } from '@/tables/billing/columns';
import Pagination from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon } from '@hugeicons/core-free-icons';

import AddCreditsDialog from '@/components/billing/AddCreditsDialog';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const BillingPage: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isTopUpLoading, setIsTopUpLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [typeFilter] = useState('top-up');
    const { track } = useUmami();

    // ... (rest of the state and fetch logic remains same)

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

    const fetchTransactions = async () => {
        setTransactionsLoading(true);
        try {
            const offset = (page - 1) * limit;
            const data = await billingService.getTransactions({ limit, offset, type: typeFilter });
            setTransactions(data.transactions);
            setTotalTransactions(data.total);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setTransactionsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [page, limit, typeFilter]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setPage(1);
    }, [typeFilter]);

    const handleTopUp = async (data: { credits?: number; amount?: number }) => {
        try {
            setIsTopUpLoading(true);
            const displayValue = data.credits || data.amount || 0;
            track('top-up-initiated', data);

            // 1. Create Order
            const orderData = await billingService.createRazorpayOrder(data);

            // 1.5 Load Razorpay Script if not present
            if (!(window as any).Razorpay) {
                const loaded = await loadRazorpayScript();
                if (!loaded) {
                    throw new Error('Failed to load Razorpay SDK');
                }
            }

            // 2. Configure Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Agentic AI Platform",
                description: `Top up ${displayValue} ${data.credits ? 'credits' : 'INR'}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    console.log('Razorpay response received:', response);
                    try {
                        // 3. Verify Payment
                        console.log('Verifying payment with backend...');
                        await billingService.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: displayValue
                        });

                        console.log('Payment verified successfully');
                        track('top-up-success', data);
                        fetchBalance(); // Refresh balance
                        fetchTransactions(); // Refresh history
                        setIsTopUpLoading(false);
                    } catch (error) {
                        console.error('Verification failed:', error);
                        track('top-up-verification-failed');
                        setIsTopUpLoading(false);
                    }
                },
                prefill: {
                    name: "User",
                    email: "user@example.com",
                },
                theme: {
                    color: "#000000",
                },
                modal: {
                    ondismiss: function () {
                        setIsTopUpLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Top-up failed:', error);
            track('top-up-failed');
            setIsTopUpLoading(false);
        }
    };

    const showSkeleton = loading;

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">Billing</Typography>
                <Typography variant="page-description">Manage your credits and payment history</Typography>
            </section>

            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 px-2'>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between'>
                            {showSkeleton ? <Skeleton className="h-8 w-24" /> : <div className='flex items-baseline gap-1'><span className='font-season-mix font-semibold text-3xl'>{balance.toFixed(2)}</span></div>}
                        </CardTitle>
                        <CardDescription>Available Credits</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-4 pt-3'>
                        {showSkeleton ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : (
                            <>
                                <div className='flex items-center justify-between'>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className='rounded-full h-8 px-4 font-semibold'
                                            onClick={() => setIsDialogOpen(true)}
                                            disabled={isTopUpLoading}
                                        >
                                            + Add Credits
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <AddCreditsDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onAdd={(amount) => {
                        setIsDialogOpen(false);
                        handleTopUp(amount);
                    }}
                    isLoading={isTopUpLoading}
                />

                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between'>
                            <span className='font-season-mix font-semibold'>Auto-Recharge</span>
                        </CardTitle>
                        <CardDescription>Automatically top up credits when your balance runs low.</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        {showSkeleton ? (
                            <Skeleton className="h-8 w-32 rounded-full" />
                        ) : (
                            <Button
                                variant="secondary"
                                className='rounded-full font-matter font-medium w-fit'
                                size="sm"
                                onClick={() => track('setup-auto-recharge-click')}
                            >
                                Setup Auto-Recharge
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="pt-5 space-y-2 px-2">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <Typography as="h3" scale="2xl" font="season-mix">Transaction History</Typography>
                    <div className="flex items-center gap-2">
                        <Select value={limit.toString()} onValueChange={(val) => setLimit(parseInt(val))}>
                            <SelectTrigger className="w-[120px] rounded-full">
                                <SelectValue placeholder="10 / page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 / page</SelectItem>
                                <SelectItem value="20">20 / page</SelectItem>
                                <SelectItem value="50">50 / page</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="rounded-full gap-2 h-10 w-10 flex items-center justify-center p-0"
                            onClick={fetchTransactions}
                            disabled={transactionsLoading}
                        >
                            <HugeiconsIcon icon={Refresh01Icon} className={transactionsLoading ? "animate-spin" : ""} size={18} />
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <DataTable columns={columns} data={transactions} loading={transactionsLoading} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 pb-20">
                    <div className="text-xs text-muted-foreground">
                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalTransactions)} of {totalTransactions} transactions
                    </div>
                    <div>
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(totalTransactions / limit)}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BillingPage;
