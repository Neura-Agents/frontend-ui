import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search02Icon, Wallet02Icon, UserMultipleIcon, Invoice01Icon, PieChartIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { revenueService, type Transaction, type RevenueStats, type RevenueInsights } from '@/services/revenueService';
import { columns } from '@/tables/revenue/columns';
import { DataTable } from '@/tables/revenue/data-table';
import { RevenueGrowthChart } from '@/charts/revenue/RevenueGrowthChart';
import { TransactionVolumeChart } from '@/charts/revenue/TransactionVolumeChart';

const RevenuePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [stats, setStats] = React.useState<RevenueStats[]>([]);
    const [insights, setInsights] = React.useState<RevenueInsights | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');
    const pageSize = 10;

    const [isOpen, setIsOpen] = React.useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const from = fromParam ? new Date(fromParam) : subDays(new Date(), 30);
        const to = toParam ? new Date(toParam) : new Date();
        return {
            from: isNaN(from.getTime()) ? subDays(new Date(), 30) : from,
            to: isNaN(to.getTime()) ? new Date() : to,
        };
    });

    const updateParams = React.useCallback((updates: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const fetchData = React.useCallback(async (pageNum: number = page, query: string = debouncedSearch) => {
        setLoading(true);
        try {
            const filter = {
                page: pageNum,
                limit: pageSize,
                search: query,
                startDate: date?.from ? startOfDay(date.from).toISOString() : undefined,
                endDate: date?.to ? endOfDay(date.to).toISOString() : undefined,
            };

            const [txData, statsData, insightsData] = await Promise.all([
                revenueService.getTransactions(filter as any),
                revenueService.getRevenueStats(filter as any),
                revenueService.getInsights(filter as any),
            ]);
            setTransactions(txData.items);
            setTotalItems(txData.total);
            setStats(statsData);
            setInsights(insightsData);
        } catch (error) {
            console.error('Failed to fetch revenue data:', error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, date, pageSize]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    React.useEffect(() => {
        if (date?.from && date?.to) {
            updateParams({
                from: date.from.toISOString(),
                to: date.to.toISOString(),
            });
        }
    }, [date]);

    const totalRevenue = stats.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProfit = stats.reduce((acc, curr) => acc + curr.profit, 0);

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            {/* ─── HERO ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Typography variant="page-header">
                            Revenue Insights
                        </Typography>
                        <Typography variant="page-description">
                            Monitor platform health, transactions, and financial growth metrics.
                        </Typography>
                    </div>

                    <div className="flex items-center gap-3 pr-4">
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="size-4 text-muted-foreground" />
                                    {date?.from ? (
                                        date.to && format(date.from, "LLL dd, y") !== format(date.to, "LLL dd, y") ? (
                                            <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden border-border shadow-2xl" align="end">
                                <div className="flex flex-col md:flex-row h-full">
                                    {!isMobile && (
                                        <div className="border-r border-border p-2 flex flex-col items-center justify-center gap-1 bg-card">
                                            {[
                                                { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
                                                { label: 'Yesterday', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
                                                { label: 'Last 7 Days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
                                                { label: 'Last 30 Days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
                                                { label: 'This Month', getValue: () => ({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() }) },
                                                {
                                                    label: 'Last Month', getValue: () => {
                                                        const now = new Date();
                                                        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                                        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                                                        return { from: firstDayLastMonth, to: lastDayLastMonth };
                                                    }
                                                },
                                            ].map((option) => (
                                                <Button
                                                    key={option.label}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start font-normal rounded-lg px-3 py-1.5 h-auto text-xs"
                                                    onClick={() => {
                                                        setDate(option.getValue());
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={isMobile ? 1 : 2}
                                        className="p-3"
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </section>

            <div className='px-2 pt-12 flex flex-col gap-8'>
                {/* ─── KPIS ─── */}
                <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <Card className='border-border bg-card/50'>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <HugeiconsIcon icon={Wallet02Icon} size={20} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-8 w-24" /> : (
                                <>
                                    <Typography scale='xl' weight='bold'>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                    <Typography scale='xs' className="text-emerald-500 flex items-center gap-1 mt-1">
                                        <HugeiconsIcon icon={PieChartIcon} size={12} />
                                        +{insights?.growth_rate}% from last month
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className='border-border bg-card/50'>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                            <HugeiconsIcon icon={Invoice01Icon} size={20} className="text-success" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-8 w-24" /> : (
                                <>
                                    <Typography scale='xl' weight='bold'>${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                    <Typography scale='xs' className="text-muted-foreground mt-1">
                                        Margin: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'}%
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className='border-border bg-card/50'>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
                            <HugeiconsIcon icon={Wallet02Icon} size={20} className="text-warning" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-8 w-24" /> : (
                                <>
                                    <Typography scale='xl' weight='bold'>{insights?.total_volume?.toLocaleString()}</Typography>
                                    <Typography scale='xs' className="text-muted-foreground mt-1">Total transactions</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className='border-border bg-card/50'>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Top Method</CardTitle>
                            <HugeiconsIcon icon={UserMultipleIcon} size={20} className="text-info" />
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-8 w-24" /> : (
                                <>
                                    <Typography scale='xl' weight='bold'>{insights?.top_payment_method}</Typography>
                                    <Typography scale='xs' className="text-muted-foreground mt-1">Most used gateway</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* ─── CHARTS (Revenue Insights) ─── */}
                <section className='grid lg:grid-cols-2 grid-cols-1 gap-6'>
                    {loading ? <Skeleton className="h-[400px] w-full" /> : <RevenueGrowthChart data={stats} />}
                    {loading ? <Skeleton className="h-[400px] w-full" /> : <TransactionVolumeChart data={stats} />}
                </section>



                {/* ─── TRANSACTION TABLE ─── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Typography scale="lg" className='font-season-mix'>Recent Transactions</Typography>
                        <div className="relative min-w-[200px] max-w-xs">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <HugeiconsIcon icon={Search02Icon} size={18} />
                            </div>
                            <Input
                                placeholder="Search transactions..."
                                className="pl-10 rounded-full h-10 border border-border bg-card/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <DataTable columns={columns} data={transactions} loading={loading} />
                    </div>
                    {!loading && totalItems > 0 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                currentPage={page}
                                totalPages={Math.ceil(totalItems / pageSize)}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default RevenuePage;
