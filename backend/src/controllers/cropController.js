import asyncHandler from 'express-async-handler';
import prisma from '../prisma/index.js';

// @desc    Get crops (all for admin, user's crops for farmer)
// @route   GET /api/crops
// @access  Private
export const getCrops = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type; // Filter by crop type
        const status = req.query.status; // Filter by status
        const farmerId = req.query.farmerId; // Filter by farmer (admin only)
        const skip = (page - 1) * limit;

        // Build where clause based on user role
        let whereClause = {};

        if (req.user.role === 'FARMER') {
            // Farmers can only see their own crops
            whereClause.farmerId = req.user.id;
        } else if (req.user.role === 'ADMIN' && farmerId) {
            // Admin can filter by specific farmer
            whereClause.farmerId = farmerId;
        }

        // Apply filters
        if (type) {
            whereClause.type = type;
        }

        if (status) {
            whereClause.status = status;
        }

        // Get crops with pagination
        const [crops, totalCrops] = await Promise.all([
            prisma.crop.findMany({
                where: whereClause,
                include: {
                    farmer: {
                        include: {
                            profile: {
                                select: {
                                    fullName: true,
                                    location: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit
            }),
            prisma.crop.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalCrops / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: {
                crops,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCrops,
                    hasNextPage,
                    hasPrevPage,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get crops error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching crops'
        });
    }
});

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
export const getCropById = asyncHandler(async (req, res) => {
    try {
        const cropId = req.params.id;

        const crop = await prisma.crop.findUnique({
            where: { id: cropId },
            include: {
                farmer: {
                    include: {
                        profile: {
                            select: {
                                fullName: true,
                                location: true,
                                contactInfo: true
                            }
                        }
                    }
                }
            }
        });

        if (!crop) {
            res.status(404);
            throw new Error('Crop not found');
        }

        // Check authorization: Farmers can only access their own crops
        if (req.user.role === 'FARMER' && crop.farmerId !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to access this crop');
        }

        res.status(200).json({
            success: true,
            data: crop
        });

    } catch (error) {
        console.error('Get crop by ID error:', error);

        if (error.message === 'Crop not found') {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else if (error.message === 'Not authorized to access this crop') {
            res.status(403).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching crop'
            });
        }
    }
});

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
export const createCrop = asyncHandler(async (req, res) => {
    try {
        const { name, type, quantity, plantingDate, harvestDate, description } = req.body;

        // Validation
        if (!name || !type || !quantity || !plantingDate) {
            res.status(400);
            throw new Error('Name, type, quantity, and planting date are required');
        }

        if (!Object.values(prisma.CropType).includes(type)) {
            res.status(400);
            throw new Error('Invalid crop type');
        }

        if (quantity <= 0) {
            res.status(400);
            throw new Error('Quantity must be greater than 0');
        }

        // Set farmer ID based on user role
        const farmerId = req.user.role === 'ADMIN' && req.body.farmerId
            ? req.body.farmerId
            : req.user.id;

        // Verify farmer exists if admin is specifying farmerId
        if (req.user.role === 'ADMIN' && req.body.farmerId) {
            const farmer = await prisma.user.findUnique({
                where: { id: farmerId, role: 'FARMER' }
            });

            if (!farmer) {
                res.status(400);
                throw new Error('Farmer not found or not a farmer account');
            }
        }

        const crop = await prisma.crop.create({
            data: {
                name,
                type,
                quantity: parseInt(quantity),
                plantingDate: new Date(plantingDate),
                harvestDate: harvestDate ? new Date(harvestDate) : null,
                description,
                farmerId: farmerId
            },
            include: {
                farmer: {
                    include: {
                        profile: {
                            select: {
                                fullName: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Crop created successfully',
            data: crop
        });

    } catch (error) {
        console.error('Create crop error:', error);

        if (error.message.includes('required') || error.message.includes('Invalid') || error.message.includes('Quantity')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while creating crop'
            });
        }
    }
});

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
export const updateCrop = asyncHandler(async (req, res) => {
    try {
        const cropId = req.params.id;
        const { name, type, quantity, plantingDate, harvestDate, description, status } = req.body;

        // Check if crop exists
        const existingCrop = await prisma.crop.findUnique({
            where: { id: cropId },
            include: {
                farmer: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!existingCrop) {
            res.status(404);
            throw new Error('Crop not found');
        }

        // Check authorization: Farmers can only update their own crops
        if (req.user.role === 'FARMER' && existingCrop.farmerId !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to update this crop');
        }

        // Validate crop type if provided
        if (type && !Object.values(prisma.CropType).includes(type)) {
            res.status(400);
            throw new Error('Invalid crop type');
        }

        // Validate quantity if provided
        if (quantity && quantity <= 0) {
            res.status(400);
            throw new Error('Quantity must be greater than 0');
        }

        // Validate status if provided
        if (status && !Object.values(prisma.CropStatus).includes(status)) {
            res.status(400);
            throw new Error('Invalid crop status');
        }

        const updatedCrop = await prisma.crop.update({
            where: { id: cropId },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(quantity && { quantity: parseInt(quantity) }),
                ...(plantingDate && { plantingDate: new Date(plantingDate) }),
                ...(harvestDate !== undefined && {
                    harvestDate: harvestDate ? new Date(harvestDate) : null
                }),
                ...(description !== undefined && { description }),
                ...(status && { status })
            },
            include: {
                farmer: {
                    include: {
                        profile: {
                            select: {
                                fullName: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Crop updated successfully',
            data: updatedCrop
        });

    } catch (error) {
        console.error('Update crop error:', error);

        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Crop not found'
            });
        } else if (error.message.includes('Not authorized')) {
            res.status(403).json({
                success: false,
                message: error.message
            });
        } else if (error.message.includes('Invalid') || error.message.includes('Quantity')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while updating crop'
            });
        }
    }
});

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
export const deleteCrop = asyncHandler(async (req, res) => {
    try {
        const cropId = req.params.id;

        // Check if crop exists
        const existingCrop = await prisma.crop.findUnique({
            where: { id: cropId }
        });

        if (!existingCrop) {
            res.status(404);
            throw new Error('Crop not found');
        }

        // Check authorization: Farmers can only delete their own crops
        if (req.user.role === 'FARMER' && existingCrop.farmerId !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to delete this crop');
        }

        await prisma.crop.delete({
            where: { id: cropId }
        });

        res.status(200).json({
            success: true,
            message: 'Crop deleted successfully'
        });

    } catch (error) {
        console.error('Delete crop error:', error);

        if (error.message === 'Crop not found') {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else if (error.message === 'Not authorized to delete this crop') {
            res.status(403).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while deleting crop'
            });
        }
    }
});

// @desc    Get crop statistics for charts
// @route   GET /api/crops/stats/summary
// @access  Private
export const getCropStats = asyncHandler(async (req, res) => {
    try {
        let whereClause = {};

        // Farmers can only see their own stats
        if (req.user.role === 'FARMER') {
            whereClause.farmerId = req.user.id;
        }

        const [
            totalCrops,
            cropsByType,
            cropsByStatus,
            cropsPerFarmer,
            recentCrops
        ] = await Promise.all([
            // Total crops count
            prisma.crop.count({ where: whereClause }),

            // Crops grouped by type
            prisma.crop.groupBy({
                by: ['type'],
                where: whereClause,
                _count: { type: true },
                _sum: { quantity: true }
            }),

            // Crops grouped by status
            prisma.crop.groupBy({
                by: ['status'],
                where: whereClause,
                _count: { status: true }
            }),

            // Crops per farmer (admin only)
            req.user.role === 'ADMIN' ? prisma.crop.groupBy({
                by: ['farmerId'],
                where: whereClause,
                _count: { farmerId: true },
                _sum: { quantity: true }
            }) : Promise.resolve([]),

            // Recent crops
            prisma.crop.findMany({
                where: whereClause,
                include: {
                    farmer: {
                        include: {
                            profile: {
                                select: {
                                    fullName: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            })
        ]);

        // Format data for charts
        const chartData = {
            byType: cropsByType.map(item => ({
                type: item.type,
                count: item._count.type,
                totalQuantity: item._sum.quantity
            })),
            byStatus: cropsByStatus.map(item => ({
                status: item.status,
                count: item._count.status
            })),
            byFarmer: cropsPerFarmer.map(item => ({
                farmerId: item.farmerId,
                count: item._count.farmerId,
                totalQuantity: item._sum.quantity
            }))
        };

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalCrops,
                    totalQuantity: cropsByType.reduce((sum, item) => sum + (item._sum.quantity || 0), 0)
                },
                charts: chartData,
                recentCrops
            }
        });

    } catch (error) {
        console.error('Get crop stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching crop statistics'
        });
    }
});
