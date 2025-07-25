import { Router } from 'express';
import TutorialController from '../controllers/TutorialController';

const router = Router();

router.get('/categories', TutorialController.getCategories.bind(TutorialController));
router.get('/:id', TutorialController.getTutorial.bind(TutorialController));

export default router;