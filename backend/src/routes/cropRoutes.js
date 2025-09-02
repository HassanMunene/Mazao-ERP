import express from 'express';
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropStats,
} from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication protection to all crop routes
router.use(protect);

// GET /api/crops - Get paginated list of crops with filtering options (type, status, farmerId for admins)
router.get('/', getCrops);

// POST /api/crops - Create a new crop (farmers create their own, admins can create for any farmer)
router.post('/', createCrop);

// GET /api/crops/stats/summary - Get comprehensive crop statistics for dashboards and charts
router.get('/stats/summary', getCropStats);

// GET /api/crops/:id - Get specific crop details by ID with farmer information
router.get('/:id', getCropById);

// PUT /api/crops/:id - Update an existing crop (farmers can only update their own crops)
router.put('/:id', updateCrop);

// DELETE /api/crops/:id - Delete a crop (farmers can only delete their own crops)
router.delete('/:id', deleteCrop);

export default router;