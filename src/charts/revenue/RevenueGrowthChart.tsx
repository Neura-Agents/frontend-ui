import { AreaChart, CartesianGrid, Area, XAxis } from "recharts"
import { format, parseISO } from "date-fns"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { RevenueStats } from "@/services/revenueService"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "var(--primary)",
    },
    profit: {
        label: "Profit",
        color: "var(--success)",
    },
} satisfies ChartConfig

interface RevenueGrowthChartProps {
    data: RevenueStats[];
}

export function RevenueGrowthChart({ data }: RevenueGrowthChartProps) {
    const Chart = ({ isEnlarged = false }: { isEnlarged?: boolean }) => (
        <ChartContainer config={chartConfig} className={isEnlarged ? "h-full w-full" : "h-[350px] w-full"}>
            <AreaChart
                data={data}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
                <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                    minTickGap={30}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent 
                            indicator="dot" 
                            labelFormatter={(value) => format(parseISO(value), 'MMM dd, yyyy')}
                        />
                    }
                />
                <Area
                    dataKey="revenue"
                    type="natural"
                    fill="url(#fillRevenue)"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    stackId="a"
                />
                <Area
                    dataKey="profit"
                    type="natural"
                    fill="url(#fillProfit)"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    stackId="b"
                />
            </AreaChart>
        </ChartContainer>
    );

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                    <CardTitle>Revenue & Profit Growth</CardTitle>
                    <CardDescription>Daily breakdown of total revenue vs net profit</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hidden lg:flex h-9 w-9 rounded-full hover:bg-secondary">
                            <HugeiconsIcon icon={Maximize01Icon} size={18} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw]! w-full h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Revenue & Profit Growth (Detailed View)</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full overflow-hidden">
                            <Chart isEnlarged />
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Chart />
            </CardContent>
        </Card>
    )
}
