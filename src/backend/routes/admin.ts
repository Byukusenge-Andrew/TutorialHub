import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { protect } from '../middleware/auth';

const router = Router();

// Remove the incorrect route
// router.get('/admin/stat', DashboardController.getStats);

// Make sure the stats route is properly defined
router.get('/stats', protect, AdminController.getStats);
router.get('/users', protect, AdminController.getUsers);
router.get('/analytics', protect, AdminController.getAnalytics);

export default router; 