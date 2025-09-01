import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, getUserCount } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin middleware to all routes
router.use(protect);
router.use(admin); // Makes the entire route admin-only

router.route('/').get(getUsers);
router.route('/stats/count').get(getUserCount);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;