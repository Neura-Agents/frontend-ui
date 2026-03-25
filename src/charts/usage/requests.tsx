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

const requestsData = [
    { date: "2026-03-08", requests: 0 },
    { date: "2026-03-09", requests: 0 },
    { date: "2026-03-10", requests: 1 },
    { date: "2026-03-11", requests: 1 },
    { date: "2026-03-12", requests: 1 },
    { date: "2026-03-13", requests: 0 },
    { date: "2026-03-14", requests: 0 },
]

const chartConfig = {
    requests: {
        label: "Requests",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function RequestsChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={requestsData}
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
                            dataKey="requests"
                            type="monotone"
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
