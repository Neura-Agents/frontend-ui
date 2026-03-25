import { LineChart, CartesianGrid, Line, XAxis } from "recharts"

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

const spendData = [
    { date: "2026-03-08", spend: 0 },
    { date: "2026-03-09", spend: 0 },
    { date: "2026-03-10", spend: 1 },
    { date: "2026-03-11", spend: 1 },
    { date: "2026-03-12", spend: 1 },
    { date: "2026-03-13", spend: 0 },
    { date: "2026-03-14", spend: 0 },
]

const chartConfig = {
    spend: {
        label: "Spend",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function SpendTrendsChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Spend Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={spendData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12,
                            bottom: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="spend"
                            type="monotone"
                            stroke="var(--color-success)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
