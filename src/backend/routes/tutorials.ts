import { Router } from 'express';
import TutorialController from '../controllers/TutorialController';
import { protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(TutorialController.getTutorials)


router
  .route('/:id')
  .get(TutorialController.getTutorial)
  .patch(protect, TutorialController.updateTutorial)
  .delete(protect, TutorialController.deleteTutorial);

router
  .route('/create')
  .post(protect, TutorialController.createTutorial);

export default router; 