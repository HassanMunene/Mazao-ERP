import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/index.js';

export const loginUser = asyncHandler(async (req, res) => {
    /* TODO: Implement login logic */
    res.json({ message: 'Login endpoint' });
});

// Here we will just register a new farmer Admin is already pre-seeded
export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullName, location, contactInfo } = req.body;

    // 1. Validation
    if (!email || !password || !fullName) {
        res.status(400);
        throw new Error('Please include email, password, and full name');
    }

    // 2. Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User and Profile in a transaction (ATOMIC)
    const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'FARMER', // This is the default role.
            },
        });

        const profile = await tx.profile.create({
            data: {
                fullName,
                location,
                contactInfo,
                user: { connect: { id: user.id } },
            },
        });

        // Return user data without password and with profile
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            profile: profile,
        };
    });

    // 5. Generate Token and respond
    generateToken(res, newUser.id);
    res.status(201).json(newUser);
});

// Generate JWT and set it in an HTTP-Only cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
});