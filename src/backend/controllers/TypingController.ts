import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TypingRecord from '../models/TypingRecord';
import { catchAsync } from '../utils/catchAsync';
import mongoose from 'mongoose';
import TypingStats from '../models/TypingStats';

class TypingController {
  saveRecord = catchAsync(async (req: AuthRequest, res: Response) => {
    try {
      const { wpm, accuracy, duration } = req.body;
      
      if (!req.user?._id) {
        throw new Error('User not authenticated');
      }
      if (!wpm || !accuracy || !duration) {
        throw new Error('Missing required fields');
      }

      // Calculate score based on WPM and accuracy
      const score = Math.round(wpm * (accuracy / 100));
      
      console.log('Saving typing record:', { 
        userId: req.user._id, 
        wpm, 
        accuracy, 
        score, 
        duration 
      });

      const record = await TypingRecord.create({
        userId: req.user._id,
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        score,
        duration,
        date: new Date()
      });

      console.log('Saved record:', record);

      res.status(201).json({
        status: 'success',
        data: record
      });
    } catch (error) {
      console.error('Error saving typing record:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save typing record'
      });
    }
  });

  saveResult = catchAsync(async (req: AuthRequest, res: Response) => {
    try {
      const { wpm, accuracy, duration, characters, errors } = req.body;
      
      if (!req.user?._id) {
        throw new Error('User not authenticated');
      }

      if (!wpm || !accuracy || !duration || !characters || errors === undefined) {
        throw new Error('Missing required fields');
      }

      // Save to stats collection
      const stats = await TypingStats.create({
        userId: req.user._id,
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        duration,
        characters,
        errors,
        date: new Date()
      });

      console.log('Saved typing stats:', stats);

      res.status(201).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Error saving typing stats:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save typing stats'
      });
    }
  });

  getHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
      throw new Error('User not authenticated');
    }

    console.log('Getting history for user:', req.user._id);

    const userId = typeof req.user._id === 'string'
      ? new mongoose.Types.ObjectId(req.user._id)
      : req.user._id;

    // Get user's typing history with score and WPM
    const history = await TypingRecord.find({ userId })
      .select('wpm accuracy score date duration')
      .sort({ date: -1 })
      .limit(10)
      .lean();

    console.log('Found history records:', history);

    // Get user's detailed stats
    const stats = await TypingRecord.aggregate([
      { 
        $match: { userId } 
      },
      {
        $group: {
          _id: null,
          bestScore: { $max: '$score' },
          bestWpm: { $max: '$wpm' },
          bestAccuracy: { $max: '$accuracy' },
          totalTests: { $sum: 1 },
          avgAccuracy: { $avg: '$accuracy' },
          avgWpm: { $avg: '$wpm' },
          totalTime: { $sum: '$duration' }
        }
      },
      {
        $project: {
          _id: 0,
          bestScore: { $round: ['$bestScore', 0] },
          bestWpm: { $round: ['$bestWpm', 0] },
          bestAccuracy: { $round: ['$bestAccuracy', 0] },
          totalTests: 1,
          avgAccuracy: { $round: ['$avgAccuracy', 0] },
          avgWpm: { $round: ['$avgWpm', 0] },
          totalTime: 1
        }
      }
    ]);

    console.log('Aggregated stats:', stats);

    res.json({
      status: 'success',
      data: {
        history: history.map(record => ({
          wpm: Math.round(record.wpm),
          accuracy: Math.round(record.accuracy),
          score: Math.round(record.score),
          date: record.date,
          duration: record.duration
        })),
        stats: stats[0] || {
          bestScore: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          totalTests: 0,
          avgAccuracy: 0,
          avgWpm: 0,
          totalTime: 0
        }
      }
    });
  });

  getLeaderboard = catchAsync(async (_req: Request, res: Response) => {
    const leaderboard = await TypingRecord.aggregate([
      // Group by user and get their best scores and stats
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          bestWpm: { $max: '$wpm' },
          avgScore: { $avg: '$score' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 },
          recentScore: { 
            $max: {
              $cond: [
                { $gt: ['$date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                '$score',
                0
              ]
            }
          }
        }
      },
      // Sort by best score descending (primary sort)
      { 
        $sort: { 
          bestScore: -1,
          avgScore: -1 
        } 
      },
      { $limit: 10 },
      // Lookup user details
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      // Format the output
      {
        $project: {
          _id: 1,
          username: { $arrayElemAt: ['$user.name', 0] },
          bestScore: { $round: ['$bestScore', 0] },
          bestWpm: { $round: ['$bestWpm', 0] },
          avgScore: { $round: ['$avgScore', 0] },
          avgAccuracy: { $round: ['$avgAccuracy', 0] },
          totalTests: 1,
          recentScore: { $round: ['$recentScore', 0] }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: leaderboard
    });
  });
}

export default new TypingController(); 