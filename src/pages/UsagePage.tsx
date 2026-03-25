import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh01Icon } from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

import { useSearchParams } from 'react-router-dom';

import { data as apiKeyData } from '@/tables/api-keys/columns';
import { RequestsChart } from '@/charts/usage/requests';
import { SpendTrendsChart } from '@/charts/usage/spend-trends';

const UsagePage: React.FC = () => {
    const isMobile = useIsMobile();
    const [searchParams, setSearchParams] = useSearchParams();

    const source = searchParams.get('source') || 'overview';
    const trendInterval = searchParams.get('trend_interval') || 'daily';
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const [isOpen, setIsOpen] = React.useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const from = fromParam ? new Date(fromParam) : subDays(new Date(), 2);
        const to = toParam ? new Date(toParam) : new Date();
        return {
            from: isNaN(from.getTime()) ? subDays(new Date(), 2) : from,
            to: isNaN(to.getTime()) ? new Date() : to,
        };
    });

    const updateParams = (updates: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams);
    };

    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from) {
            updateParams({
                from: format(range.from, "yyyy-MM-dd"),
                to: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd"),
            });
        }
    };

    React.useEffect(() => {
        const from = fromParam ? new Date(fromParam) : subDays(new Date(), 2);
        const to = toParam ? new Date(toParam) : new Date();
        if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
            setDate({ from, to });
        }
    }, [fromParam, toParam]);

    const agent = searchParams.get('agent') || 'all';
    const apiKey = searchParams.get('api_key') || 'all';

    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-700 space-y-24 pt-32 md:pt-0">
            {/* ─── HERO / PREVIEW ─── */}
            <section className="lg:mb-16 md:mb-10 mb-6 lg:pl-0 md:pl-0 pl-16 lg:pb-0 lg:border-0 md:border-0 md:pb-0 border-b border-border pb-4 pt-7 fixed top-0 bg-card z-50 lg:static lg:bg-transparent lg:z-auto md:static md:bg-transparent md:z-auto w-full">
                <Typography variant="page-header">
                    Usage
                </Typography>
                <Typography variant="page-description">
                    Track your API consumption and costs
                </Typography>
            </section>
            <section tabIndex={0} className='space-y-4 mb-4 px-2'>
                <Tabs value={source} onValueChange={(val) => updateParams({ source: val, api_key: val === 'api' ? apiKey : null })}>
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                        <TabsTrigger value="playground">Playground</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className='flex lg:items-center lg:justify-between justify-start flex-col lg:flex-row gap-4'>
                    <div className='flex gap-4'>
                        <Field className="w-full max-w-48">
                            <Select value={agent} onValueChange={(val) => updateParams({ agent: val })}>
                                <SelectTrigger size='lg' className='rounded-full'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Agents</SelectItem>
                                        <SelectItem value="gpt-4o">Summarizer Agent</SelectItem>
                                        <SelectItem value="gemini-2.5-flash">Web Scraper Agent</SelectItem>
                                        <SelectItem value="opus-4.5">PDF Agent</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        {source === "api" && (
                            <Field className="w-full max-w-48">
                                <Select value={apiKey} onValueChange={(val) => updateParams({ api_key: val })}>
                                    <SelectTrigger size='lg' className='rounded-full'>
                                        <SelectValue />
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
                        )}
                    </div>
                    <div className='flex gap-4 lg:flex-row flex-col'>
                        <Tabs value={trendInterval} onValueChange={(val) => updateParams({ trend_interval: val })}>
                            <TabsList>
                                <TabsTrigger value="daily">Daily</TabsTrigger>
                                <TabsTrigger value="hour">Hourly</TabsTrigger>
                                <TabsTrigger value="minute">Minute</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className='flex gap-4'>
                            <Popover open={isOpen} onOpenChange={setIsOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className={cn(
                                            "flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="size-4 text-muted-foreground" />
                                        {date?.from ? (
                                            date.to && format(date.from, "LLL dd, y") !== format(date.to, "LLL dd, y") ? (
                                                <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden border-border/40 shadow-2xl" align="end">
                                    <div className="flex flex-col md:flex-row h-full">
                                        {!isMobile && (
                                            <div className="border-r border-border p-2 flex flex-col items-center justify-center gap-1 bg-card">
                                                {[
                                                    { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
                                                    { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
                                                    { label: 'Last 14 days', getValue: () => ({ from: subDays(new Date(), 13), to: new Date() }) },
                                                    { label: '30 days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
                                                    { label: '60 days', getValue: () => ({ from: subDays(new Date(), 59), to: new Date() }) },
                                                    { label: '90 days', getValue: () => ({ from: subDays(new Date(), 89), to: new Date() }) },
                                                ].map((preset) => {
                                                    const presetValue = preset.getValue();
                                                    const isActive = date?.from && date?.to &&
                                                        format(date.from, "yyyy-MM-dd") === format(presetValue.from, "yyyy-MM-dd") &&
                                                        format(date.to, "yyyy-MM-dd") === format(presetValue.to, "yyyy-MM-dd");

                                                    return (
                                                        <Button
                                                            key={preset.label}
                                                            variant="ghost"
                                                            size="default"
                                                            className={cn(
                                                                "rounded-full w-full",
                                                                isActive && "border border-border"
                                                            )}
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

                            <Button variant="outline" size="icon-lg" iconOnly className="rounded-full">
                                <HugeiconsIcon icon={Refresh01Icon} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section className='flex lg:items-center lg:justify-between justify-start flex-col lg:flex-row gap-4 mb-4 px-2'>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Total Spends</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 overflow-scroll'>
                        <Typography scale='lg' weight='bold' font='season-mix'>$0.00</Typography>
                    </CardContent>
                </Card>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 overflow-scroll'>
                        <Typography scale='lg' weight='bold' font='season-mix'>0</Typography>
                    </CardContent>
                </Card>
            </section>
            <section className='grid lg:grid-cols-2 grid-cols-1 gap-4 px-2'>
                <SpendTrendsChart />
                <RequestsChart />
            </section>
        </div >
    );
};

export default UsagePage;
