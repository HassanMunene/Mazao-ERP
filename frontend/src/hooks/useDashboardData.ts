import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { DashboardStats, CropDistribution, RecentActivity, FarmerRegionDistribution } from '@/types/dashboard';

export const useDashboardData = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [cropDistribution, setCropDistribution] = useState<CropDistribution[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [regionDistribution, setRegionDistribution] = useState<FarmerRegionDistribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel using the new endpoints
                const [statsResponse, cropsResponse, activityResponse, regionsResponse] = await Promise.allSettled([
                    api.get('/dashboard/stats'),           // Changed from '/users/stats/count'
                    api.get('/dashboard/crops/distribution'), // Changed from '/crops/stats/summary'
                    api.get('/dashboard/activity/recent'), // Changed from '/activity/recent'
                    api.get('/dashboard/farmers/regions')  // Changed from '/farmers/regions/distribution'
                ]);

                // Process stats - updated to match new response structure
                if (statsResponse.status === 'fulfilled') {
                    const statsData = statsResponse.value.data.data; // Note: response is { success: true, data: {...} }
                    setStats({
                        totalFarmers: statsData.totalFarmers || 0,
                        totalCrops: statsData.totalCrops || 0,
                        totalYield: statsData.totalYield || 0,
                        activeRegions: statsData.activeRegions || 0,
                        farmersGrowth: statsData.farmersGrowth || 0,
                        cropsGrowth: statsData.cropsGrowth || 0,
                        yieldGrowth: statsData.yieldGrowth || 0
                    });
                } else {
                    console.warn('Stats request failed:', statsResponse.reason);
                }

                // Process crop distribution - updated structure
                if (cropsResponse.status === 'fulfilled') {
                    const cropsData = cropsResponse.value.data.data;
                    if (cropsData && Array.isArray(cropsData)) {
                        setCropDistribution(cropsData.map((item: any) => ({
                            type: item.type,
                            count: item.count || 0,
                            percentage: item.percentage || 0,
                            color: getColorForCropType(item.type)
                        })));
                    }
                } else {
                    console.warn('Crop distribution request failed:', cropsResponse.reason);
                }

                // Process recent activity - updated structure
                if (activityResponse.status === 'fulfilled') {
                    const activityData = activityResponse.value.data.data;
                    if (activityData && Array.isArray(activityData)) {
                        setRecentActivity(activityData);
                    }
                } else {
                    console.warn('Recent activity request failed:', activityResponse.reason);
                }

                // Process region distribution - updated structure
                if (regionsResponse.status === 'fulfilled') {
                    const regionsData = regionsResponse.value.data.data;
                    if (regionsData && Array.isArray(regionsData)) {
                        setRegionDistribution(regionsData);
                    }
                } else {
                    console.warn('Region distribution request failed:', regionsResponse.reason);
                }

                // Check if all requests failed
                const allFailed = [
                    statsResponse.status === 'rejected',
                    cropsResponse.status === 'rejected',
                    activityResponse.status === 'rejected',
                    regionsResponse.status === 'rejected'
                ].every(failed => failed);

                if (allFailed) {
                    throw new Error('All dashboard requests failed');
                }

            } catch (err: any) {
                console.error('Failed to fetch dashboard data:', err);
                const errorMessage = err.response?.data?.message || 
                                   err.message || 
                                   'Failed to load dashboard data';
                setError(errorMessage);

                // Set fallback data
                setStats(getFallbackStats());
                setCropDistribution(getFallbackCropDistribution());
                setRecentActivity(getFallbackActivity());
                setRegionDistribution(getFallbackRegionDistribution());

            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Re-fetch all data sequentially to avoid overloading
            const [
                statsResponse, 
                cropsResponse, 
                activityResponse, 
                regionsResponse
            ] = await Promise.allSettled([
                api.get('/dashboard/stats'),
                api.get('/dashboard/crops/distribution'),
                api.get('/dashboard/activity/recent'),
                api.get('/dashboard/farmers/regions')
            ]);

            // Process responses (same as above)
            if (statsResponse.status === 'fulfilled') {
                const statsData = statsResponse.value.data.data;
                setStats({
                    totalFarmers: statsData.totalFarmers || 0,
                    totalCrops: statsData.totalCrops || 0,
                    totalYield: statsData.totalYield || 0,
                    activeRegions: statsData.activeRegions || 0,
                    farmersGrowth: statsData.farmersGrowth || 0,
                    cropsGrowth: statsData.cropsGrowth || 0,
                    yieldGrowth: statsData.yieldGrowth || 0
                });
            }

            if (cropsResponse.status === 'fulfilled') {
                const cropsData = cropsResponse.value.data.data;
                if (cropsData && Array.isArray(cropsData)) {
                    setCropDistribution(cropsData.map((item: any) => ({
                        type: item.type,
                        count: item.count || 0,
                        percentage: item.percentage || 0,
                        color: getColorForCropType(item.type)
                    })));
                }
            }

            if (activityResponse.status === 'fulfilled') {
                const activityData = activityResponse.value.data.data;
                if (activityData && Array.isArray(activityData)) {
                    setRecentActivity(activityData);
                }
            }

            if (regionsResponse.status === 'fulfilled') {
                const regionsData = regionsResponse.value.data.data;
                if (regionsData && Array.isArray(regionsData)) {
                    setRegionDistribution(regionsData);
                }
            }

        } catch (err: any) {
            console.error('Failed to refetch dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to refresh dashboard data');
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        cropDistribution,
        recentActivity,
        regionDistribution,
        loading,
        error,
        refetch
    };
};

// Fallback data functions
const getFallbackStats = (): DashboardStats => ({
    totalFarmers: 0,
    totalCrops: 0,
    totalYield: 0,
    activeRegions: 0,
    farmersGrowth: 0,
    cropsGrowth: 0,
    yieldGrowth: 0
});

const getFallbackCropDistribution = (): CropDistribution[] => [
    { type: 'CEREAL', count: 0, percentage: 0, color: '#16a34a' },
    { type: 'LEGUME', count: 0, percentage: 0, color: '#2563eb' },
    { type: 'VEGETABLE', count: 0, percentage: 0, color: '#dc2626' },
    { type: 'FRUIT', count: 0, percentage: 0, color: '#ea580c' },
    { type: 'ROOT_TUBER', count: 0, percentage: 0, color: '#9333ea' },
    { type: 'OTHER', count: 0, percentage: 0, color: '#6b7280' }
];

const getFallbackActivity = (): RecentActivity[] => [
    {
        id: 'fallback-1',
        type: 'system_alert',
        title: 'Welcome to Mazao ERP',
        description: 'System is initializing. Data will appear here soon.',
        timestamp: new Date().toLocaleDateString()
    }
];

const getFallbackRegionDistribution = (): FarmerRegionDistribution[] => [
    { region: 'Nairobi', farmerCount: 0, cropCount: 0 },
    { region: 'Nakuru', farmerCount: 0, cropCount: 0 },
    { region: 'Mombasa', farmerCount: 0, cropCount: 0 },
    { region: 'Kisumu', farmerCount: 0, cropCount: 0 }
];

const getColorForCropType = (type: string): string => {
    const colorMap: { [key: string]: string } = {
        'CEREAL': '#16a34a',      // Green
        'LEGUME': '#2563eb',      // Blue
        'VEGETABLE': '#dc2626',   // Red
        'FRUIT': '#ea580c',       // Orange
        'ROOT_TUBER': '#9333ea',  // Purple
        'OTHER': '#6b7280'        // Gray
    };
    
    return colorMap[type] || '#6b7280';
};