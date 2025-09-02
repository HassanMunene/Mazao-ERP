import jwt from 'jsonwebtoken';
import prisma from '../prisma/index.js';

export const protect = async (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach full user object to the request except password.
        req.user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, createdAt: true },
        });
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token Failed" });
    }


    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
};

