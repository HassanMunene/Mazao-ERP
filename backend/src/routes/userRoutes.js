import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, getUserCount, createFarmer } from '../controllers/userController.js';
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination and filtering
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/stats/count
// @desc    Get user statistics and counts
// @access  Private/Admin
router.get('/stats/count', protect, admin, getUserCount);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', protect, admin, getUserById);

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Private/Admin
router.put('/:id', protect, admin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

// @route   POST /api/users/farmers/new
// @desc    Add New Farmers
// @access  Private/Admin
router.post('/farmers/new', protect, admin, createFarmer);

export default router;