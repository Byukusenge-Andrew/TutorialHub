import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TypingStats from '../models/TypingStats';
import { catchAsync } from '../utils/catchAsync';

class TypingStatsController {
  saveResult = catchAsync(async (req: AuthRequest, res: Response) => {
    try {
      const { wpm, accuracy, duration, characters, errors } = req.body;
      
      // Validate input
      if (!wpm || !accuracy || !duration) {
        throw new Error('Missing required fields');
      }

      const stats = await TypingStats.create({
        userId: req.user._id,
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy * 100) / 100,
        duration,
        characters,
        errors,
        date: new Date()
      });

      res.status(201).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Error saving typing result:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save typing result'
      });
    }
  });

  getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    const [recentTests, dailyProgress, overallStats] = await Promise.all([
      // Get recent tests
      TypingStats.find({ userId })
        .sort('-date')
        .limit(10)
        .select('wpm accuracy date'),

      // Get daily progress
      TypingStats.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
            tests: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]),

      // Get overall stats
      TypingStats.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
            bestWpm: { $max: '$wpm' },
            totalTests: { $sum: 1 },
            totalTime: { $sum: '$duration' }
          }
        }
      ])
    ]);

    res.json({
      status: 'success',
      data: {
        recentTests,
        dailyProgress,
        overall: overallStats[0] || {
          avgWpm: 0,
          avgAccuracy: 0,
          bestWpm: 0,
          totalTests: 0,
          totalTime: 0
        }
      }
    });
  });

  getUserStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const stats = await TypingStats.find({ userId: req.user.id })
      .sort('-date')
      .limit(10);

    const averageStats = await TypingStats.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 }
        }
      }
    ]);

    res.json({
      recentTests: stats,
      averages: averageStats[0] || { avgWpm: 0, avgAccuracy: 0, totalTests: 0 }
    });
  });

  getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const leaderboard = await TypingStats.aggregate([
      {
        $group: {
          _id: '$userId',
          score: {
            $max: {
              $multiply: [
                '$wpm',
                { $divide: ['$accuracy', 100] }
              ]
            }
          },
          bestWpm: { $max: '$wpm' },
          avgWpm: { $avg: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 },
          recentScore: { 
            $max: {
              $cond: [
                { $gt: ['$date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                {
                  $multiply: [
                    '$wpm',
                    { $divide: ['$accuracy', 100] }
                  ]
                },
                0
              ]
            }
          }
        }
      },
      // Sort primarily by score, then by other metrics
      { 
        $sort: { 
          score: -1,
          bestWpm: -1,
          avgAccuracy: -1
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
          score: { $round: ['$score', 0] },
          bestWpm: { $round: ['$bestWpm', 0] },
          avgWpm: { $round: ['$avgWpm', 0] },
          avgAccuracy: { $round: ['$avgAccuracy', 1] },
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

  getAdminStats = catchAsync(async (req: Request, res: Response) => {
    const [dailyStats, overallStats] = await Promise.all([
      TypingStats.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            avgWpm: { $avg: '$wpm' },
            totalTests: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]),
      TypingStats.aggregate([
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
            totalTests: { $sum: 1 },
            activeUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            avgWpm: 1,
            avgAccuracy: 1,
            totalTests: 1,
            activeUsers: { $size: '$activeUsers' }
          }
        }
      ])
    ]);

    res.json({
      dailyStats,
      overallStats: overallStats[0]
    });
  });

  getUserHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    try {
      // Get last 20 typing tests
      const history = await TypingStats.find({ userId: req.user._id })
        .sort('-date')
        .limit(20)
        .select('wpm accuracy duration date')
        .lean();

      // Get aggregate stats
      const stats = await TypingStats.aggregate([
        { $match: { userId: req.user._id } },
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
            bestWpm: { $max: '$wpm' },
            totalTests: { $sum: 1 }
          }
        }
      ]);

      // Format response
      res.status(200).json({
        status: 'success',
        data: {
          history: history.map(test => ({
            wpm: Math.round(test.wpm),
            accuracy: Math.round(test.accuracy * 100) / 100,
            duration: test.duration,
            date: test.date
          })),
          stats: stats[0] || {
            avgWpm: 0,
            avgAccuracy: 0,
            bestWpm: 0,
            totalTests: 0
          }
        }
      });
    } catch (error) {
      console.error('Error fetching user history:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch typing history'
      });
    }
  });
}

export default new TypingStatsController(); 