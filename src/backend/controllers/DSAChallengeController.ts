import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import DSAChallengeService from '../services/DSAChallengeService';
import { catchAsync } from '../utils/catchAsync';

export class DSAChallengeController {
  getChallenges = catchAsync(async (req: Request, res: Response) => {
    const challenges = await DSAChallengeService.getChallenges();
    res.status(200).json({
      status: 'success',
      data: {
        challenges
      }
    });
  });

  getChallenge = catchAsync(async (req: Request, res: Response) => {
    const challenge = await DSAChallengeService.getChallengeById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: challenge
    });
  });

  createChallenge = catchAsync(async (req: AuthRequest, res: Response) => {
    const challenge = await DSAChallengeService.createChallenge({
      ...req.body,
      authorId: req.user.id
    });
    res.status(201).json({
      status: 'success',
      data: challenge
    });
  });

  submitSolution = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await DSAChallengeService.submitSolution(
      req.params.id,
      req.body.solution,
      req.user.id
    );
    res.status(200).json({
      status: 'success',
      data: result
    });
  });
}

export default new DSAChallengeController(); 