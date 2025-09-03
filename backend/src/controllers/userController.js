import asyncHandler from 'express-async-handler';
import prisma from '../prisma/index.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users with pagination and filtering
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role;
        const search = req.query.search;
        const skip = (page - 1) * limit;

        // Build where clause for filtering
        let whereClause = {};

        if (role) {
            whereClause.role = role;
        }

        if (search) {
            whereClause.OR = [
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    profile: {
                        fullName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            ];
        }

        // Get users with pagination and include profiles
        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: true,
                    _count: {
                        select: {
                            crops: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit
            }),
            prisma.user.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalUsers / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNextPage,
                    hasPrevPage,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
});

// @desc    Get all farmers with pagination (Admin only)
// @route   GET /api/users/farmers
// @access  Private/Admin
export const getFarmers = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const search = req.query.search;
        const skip = (page - 1) * limit;

        // Build where clause for filtering Only get farmers
        let whereClause = {
            role: 'FARMER'
        };

        if (search) {
            whereClause.OR = [
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    profile: {
                        fullName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            ];
        }

        // Get farmers with pagination
        const [farmers, totalFarmers] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: true,
                    _count: {
                        select: {
                            crops: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit
            }),
            prisma.user.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalFarmers / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: {
                farmers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalFarmers,
                    hasNextPage,
                    hasPrevPage,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get farmers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching farmers'
        });
    }
});


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                profile: true,
                crops: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        farmer: {
                            select: {
                                id: true,
                                email: true,
                                profile: {
                                    select: { fullName: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);

        if (error.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while fetching user'
            });
        }
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, role, fullName, location, contactInfo } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });

        if (!existingUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // Validate email uniqueness if email is being updated
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
                select: { id: true }
            });

            if (emailExists) {
                res.status(400);
                throw new Error('Email already exists');
            }
        }

        // Validate role
        if (role && !['ADMIN', 'FARMER'].includes(role)) {
            res.status(400);
            throw new Error('Invalid role. Must be ADMIN or FARMER');
        }

        // Update user and profile in transaction
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Update user
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    ...(email && { email }),
                    ...(role && { role })
                }
            });

            // Update or create profile
            let profileData = {};
            if (fullName !== undefined) profileData.fullName = fullName;
            if (location !== undefined) profileData.location = location;
            if (contactInfo !== undefined) profileData.contactInfo = contactInfo;

            const profile = await tx.profile.upsert({
                where: { userId: userId },
                update: profileData,
                create: {
                    userId: userId,
                    fullName: fullName || 'Unknown',
                    location: location || null,
                    contactInfo: contactInfo || null
                }
            });

            return { ...user, profile };
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: userWithoutPassword
        });

    } catch (error) {
        console.error('Update user error:', error);

        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        } else if (error.message.includes('Email already exists') || error.message.includes('Invalid role')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while updating user'
            });
        }
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true }
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Prevent admin from deleting themselves
        if (user.id === req.user.id) {
            res.status(400);
            throw new Error('Cannot delete your own account');
        }

        // Use transaction to ensure all related data is handled
        await prisma.$transaction(async (tx) => {
            // Delete user (this will cascade delete profile and crops due to schema relations)
            await tx.user.delete({
                where: { id: userId }
            });
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);

        if (error.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else if (error.message === 'Cannot delete your own account') {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while deleting user'
            });
        }
    }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/count
// @access  Private/Admin
export const getUserCount = asyncHandler(async (req, res) => {
    try {
        const [totalUsers, farmersCount, adminsCount, usersWithCrops] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'FARMER' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({
                where: {
                    crops: {
                        some: {}
                    }
                }
            })
        ]);

        const recentRegistrations = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                profile: {
                    select: {
                        fullName: true,
                        location: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                farmersCount,
                adminsCount,
                usersWithCrops,
                recentRegistrations
            }
        });

    } catch (error) {
        console.error('Get user count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user statistics'
        });
    }
});


// @desc    Create a new farmer (Admin only)
// @route   POST /api/users/farmers/new
// @access  Private/Admin
export const createFarmer = asyncHandler(async (req, res) => {
    try {
        const { email, password, fullName, location, contactInfo } = req.body;

        // Validation
        if (!email || !password || !fullName) {
            res.status(400);
            throw new Error('Email, password, and full name are required');
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            res.status(400);
            throw new Error('Please enter a valid email address');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400);
            throw new Error('User already exists with this email');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user and profile in transaction
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'FARMER',
                },
            });

            const profile = await tx.profile.create({
                data: {
                    userId: user.id,
                    fullName,
                    location: location || null,
                    contactInfo: contactInfo || null,
                },
            });

            // Return user data without password
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                profile: profile
            };
        });

        res.status(201).json({
            success: true,
            message: 'Farmer created successfully',
            data: newUser
        });

    } catch (error) {
        console.error('Create farmer error:', error);

        if (error.message.includes('required') ||
            error.message.includes('valid') ||
            error.message.includes('already exists')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error while creating farmer'
            });
        }
    }
});
