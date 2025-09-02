import asyncHandler from 'express-async-handler';
import prisma from '../prisma/index.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Get all statistics in parallel for better performance
        const [
            totalFarmers,
            totalCrops,
            totalYield,
            activeRegions,
            previousMonthFarmers,
            previousMonthCrops,
            previousMonthYield
        ] = await Promise.all([
            // Current month stats
            prisma.user.count({
                where: { role: 'FARMER' }
            }),
            prisma.crop.count(),
            prisma.crop.aggregate({
                _sum: { quantity: true }
            }),
            prisma.profile.groupBy({
                by: ['location'],
                where: {
                    location: { not: null }
                },
                _count: { location: true }
            }),

            // Previous month stats for growth calculation
            prisma.user.count({
                where: {
                    role: 'FARMER',
                    createdAt: {
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
                    }
                }
            }),
            prisma.crop.count({
                where: {
                    createdAt: {
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
                    }
                }
            }),
            prisma.crop.aggregate({
                where: {
                    createdAt: {
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
                    }
                },
                _sum: { quantity: true }
            })
        ]);

        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const farmersGrowth = calculateGrowth(totalFarmers, previousMonthFarmers);
        const cropsGrowth = calculateGrowth(totalCrops, previousMonthCrops);
        const yieldGrowth = calculateGrowth(totalYield._sum.quantity || 0, previousMonthYield._sum.quantity || 0);

        const stats = {
            totalFarmers,
            totalCrops,
            totalYield: totalYield._sum.quantity || 0,
            activeRegions: activeRegions.length,
            farmersGrowth,
            cropsGrowth,
            yieldGrowth
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard statistics'
        });
    }
});

// @desc    Get crop distribution statistics
// @route   GET /api/dashboard/crops/distribution
// @access  Private/Admin
const getCropDistribution = asyncHandler(async (req, res) => {
    try {
        const cropDistribution = await prisma.crop.groupBy({
            by: ['type'],
            _count: { type: true },
            _sum: { quantity: true },
            orderBy: {
                _count: {
                    type: 'desc'
                }
            }
        });

        const totalCrops = await prisma.crop.count();

        const distributionWithPercentage = cropDistribution.map(item => ({
            type: item.type,
            count: item._count.type,
            totalQuantity: item._sum.quantity || 0,
            percentage: totalCrops > 0 ? Math.round((item._count.type / totalCrops) * 100) : 0
        }));

        res.status(200).json({
            success: true,
            data: distributionWithPercentage
        });

    } catch (error) {
        console.error('Crop distribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching crop distribution'
        });
    }
});

// @desc    Get recent activity
// @route   GET /api/dashboard/activity/recent
// @access  Private/Admin
const getRecentActivity = asyncHandler(async (req, res) => {
    try {
        // Get recent farmer registrations
        const recentFarmers = await prisma.user.findMany({
            where: { role: 'FARMER' },
            include: {
                profile: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        // Get recent crop additions
        const recentCrops = await prisma.crop.findMany({
            include: {
                farmer: {
                    include: {
                        profile: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        // Format activity data
        const activities = [];

        // Add farmer registrations
        recentFarmers.forEach(farmer => {
            activities.push({
                id: `farmer-${farmer.id}`,
                type: 'farmer_registered',
                title: 'New Farmer Registered',
                description: `${farmer.profile?.fullName || 'Unknown farmer'} joined the platform`,
                timestamp: farmer.createdAt,
                farmerName: farmer.profile?.fullName
            });
        });

        // Add crop additions
        recentCrops.forEach(crop => {
            activities.push({
                id: `crop-${crop.id}`,
                type: 'crop_added',
                title: 'New Crop Added',
                description: `${crop.farmer.profile?.fullName || 'Unknown farmer'} added ${crop.quantity}kg of ${crop.name}`,
                timestamp: crop.createdAt,
                farmerName: crop.farmer.profile?.fullName,
                cropType: crop.name
            });
        });

        // Sort by timestamp and limit to 15 activities
        const sortedActivities = activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 15)
            .map(activity => ({
                ...activity,
                timestamp: new Date(activity.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }));

        res.status(200).json({
            success: true,
            data: sortedActivities
        });

    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching recent activity'
        });
    }
});

// @desc    Get farmers by region distribution
// @route   GET /api/dashboard/farmers/regions
// @access  Private/Admin
const getFarmersByRegion = asyncHandler(async (req, res) => {
    try {
        const regionDistribution = await prisma.profile.groupBy({
            by: ['location'],
            where: {
                location: { not: null }
            },
            _count: { location: true },
            orderBy: {
                _count: {
                    location: 'desc'
                }
            }
        });

        // Get crop counts per region
        const regionsWithCrops = await Promise.all(
            regionDistribution.map(async (region) => {
                const cropCount = await prisma.crop.count({
                    where: {
                        farmer: {
                            profile: {
                                location: region.location
                            }
                        }
                    }
                });

                return {
                    region: region.location || 'Unknown',
                    farmerCount: region._count.location,
                    cropCount: cropCount
                };
            })
        );

        res.status(200).json({
            success: true,
            data: regionsWithCrops
        });

    } catch (error) {
        console.error('Region distribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching region distribution'
        });
    }
});

// @desc    Get system overview (all dashboard data in one endpoint)
// @route   GET /api/dashboard/overview
// @access  Private/Admin
const getSystemOverview = asyncHandler(async (req, res) => {
    try {
        const [stats, cropDistribution, recentActivity, regionDistribution] = await Promise.allSettled([
            // Stats
            (async () => {
                const [totalFarmers, totalCrops, totalYield, activeRegions] = await Promise.all([
                    prisma.user.count({ where: { role: 'FARMER' } }),
                    prisma.crop.count(),
                    prisma.crop.aggregate({ _sum: { quantity: true } }),
                    prisma.profile.groupBy({
                        by: ['location'],
                        where: { location: { not: null } },
                        _count: { location: true }
                    })
                ]);

                return {
                    totalFarmers,
                    totalCrops,
                    totalYield: totalYield._sum.quantity || 0,
                    activeRegions: activeRegions.length
                };
            })(),

            // Crop distribution
            prisma.crop.groupBy({
                by: ['type'],
                _count: { type: true },
                orderBy: { _count: { type: 'desc' } }
            }),

            // Recent activity (simplified)
            prisma.user.findMany({
                where: { role: 'FARMER' },
                include: { profile: true },
                orderBy: { createdAt: 'desc' },
                take: 5
            }),

            // Region distribution
            prisma.profile.groupBy({
                by: ['location'],
                where: { location: { not: null } },
                _count: { location: true },
                orderBy: { _count: { location: 'desc' } },
                take: 8
            })
        ]);

        // Process results
        const overview = {
            stats: stats.status === 'fulfilled' ? stats.value : null,
            cropDistribution: cropDistribution.status === 'fulfilled' ? cropDistribution.value : [],
            recentActivity: recentActivity.status === 'fulfilled' ? recentActivity.value : [],
            regionDistribution: regionDistribution.status === 'fulfilled' ? regionDistribution.value : []
        };

        res.status(200).json({
            success: true,
            data: overview
        });

    } catch (error) {
        console.error('System overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching system overview'
        });
    }
});

export {
    getDashboardStats,
    getCropDistribution,
    getRecentActivity,
    getFarmersByRegion,
    getSystemOverview
};