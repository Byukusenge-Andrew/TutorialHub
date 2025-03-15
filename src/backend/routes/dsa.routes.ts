import { Router } from 'express';
import { protect } from '../middleware/auth';
import { validateSubmission } from '../middleware/validate';
import { DSAExerciseController } from '../controllers/DSAExerciseController';

const router = Router();

router.get('/exercises', protect, DSAExerciseController.getExercises);
router.get('/exercises/:id', DSAExerciseController.getExercise);
router.post('/exercises', protect, DSAExerciseController.createExercise);
router.post('/exercises/:id/submit', protect, validateSubmission, DSAExerciseController.submitSolution);
router.get('/user-stats', protect, DSAExerciseController.getUserStats);
router.post('/test', protect, DSAExerciseController.testSolution);

export default router; 