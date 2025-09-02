import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CropDistribution } from '@/types/dashboard';

interface CropDistributionChartProps {
    data: CropDistribution[];
    loading?: boolean;
}

export const CropDistributionChart: React.FC<CropDistributionChartProps> = ({
    data,
    loading = false
}) => {
    if (loading) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Crop Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🌱</div>
                            <p>No crop data available</p>
                            <p className="text-sm">Start adding crops to see distribution</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map(item => ({
        name: item.type,
        count: item.count,
        percentage: item.percentage,
        color: item.color
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">Count: {data.count}</p>
                    <p className="text-sm">Percentage: {data.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {item.type}: {item.count} ({item.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};