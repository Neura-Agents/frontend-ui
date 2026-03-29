import React from 'react';
import { LineChart, CartesianGrid, Line, XAxis } from "recharts"
import { format, parseISO, eachDayOfInterval, startOfDay, endOfDay, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { Usage } from "@/services/usageService"

const chartConfig = {
    spend: {
        label: "Spend",
        color: "var(--success)",
    },
} satisfies ChartConfig

interface SpendTrendsChartProps {
    data: Usage[];
    dateRange?: DateRange;
}

export function SpendTrendsChart({ data, dateRange }: SpendTrendsChartProps) {
    // Process data to aggregate spend per day, filling with 0s for missing days
    const aggregatedData = React.useMemo(() => {
        const dailySpends: Record<string, number> = {};
        
        // 1. Map existing data
        data.forEach(item => {
            const dateStr = format(new Date(item.created_at), 'yyyy-MM-dd');
            dailySpends[dateStr] = (dailySpends[dateStr] || 0) + (Number(item.total_cost) || 0);
        });

        // 2. Determine range of days to fill with 0 if data missing
        let days: Date[] = [];
        if (dateRange?.from && dateRange?.to) {
            days = eachDayOfInterval({
                start: startOfDay(dateRange.from),
                end: endOfDay(dateRange.to)
            });
        } else if (data.length > 0) {
            // Fallback to range of data if no dateRange provided
            const sorted = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            days = eachDayOfInterval({
                start: startOfDay(new Date(sorted[0].created_at)),
                end: endOfDay(new Date(sorted[sorted.length - 1].created_at))
            });
        } else {
            // Last resort: last 7 days
            days = eachDayOfInterval({
                start: subDays(new Date(), 6),
                end: new Date()
            });
        }

        return days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return {
                date: dateStr,
                spend: parseFloat((dailySpends[dateStr] || 0).toFixed(4))
            };
        });
    }, [data, dateRange]);

    return (
        <Card className="border-border/40 shadow-sm">
            <CardHeader>
                <CardTitle>Spend Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={aggregatedData}
                        margin={{ left: 24, right: 24, top: 12, bottom: 12 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                            padding={{ left: 10, right: 10 }}
                            minTickGap={30}
                            interval={aggregatedData.length <= 14 ? 0 : "preserveStartEnd"}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="spend"
                            type="monotone"
                            stroke="var(--color-spend)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
