import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import PasswordController from '../controllers/PasswordController';
import VerificationController from '../controllers/VerificationController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/validate', protect, AuthController.validate);

// Password reset routes
router.post('/forgot-password', PasswordController.forgotPassword);
router.post('/reset-password', PasswordController.resetPassword);

// Email verification routes
router.get('/verify-email/:token', VerificationController.verifyEmail);
router.post('/resend-verification', VerificationController.resendVerificationEmail);

export default router; 