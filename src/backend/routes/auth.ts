import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/validate', protect, AuthController.validate);

export default router; 