import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import DSAChallenge from '../models/DSAChallenge';
import { CodeExecutionService } from '../services/CodeExecutionService';
import { catchAsync } from '../utils/catchAsync';

class DSAChallengeController {
  getChallenges = catchAsync(async (req: Request, res: Response) => {
    const { difficulty, category, tag } = req.query;
    const query: Record<string, unknown> = {};

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const challenges = await DSAChallenge.find(query)
      .select('-testCases.output -submissions')
      .populate('authorId', 'name')
      .sort('-createdAt');

    res.json({
      status: 'success',
      data: challenges
    });
  });

  getChallenge = catchAsync(async (req: Request, res: Response) => {
    const challenge = await DSAChallenge.findById(req.params.id)
      .populate('authorId', 'name')
      .populate('submissions.userId', 'name');

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found'
      });
    }

    // Only show non-hidden test cases to users
    const visibleTestCases = challenge.testCases.filter(tc => !tc.isHidden);

    res.json({
      status: 'success',
      data: {
        ...challenge.toObject(),
        testCases: visibleTestCases
      }
    });
  });

  submitSolution = catchAsync(async (req: AuthRequest, res: Response) => {
    const { code, language } = req.body;
    const challenge = await DSAChallenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found'
      });
    }

    const result = await CodeExecutionService.executeCode(
      code as string,
      language as string,
      challenge.testCases
    );

    // Update challenge statistics
    challenge.totalSubmissions += 1;
    if (result.passed) {
      challenge.successfulSubmissions += 1;
    }
    challenge.successRate = (challenge.successfulSubmissions / challenge.totalSubmissions) * 100;

    // Record submission
    challenge.submissions.push({
      userId: req.user?._id || req.user?.id,
      code: code as string,
      language: language as string,
      ...result,
      createdAt: new Date()
    });

    await challenge.save();

    res.json({
      status: 'success',
      data: result
    });
  });

  createChallenge = catchAsync(async (req: AuthRequest, res: Response) => {
    const challenge = await DSAChallenge.create({
      ...req.body,
      authorId: req.user?._id || req.user?.id
    });

    res.status(201).json({
      status: 'success',
      data: challenge
    });
  });
}

export default new DSAChallengeController(); 