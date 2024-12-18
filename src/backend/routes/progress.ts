import { Router } from 'express';
import ProgressController from '../controllers/ProgressController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', ProgressController.getAllProgress);

router
  .route('/:tutorialId')
  .get(ProgressController.getProgress)
  .post(ProgressController.updateProgress)
  .delete(ProgressController.resetProgress);

export default router; 