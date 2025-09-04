import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/index.js';

// Generate JWT and set it in an HTTP-Only cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};

// Authenticate user and Get Token .Public Route
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Find user by email and include their profile data
    const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
    });

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
        // Prepare user response data
        const userResponse = {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            profile: user.profile
        };

        // Generate token and set cookie
        const token = generateToken(res, user.id);

        res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token: token
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Here we will just register a new farmer Admin is already pre-seeded
// POST /api/auth/register
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

    // Generate Token and respond
    const token = generateToken(res, newUser.id);

    res.status(201).json({
        message: 'User created successfully',
        user: userResponse,
        token: token
    });
});

// @desc    get me details
// @route   GET /api/auth/me
// @access  PRIVATE
export const getMe = asyncHandler(async (req, res) => {
    try {
        // req.user is set by the auth middleware
        const userWithProfile = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                profile: true,
            },
        });


        res.status(200).json(userWithProfile);
    } catch (error) {
        console.error(error);
        throw new Error('Error Ocurred retrieve get me details');
    }
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Error logging out", error);
        throw new Error('Error Ocurred when logging out');
    }
});