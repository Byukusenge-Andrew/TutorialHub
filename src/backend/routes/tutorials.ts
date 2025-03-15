import { Router } from 'express';
import TutorialController from '../controllers/TutorialController';
import { protect } from '../middleware/auth';

const router = Router();

// Get user progress
router.get('/progress', protect, TutorialController.getUserProgress);

// Create tutorial
router.post('/create', protect, TutorialController.createTutorial);

// Get all tutorials
router.get('/getall', TutorialController.getTutorials);

// Get, update, delete specific tutorial
router.route('/:id')
  .get(TutorialController.getTutorial)
  .patch(protect, TutorialController.updateTutorial)
  .delete(protect, TutorialController.deleteTutorial);

export default router; 