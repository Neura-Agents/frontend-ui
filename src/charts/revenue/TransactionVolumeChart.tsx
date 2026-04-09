import { BarChart, CartesianGrid, Bar, XAxis } from "recharts"
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
    transactions: {
        label: "Transactions",
        color: "var(--warning)",
    },
} satisfies ChartConfig

interface TransactionVolumeChartProps {
    data: RevenueStats[];
}

export function TransactionVolumeChart({ data }: TransactionVolumeChartProps) {
    const Chart = ({ isEnlarged = false }: { isEnlarged?: boolean }) => (
        <ChartContainer config={chartConfig} className={isEnlarged ? "h-full w-full" : "h-[350px] w-full"}>
            <BarChart
                data={data}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
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
                            indicator="dashed" 
                            labelFormatter={(value) => format(parseISO(value), 'MMM dd, yyyy')}
                        />
                    }
                />
                <Bar
                    dataKey="transactions"
                    fill="var(--color-transactions)"
                    radius={[4, 4, 0, 0]}
                    barSize={isEnlarged ? 60 : 30}
                />
            </BarChart>
        </ChartContainer>
    );

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                    <CardTitle>Transaction Volume</CardTitle>
                    <CardDescription>Number of successful transactions per day</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hidden lg:flex h-9 w-9 rounded-full hover:bg-secondary">
                            <HugeiconsIcon icon={Maximize01Icon} size={18} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw]! w-full h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Transaction Volume (Detailed View)</DialogTitle>
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
