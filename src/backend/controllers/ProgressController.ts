import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ProgressService from '../services/ProgressService';
import { catchAsync } from '../utils/catchAsync';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';

export class ProgressController {
  getProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const progress = await ProgressService.getProgress(
      req.user.id,
      req.params.tutorialId
    );
    
    res.status(200).json({
      status: 'success',
      data: { progress }
    });
  });

  getAllProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const progress = await ProgressService.getAllUserProgress(req.user.id);
    
    res.status(200).json({
      status: 'success',
      results: progress.length,
      data: { progress }
    });
  });

  updateProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Invalid request data', 400);
    }

    const progress = await ProgressService.updateProgress(
      req.user.id,
      req.params.tutorialId,
      req.body.completedSection
    );
    
    res.status(200).json({
      status: 'success',
      data: { progress }
    });
  });

  resetProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const progress = await ProgressService.resetProgress(
      req.user.id,
      req.params.tutorialId
    );
    
    res.status(200).json({
      status: 'success',
      data: { progress }
    });
  });
}

export default new ProgressController();