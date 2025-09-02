import React from 'react';
import { Users, Sprout, BarChart3, MapPin, Activity } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCard } from '@/components/dashboard/StatCard';
import { CropDistributionChart } from '@/components/dashboard/CropDistributionChart';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const {
        stats,
        cropDistribution,
        recentActivity,
        regionDistribution,
        loading,
        error,
        refetch
    } = useDashboardData();

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={refetch} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your Agricultural Management System
                    </p>
                </div>
                <Button onClick={refetch} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Farmers"
                    value={stats?.totalFarmers.toLocaleString() || '0'}
                    growth={stats?.farmersGrowth}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    loading={loading}
                />
                <StatCard
                    title="Total Crops"
                    value={stats?.totalCrops.toLocaleString() || '0'}
                    growth={stats?.cropsGrowth}
                    icon={<Sprout className="h-4 w-4 text-muted-foreground" />}
                    loading={loading}
                />
                <StatCard
                    title="Active Regions"
                    value={stats?.activeRegions.toString() || '0'}
                    icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                    loading={loading}
                />
            </div>

            {/* Region Distribution */}
            <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Farmers by Region</h3>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center">
                                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : regionDistribution.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {regionDistribution.slice(0, 8).map((region, index) => (
                            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-sm mb-1">{region.region}</h4>
                                <p className="text-2xl font-bold text-green-600">{region.farmerCount}</p>
                                <p className="text-xs text-muted-foreground">farmers</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No regional data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;