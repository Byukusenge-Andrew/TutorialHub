import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Post from '../models/Post';
import { catchAsync } from '../utils/catchAsync';

class CommunityController {
  getPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await Post.find()
      .populate('authorId', 'name')
      .sort('-createdAt')
      .lean();

    res.json({
      status: 'success',
      data: posts
    });
  });

  getPost = catchAsync(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name')
      .populate('comments.authorId', 'name')
      .lean();

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.json({
      status: 'success',
      data: post
    });
  });

  createPost = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.create({
      ...req.body,
      authorId: req.user._id
    });

    const populatedPost = await post.populate('authorId', 'name');

    res.status(201).json({
      status: 'success',
      data: populatedPost
    });
  });

  addComment = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            content: req.body.content,
            authorId: req.user._id,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('authorId', 'name')
     .populate('comments.authorId', 'name');

    res.json({
      status: 'success',
      data: post
    });
  });

  likePost = catchAsync(async (req: AuthRequest, res: Response) => {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('authorId', 'name');

    res.json({
      status: 'success',
      data: post
    });
  });
}

export default new CommunityController(); 