import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TypingRecord from '../models/TypingRecord';
import { catchAsync } from '../utils/catchAsync';

class TypingController {
  saveResult = catchAsync(async (req: AuthRequest, res: Response) => {
    const { wpm, accuracy, duration } = req.body;
    const score = Math.round((wpm * accuracy) / 100); // Calculate score based on speed and accuracy
    
    const record = await TypingRecord.create({
      userId: req.user?._id,
      wpm,
      accuracy,
      score,
      duration,
      date: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: record
    });
  });

  getHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const records = await TypingRecord.find({ userId: req.user?._id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const stats = await TypingRecord.aggregate([
      { $match: { userId: req.user?._id } },
      {
        $group: {
          _id: null,
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 },
          highScore: { $max: '$score' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        records,
        stats: stats[0] || {
          avgWpm: 0,
          avgAccuracy: 0,
          totalTests: 0,
          highScore: 0
        }
      }
    });
  });

  getLeaderboard = catchAsync(async (_req: Request, res: Response) => {
    const leaderboard = await TypingRecord.aggregate([
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      status: 'success',
      data: leaderboard
    });
  });
}

export default new TypingController(); 