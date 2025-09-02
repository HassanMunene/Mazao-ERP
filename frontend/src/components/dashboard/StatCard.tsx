import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    growth?: number;
    icon: React.ReactNode;
    loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    growth,
    icon,
    loading = false
}) => {
    const getGrowthIcon = () => {
        if (growth === undefined) return null;
        if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
        if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
        return <Minus className="h-4 w-4 text-gray-400" />;
    };

    const getGrowthText = () => {
        if (growth === undefined) return null;
        if (growth > 0) return `+${growth}%`;
        if (growth < 0) return `${growth}%`;
        return '0%';
    };

    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </CardTitle>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
                {growth !== undefined && (
                    <div className={cn(
                        "flex items-center text-xs mt-1",
                        growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-gray-500"
                    )}>
                        {getGrowthIcon()}
                        <span className="ml-1">{getGrowthText()}</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};