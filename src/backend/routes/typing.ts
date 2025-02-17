import { Router } from 'express';
import { protect } from '../middleware/auth';
import TypingStatsController from '../controllers/TypingStatsController';
import TypingController from '../controllers/TypingController';

const router = Router();

router.post('/results', protect, TypingStatsController.saveResult);
router.post('/saveRecord',protect, TypingController.saveRecord)

router.get('/history', protect, TypingController.getHistory);
router.get('/leaderboard', TypingStatsController.getLeaderboard);
router.get('/admin/stats', protect, TypingStatsController.getAdminStats);

export default router; 