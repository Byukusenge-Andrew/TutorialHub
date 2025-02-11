import { Router } from 'express';
import { body } from 'express-validator';
import ProgressController from '../controllers/ProgressController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect as any); // Type assertion to fix Express middleware type issue

router.get('/', ProgressController.getAllProgress);

router
  .route('/:tutorialId')
  .get(ProgressController.getProgress)
  .post([
    body('completedSection').notEmpty().withMessage('Section ID is required'),
  ], ProgressController.updateProgress)
  .delete(ProgressController.resetProgress);

export default router;