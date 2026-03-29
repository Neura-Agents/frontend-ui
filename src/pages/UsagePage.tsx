import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Field } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon, Search02Icon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';

import { useSearchParams } from 'react-router-dom';

import { apiKeysService } from '@/services/apiKeysService';
import { agentsService } from '@/services/agentsService';
import { usageService } from '@/services/usageService';
import type { Usage } from '@/services/usageService';
import type { ApiKey } from '@/tables/api-keys/columns';
import { columns } from '@/tables/usage/columns';
import { DataTable } from '@/tables/usage/data-table';
import { RequestsChart } from '@/charts/usage/requests';
import { SpendTrendsChart } from '@/charts/usage/spend-trends';

const UsagePage: React.FC = () => {
    const isMobile = useIsMobile();
    const [searchParams, setSearchParams] = useSearchParams();
    const [apiKeyData, setApiKeyData] = React.useState<ApiKey[]>([]);
    const [agentData, setAgentData] = React.useState<any[]>([]);
    const [usageData, setUsageData] = React.useState<Usage[]>([]);
    const [chartData, setChartData] = React.useState<Usage[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [totalItems, setTotalItems] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(10);
    const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = React.useState(searchParams.get('q') || '');

    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const agent = searchParams.get('agent') || 'all';
    const apiKey = searchParams.get('api_key') || 'all';

    const [isOpen, setIsOpen] = React.useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const from = fromParam ? new Date(fromParam) : subDays(new Date(), 7);
        const to = toParam ? new Date(toParam) : new Date();
        return {
            from: isNaN(from.getTime()) ? subDays(new Date(), 7) : from,
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

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const filter = {
                agent_id: agent,
                api_key: apiKey,
                search: debouncedSearch,
                start_time: date?.from ? startOfDay(date.from).toISOString() : undefined,
                end_time: date?.to ? endOfDay(date.to).toISOString() : undefined,
            };

            const [keys, agents, usageResult, statsResult] = await Promise.all([
                apiKeysService.listKeys(),
                agentsService.getAgents(),
                usageService.listUsage({ ...filter, page, limit: pageSize }),
                usageService.getUsageStats(filter)
            ]);
            setApiKeyData(keys);
            setAgentData(agents.agents || []);
            setTotalItems(usageResult.total);

            // Map usage data with Human Readable Names
            const mappedUsage = usageResult.items.map(u => ({
                ...u,
                agentName: agents.agents?.find((a: any) => a.slug === u.agent_id || a.id === u.agent_id)?.name || u.agent_id,
                apiKeyName: keys.find(k => k.id === u.api_key)?.name || (u.api_key ? 'Unknown Key' : (u.user_id ? 'Playground' : 'System'))
            }));
            setUsageData(mappedUsage);
            setChartData(statsResult as Usage[]);
        } catch (error) {
            console.error('Failed to fetch usage data:', error);
        } finally {
            setLoading(false);
        }
    }, [agent, apiKey, date, page, pageSize, debouncedSearch]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
            if (searchQuery) {
                updateParams({ q: searchQuery });
            } else {
                updateParams({ q: null });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, updateParams]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from) {
            updateParams({
                from: format(range.from, "yyyy-MM-dd"),
                to: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
            });
        }
    };

    const totalCost = chartData.reduce((acc, curr) => acc + (curr.total_cost || 0), 0);
    const totalRequests = totalItems;

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-8 pt-32 md:pt-0 pb-20">
            {/* ─── HERO ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <Typography variant="page-header">
                            Usage
                        </Typography>
                        <Typography variant="page-description">
                            Track your API consumption and costs in real-time
                        </Typography>
                    </div>
                </div>
            </section>

            <div className='px-2 flex flex-col gap-6'>
                {/* ─── FILTERS ─── */}
                <section className='space-y-4 mb-4'>
                    <div className='flex lg:items-center lg:justify-between justify-start flex-col lg:flex-row gap-4'>
                        <div className='flex flex-row gap-4'>
                            <Field className="w-full max-w-xs">
                                <Select value={agent} onValueChange={(val) => updateParams({ agent: val })}>
                                    <SelectTrigger size='lg' className='rounded-full border border-border'>
                                        <SelectValue placeholder="Select Agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Agents</SelectItem>
                                            {agentData.map(a => (
                                                <SelectItem key={a.id} value={a.slug || a.id}>{a.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field className="w-full max-w-xs">
                                <Select value={apiKey} onValueChange={(val) => updateParams({ api_key: val })}>
                                    <SelectTrigger size='lg' className='rounded-full border border-border'>
                                        <SelectValue placeholder="Select API Key" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All API Keys</SelectItem>
                                            {apiKeyData.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <div className='flex gap-4 lg:flex-row flex-col'>
                            <div className='flex gap-4'>
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
                                                        { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
                                                        { label: '30 days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
                                                        { label: '90 days', getValue: () => ({ from: subDays(new Date(), 89), to: new Date() }) },
                                                    ].map((preset) => {
                                                        const presetValue = preset.getValue();
                                                        return (
                                                            <Button
                                                                key={preset.label}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="rounded-lg w-full justify-start font-normal"
                                                                onClick={() => {
                                                                    handleDateSelect(presetValue);
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                {preset.label}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={handleDateSelect}
                                                numberOfMonths={isMobile ? 1 : 2}
                                                className="p-3"
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    variant="outline"
                                    size="icon-lg"
                                    iconOnly
                                    className="rounded-full border-border"
                                    onClick={fetchData}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin size-5" /> : <HugeiconsIcon icon={Refresh01Icon} />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── METRICS ─── */}
                <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Card className='border-border shadow-sm w-full'>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Spend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Typography scale='xl' weight='bold' className="tracking-tight">
                                ${totalCost.toFixed(4)}
                            </Typography>
                            <Typography scale='xs' className="mt-1 text-muted-foreground">
                                Estimated total cost
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card className='border-border shadow-sm w-full'>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Typography scale='xl' weight='bold' className="tracking-tight">
                                {totalRequests}
                            </Typography>
                            <Typography scale='xs' className="mt-1 text-muted-foreground">
                                Successful agent executions
                            </Typography>
                        </CardContent>
                    </Card>
                </section>

                {/* ─── DATA TABLE ─── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Typography scale="lg" className='font-season-mix'>Execution History</Typography>
                        <div className="relative min-w-[200px] max-w-xs">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <HugeiconsIcon icon={Search02Icon} size={18} />
                            </div>
                            <Input
                                placeholder="Search execution ID..."
                                className="pl-10 rounded-full h-10 border border-border bg-card/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-64 border border-dashed rounded-xl">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <DataTable columns={columns} data={usageData} />
                            {totalItems > 0 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={Math.ceil(totalItems / pageSize)}
                                    onPageChange={setPage}
                                />
                            )}
                        </div>
                    )}
                </section>

                {/* ─── CHARTS ─── */}
                <section className='grid lg:grid-cols-2 grid-cols-1 gap-6'>
                    <SpendTrendsChart data={chartData} dateRange={date} />
                    <RequestsChart data={chartData} dateRange={date} />
                </section>

            </div>
        </div >
    );
};

export default UsagePage;
