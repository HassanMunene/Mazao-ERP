import React from 'react';
import { Users, Sprout, MapPin, BarChart3, Grid3X3 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { CropsPerFarmerChart } from '@/components/dashboard/crops/CropsPerFarmerChart';
import { useCropsData } from '@/hooks/useCropsData';
import { RegionPieChart } from '@/components/dashboard/RegionDistributionPieChart';

const AdminDashboard: React.FC = () => {
    const {
        stats,
        regionDistribution,
        loading,
        error,
        refetch
    } = useDashboardData();
    const { data: cropsData, loading: cropsLoading } = useCropsData();

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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crops per Farmer Chart */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Crops per Farmer</h3>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CropsPerFarmerChart data={cropsData} loading={cropsLoading} />
                </div>

                {/* Region Distribution Pie Chart */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Region Distribution</h3>
                        <Grid3X3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <RegionPieChart data={regionDistribution} loading={loading} />
                </div>
            </div>

            {/* Region Details Table */}
            <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Region Details</h3>
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