import express from 'express';
import { getMyProfile, updateMyProfile, getDashboardStats } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All profile routes are protected and operate on the logged-in user's profile
router.use(protect);

router.route('/me').get(getMyProfile).put(updateMyProfile);
router.get('/stats', getDashboardStats);


export default router;