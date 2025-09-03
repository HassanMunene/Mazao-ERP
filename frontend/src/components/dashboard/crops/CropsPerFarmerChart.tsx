import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface FarmerCropData {
    farmerId: string;
    farmerName: string;
    cropCount: number;
    location?: string;
}

interface CropsPerFarmerChartProps {
    data: FarmerCropData[];
    loading: boolean;
}

export const CropsPerFarmerChart: React.FC<CropsPerFarmerChartProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="h-80 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p>No crop data available</p>
                    <p className="text-sm">Crops will appear here once farmers add them</p>
                </div>
            </div>
        );
    }

    // Sort data by crop count and take top 10
    const chartData = data
        .sort((a, b) => b.cropCount - a.cropCount)
        .slice(0, 10)
        .map(item => ({
            name: item.farmerName.length > 15 ? `${item.farmerName.substring(0, 15)}...` : item.farmerName,
            crops: item.cropCount,
            fullName: item.farmerName,
            location: item.location
        }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded-lg shadow-md">
                    <p className="font-semibold">{data.fullName}</p>
                    <p className="text-sm text-muted-foreground">{data.location || 'No location'}</p>
                    <p className="text-green-600 font-bold">{payload[0].value} crops</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{
                            value: 'Number of Crops',
                            angle: -90,
                            position: 'insideLeft',
                            offset: -10,
                            style: { textAnchor: 'middle', fontSize: 12 }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="crops"
                        fill="#16a34a"
                        radius={[4, 4, 0, 0]}
                        name="Crops"
                    />
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
                Showing top {chartData.length} farmers by crop count
            </p>
        </div>
    );
};