import express from 'express';
import { registerUser, loginUser, getMe, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// Simple endpoint to clear the cookie
router.get('/logout', logoutUser);

// Protect all routes below this middleware
router.get('/me', protect, getMe);

export default router;