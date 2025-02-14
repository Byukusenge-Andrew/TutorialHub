import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import TypingStats from '../models/TypingStats';
import DSAChallenge from '../models/DSAChallenge';
import Tutorial from '../models/Tutorial';
import Progress from '../models/Progress';
import Post from '../models/Post';

class DashboardController {
  getStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    // Get typing stats
    const typingStats = await TypingStats.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          averageWPM: { $avg: '$wpm' },
          averageAccuracy: { $avg: '$accuracy' },
          totalTests: { $sum: 1 }
        }
      }
    ]);

    const recentTypingProgress = await TypingStats.find({ userId })
      .sort('-date')
      .limit(10)
      .select('wpm accuracy date');

    // Get DSA stats
    const dsaStats = await DSAChallenge.aggregate([
      {
        $unwind: '$submissions'
      },
      {
        $match: { 'submissions.userId': userId }
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          solvedChallenges: {
            $sum: { $cond: [{ $eq: ['$submissions.passed', true] }, 1, 0] }
          },
          byDifficulty: {
            $push: {
              difficulty: '$difficulty',
              passed: '$submissions.passed'
            }
          }
        }
      }
    ]);

    // Get tutorial progress
    const tutorialProgress = await Progress.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          totalTime: { $sum: '$timeSpent' }
        }
      }
    ]);

    const tutorialCategories = await Tutorial.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      typing: {
        averageWPM: typingStats[0]?.averageWPM || 0,
        averageAccuracy: typingStats[0]?.averageAccuracy || 0,
        totalTests: typingStats[0]?.totalTests || 0,
        recentProgress: recentTypingProgress.map(stat => ({
          date: stat.date,
          wpm: stat.wpm,
          accuracy: stat.accuracy
        }))
      },
      dsa: {
        totalAttempts: dsaStats[0]?.totalAttempts || 0,
        solvedChallenges: dsaStats[0]?.solvedChallenges || 0,
        successRate: dsaStats[0]
          ? (dsaStats[0].solvedChallenges / dsaStats[0].totalAttempts) * 100
          : 0,
        byDifficulty: {
          easy: dsaStats[0]?.byDifficulty.filter((d: { difficulty: string; passed: any; }) => d.difficulty === 'easy' && d.passed).length || 0,
          medium: dsaStats[0]?.byDifficulty.filter((d: { difficulty: string; passed: any; }) => d.difficulty === 'medium' && d.passed).length || 0,
          hard: dsaStats[0]?.byDifficulty.filter((d: { difficulty: string; passed: any; }) => d.difficulty === 'hard' && d.passed).length || 0
        }
      },
      tutorials: {
        completed: tutorialProgress[0]?.completed || 0,
        inProgress: tutorialProgress[0]?.inProgress || 0,
        totalTime: tutorialProgress[0]?.totalTime || 0,
        byCategory: tutorialCategories.map(cat => ({
          category: cat._id,
          count: cat.count
        }))
      }
    });
  });

  getStudentStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    const [tutorials, typing, dsa, community] = await Promise.all([
      // Get tutorial stats
      Progress.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
            },
            totalTime: { $sum: '$timeSpent' }
          }
        }
      ]),

      // Get typing stats
      TypingStats.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            avgWpm: { $avg: '$wpm' },
            avgAccuracy: { $avg: '$accuracy' },
            bestWpm: { $max: '$wpm' },
            totalTests: { $sum: 1 }
          }
        }
      ]),

      // Get DSA stats
      DSAChallenge.aggregate([
        { $unwind: '$submissions' },
        { $match: { 'submissions.userId': userId } },
        {
          $group: {
            _id: null,
            solved: {
              $sum: { $cond: [{ $eq: ['$submissions.passed', true] }, 1, 0] }
            },
            totalAttempted: { $sum: 1 }
          }
        }
      ]),

      // Get community stats
      Promise.all([
        Post.find({ authorId: userId }).countDocuments(),
        Post.aggregate([
          { $match: { 'comments.authorId': userId } },
          { $unwind: '$comments' },
          { $match: { 'comments.authorId': userId } },
          { $count: 'count' }
        ]),
        Post.find({ authorId: userId })
          .sort('-createdAt')
          .limit(5)
          .populate('authorId', 'name')
          .lean()
      ])
    ]);

    const recentActivity = await Post.aggregate([
      {
        $match: {
          $or: [
            { authorId: userId },
            { 'comments.authorId': userId }
          ]
        }
      },
      {
        $project: {
          type: { $cond: [{ $eq: ['$authorId', userId] }, 'post', 'comment'] },
          title: '$title',
          date: '$createdAt'
        }
      },
      { $sort: { date: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      status: 'success',
      data: {
        tutorials: tutorials[0] || { completed: 0, inProgress: 0, totalTime: 0 },
        typing: typing[0] || { avgWpm: 0, avgAccuracy: 0, bestWpm: 0, totalTests: 0 },
        dsa: {
          solved: dsa[0]?.solved || 0,
          totalAttempted: dsa[0]?.totalAttempted || 0,
          successRate: dsa[0] ? (dsa[0].solved / dsa[0].totalAttempted) * 100 : 0
        },
        community: {
          posts: community[0] || 0,
          comments: community[1]?.[0]?.count || 0,
          recentActivity: recentActivity.map(activity => ({
            type: activity.type,
            title: activity.title,
            date: activity.date
          }))
        }
      }
    });
  });
}

export default new DashboardController(); 