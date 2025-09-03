import { MapPin } from "lucide-react"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface RegionData {
    region: string;
    farmerCount: number;
}

interface RegionPieChartProps {
    data: RegionData[];
    loading: boolean;
}

// Generate colors for the chart
const regionColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
]

export function RegionPieChart({ data, loading }: RegionPieChartProps) {
    // Transform data for the chart
    const chartData = data.map((region, index) => ({
        name: region.region,
        value: region.farmerCount,
        fill: regionColors[index % regionColors.length],
    }))

    const chartConfig = {
        value: {
            label: "Farmers",
        },
        ...Object.fromEntries(
            data.map((region, index) => [
                region.region.toLowerCase().replace(/\s+/g, '_'),
                {
                    label: region.region,
                    color: regionColors[index % regionColors.length],
                }
            ])
        )
    } satisfies ChartConfig

    if (loading) {
        return (
            <Card className="flex flex-col h-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Farmers by Region</CardTitle>
                    <CardDescription>Regional distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0 flex items-center justify-center">
                    <div className="animate-pulse rounded-full bg-gray-200 h-40 w-40"></div>
                </CardContent>
            </Card>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Card className="flex flex-col h-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Farmers by Region</CardTitle>
                    <CardDescription>Regional distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No regional data available</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Farmers by Region</CardTitle>
                <CardDescription>Regional distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[200px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) =>
                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                }
                                labelLine={false}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}