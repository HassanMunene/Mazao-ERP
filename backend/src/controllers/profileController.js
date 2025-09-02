import asyncHandler from 'express-async-handler';
import prisma from '../prisma/index.js';

// Validation helper function
export const isValidContactInfo = (contactInfo) => {
    // Simple phone number validation for Kenya (+254 format)
    const phoneRegex = /^(\+254|0)[1-9]\d{8}$/;
    return phoneRegex.test(contactInfo.replace(/\s/g, ''));
};

// Get current user profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
    try {
        const userWithProfile = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                profile: true,
                crops: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        quantity: true,
                        status: true,
                        plantingDate: true,
                        harvestDate: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5, // Get latest 5 crops
                },
            },
        });

        if (!userWithProfile) {
            res.status(404);
            throw new Error("User not found");
        }

        // Dashboard stats
        const cropStats = {
            totalCrops: await prisma.crop.count({
                where: { farmerId: req.user.id },
            }),
            cropsByType: await prisma.crop.groupBy({
                by: ["type"],
                where: { farmerId: req.user.id },
                _count: { type: true },
            }),
            totalQuantity: await prisma.crop.aggregate({
                where: { farmerId: req.user.id },
                _sum: { quantity: true },
            }),
        };

        res.status(200).json({
            success: true,
            data: {
                user: userWithProfile,
                stats: cropStats,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching profile",
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
export const updateMyProfile = asyncHandler(async (req, res) => {
    try {
        const { fullName, location, contactInfo, avatar } = req.body;

        // Validation: Check if required fields are present
        if (!fullName) {
            res.status(400);
            throw new Error('Full name is required');
        }

        // Validate contact info format if provided
        if (contactInfo && !isValidContactInfo(contactInfo)) {
            res.status(400);
            throw new Error('Please provide a valid phone number');
        }

        // Update profile in a transaction to ensure data consistency
        const updatedProfile = await prisma.$transaction(async (tx) => {
            // First, check if profile exists
            const existingProfile = await tx.profile.findUnique({
                where: { userId: req.user.id }
            });

            if (!existingProfile) {
                // Create profile if it doesn't exist (shouldn't happen, but safety first)
                return await tx.profile.create({
                    data: {
                        userId: req.user.id,
                        fullName,
                        location: location || null,
                        contactInfo: contactInfo || null,
                        avatar: avatar || null
                    }
                });
            }

            // Update existing profile
            return await tx.profile.update({
                where: { userId: req.user.id },
                data: {
                    fullName,
                    ...(location !== undefined && { location }),
                    ...(contactInfo !== undefined && { contactInfo }),
                    ...(avatar !== undefined && { avatar })
                }
            });
        });

        // Get updated user data with profile
        const updatedUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                profile: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);

        // Handle Prisma errors
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        } else {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Server error while updating profile'
            });
        }
    }
});

// @desc    Get user dashboard statistics
// @route   GET /api/profile/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let stats = {};

        if (userRole === 'FARMER') {
            // Farmer-specific stats
            stats = await getFarmerStats(userId);
        } else if (userRole === 'ADMIN') {
            // Admin-specific stats
            stats = await getAdminStats();
        }

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard statistics'
        });
    }
});

// Helper function for farmer statistics
const getFarmerStats = async (userId) => {
    const [
        totalCrops,
        cropsByStatus,
        recentCrops,
        totalQuantity
    ] = await Promise.all([
        prisma.crop.count({ where: { farmerId: userId } }),
        prisma.crop.groupBy({
            by: ['status'],
            where: { farmerId: userId },
            _count: { status: true }
        }),
        prisma.crop.findMany({
            where: { farmerId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                type: true,
                status: true,
                plantingDate: true
            }
        }),
        prisma.crop.aggregate({
            where: { farmerId: userId },
            _sum: { quantity: true }
        })
    ]);

    return {
        totalCrops,
        cropsByStatus,
        recentCrops,
        totalQuantity: totalQuantity._sum.quantity || 0
    };
};

// Helper function for admin statistics
const getAdminStats = async () => {
    const [
        totalFarmers,
        totalCrops,
        farmersByLocation,
        recentRegistrations
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'FARMER' } }),
        prisma.crop.count(),
        prisma.profile.groupBy({
            by: ['location'],
            where: { location: { not: null } },
            _count: { location: true }
        }),
        prisma.user.findMany({
            where: { role: 'FARMER' },
            include: { profile: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                email: true,
                createdAt: true,
                profile: {
                    select: {
                        fullName: true,
                        location: true
                    }
                }
            }
        })
    ]);

    return {
        totalFarmers,
        totalCrops,
        farmersByLocation,
        recentRegistrations
    };
};
