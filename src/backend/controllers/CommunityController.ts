import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Post from '../models/Post';
import { catchAsync } from '../utils/catchAsync';

class CommunityController {
  getPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await Post.find().populate('authorId', 'name').sort('-createdAt');
    res.json(posts);
  });

  getPost = catchAsync(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id).populate('authorId', 'name');
    res.json(post);
  });

  createPost = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.create({
      ...req.body,
      authorId: req.user.id
    });
    res.status(201).json(post);
  });

  addComment = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            content: req.body.content,
            authorId: req.user.id
          }
        }
      },
      { new: true }
    );
    res.json(post);
  });

  likePost = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(post);
  });
}

export default new CommunityController(); 