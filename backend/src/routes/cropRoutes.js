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

// All crop routes are protected (require login)
router.use(protect);

router.route('/').get(getCrops).post(createCrop);
router.route('/stats/summary').get(getCropStats);
router.route('/:id').get(getCropById).put(updateCrop).delete(deleteCrop);

export default router;