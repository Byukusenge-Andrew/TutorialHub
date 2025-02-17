import { Router } from 'express';
import DSAChallengeController from '../controllers/DSAChallengeController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/challenges', DSAChallengeController.getChallenges);
router.post('/challengescreate', protect, DSAChallengeController.createChallenge);
router.get('/challenges/:id', DSAChallengeController.getChallenge);
router.post('/challenges/:id/submit', protect, DSAChallengeController.submitSolution);

export default router; 