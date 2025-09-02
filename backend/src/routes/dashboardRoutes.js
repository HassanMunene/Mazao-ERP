import express from 'express';
import {
    getDashboardStats,
    getCropDistribution,
    getRecentActivity,
    getFarmersByRegion,
    getSystemOverview
} from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/crops/distribution', getCropDistribution);
router.get('/activity/recent', getRecentActivity);
router.get('/farmers/regions', getFarmersByRegion);
router.get('/overview', getSystemOverview);

export default router;