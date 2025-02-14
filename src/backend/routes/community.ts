import { Router } from 'express';
import { protect } from '../middleware/auth';
import CommunityController from '../controllers/CommunityController';

const router = Router();

router.get('/posts', protect, CommunityController.getPosts);
router.get('/posts/:id', protect, CommunityController.getPost);
router.post('/posts', protect, CommunityController.createPost);
router.post('/posts/:id/comments', protect, CommunityController.addComment);
router.post('/posts/:id/like', protect, CommunityController.likePost);

export default router; 