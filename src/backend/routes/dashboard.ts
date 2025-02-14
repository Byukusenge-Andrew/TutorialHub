import { Router } from 'express';
import { protect } from '../middleware/auth';
import DashboardController from '../controllers/DashboardController';

const router = Router();

router.get('/stats', protect, DashboardController.getStats);
router.get('/student-stats', protect, DashboardController.getStudentStats);

export default router; 