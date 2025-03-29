import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import User from '../models/User';
import Tutorial from '../models/Tutorial';
import Progress from '../models/Progress';
import { DSAExercise } from '../models/DSAExercise';
import Post from '../models/Post';
import TypingStats from '../models/TypingStats';
import mongoose from 'mongoose';

class AdminController {
  getStats = catchAsync(async (req: Request, res: Response) => {
    console.log('Fetching admin stats...');
    
    // Get counts in parallel for better performance
    const [totalUsers, totalTutorials, completionsData, activeUsersData, totalExercises] = await Promise.all([
      // Total Users
      User.countDocuments(),
      
      // Total Tutorials
      Tutorial.countDocuments(),
      
      // Total Completions
      Progress.aggregate([
        { $match: { progress: 100 } },
        { $count: 'total' }
      ]),
      
      // Active Users
      Progress.aggregate([
        { $match: { lastAccessedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: '$userId' } },
        { $count: 'total' }
      ]),
      
      // Total DSA Exercises
      DSAExercise.countDocuments()
    ]);

    // Calculate completion rate
    const totalProgressRecords = await Progress.countDocuments();
    const completionRate = totalProgressRecords > 0 
      ? ((completionsData[0]?.total || 0) / totalProgressRecords) * 100 
      : 0;

    res.json({
      status: 'success',
      data: {
        totalUsers,
        totalTutorials,
        totalCompletions: completionsData[0]?.total || 0,
        activeUsers: activeUsersData[0]?.total || 0,
        completionRate: Math.round(completionRate),
        totalExercises
      },
    });
  });

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find();
    res.json({ status: 'success', data: users });
  });
  
  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    await User.findByIdAndDelete(userId);
    res.json({ status: 'success', message: 'User deleted successfully' });
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(userId, { name, email, role });
    res.json({ status: 'success', message: 'User updated successfully' });
  });

  getAnalytics = catchAsync(async (req: Request, res: Response) => {
    // Get date range for trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Run queries in parallel for better performance
    const [
      userStats,
      contentStats,
      userGrowth,
      contentDistribution,
      userRegistrationTrend,
      popularCategories,
      contentCreationTrend,
      engagementStats,
      dailyActiveUsers,
      featureUsage
    ] = await Promise.all([
      // User stats
      User.aggregate([
        {
          $facet: {
            'total': [{ $count: 'count' }],
            'active': [
              { $match: { lastActive: { $gte: thirtyDaysAgo } } },
              { $count: 'count' }
            ],
            'new': [
              { $match: { createdAt: { $gte: thirtyDaysAgo } } },
              { $count: 'count' }
            ],
            'verified': [
              { $match: { isVerified: true } },
              { $count: 'count' }
            ]
          }
        }
      ]),
      
      // Content stats
      Promise.all([
        Tutorial.countDocuments(),
        DSAExercise.countDocuments(),
        Post.countDocuments()
      ]),
      
      // User growth trend (monthly for the past year)
      User.aggregate([
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            date: { 
              $concat: [
                { $toString: '$_id.year' }, 
                '-', 
                { $toString: '$_id.month' }
              ] 
            },
            users: '$count'
          }
        }
      ]),
      
      // Content distribution
      Promise.all([
        Tutorial.countDocuments(),
        DSAExercise.countDocuments(),
        Post.countDocuments()
      ]).then(([tutorials, dsaChallenges, posts]) => [
        { name: 'Tutorials', value: tutorials },
        { name: 'DSA Challenges', value: dsaChallenges },
        { name: 'Community Posts', value: posts }
      ]),
      
      // User registration trend (daily for past 30 days)
      User.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thirtyDaysAgo } 
          } 
        },
        {
          $group: {
            _id: { 
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
            },
            users: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: '$_id',
            users: 1,
            _id: 0
          }
        }
      ]),
      
      // Popular categories
      Tutorial.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),
      
      // Content creation trend
      Promise.all([
        // Tutorials by month
        Tutorial.aggregate([
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),
        // DSA challenges by month
        DSAExercise.aggregate([
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),
        // Posts by month
        Post.aggregate([
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ])
      ]).then(([tutorials, dsaChallenges, posts]) => {
        // Combine the data into a single array
        const months = new Set();
        [...tutorials, ...dsaChallenges, ...posts].forEach(item => {
          months.add(`${item._id.year}-${item._id.month}`);
        });
        
        return Array.from(months).sort().map(month => {
          const tutorialData = tutorials.find(t => `${t._id.year}-${t._id.month}` === month);
          const dsaData = dsaChallenges.find(d => `${d._id.year}-${d._id.month}` === month);
          const postData = posts.find(p => `${p._id.year}-${p._id.month}` === month);
          
          return {
            date: month,
            tutorials: tutorialData?.count || 0,
            dsaChallenges: dsaData?.count || 0,
            posts: postData?.count || 0
          };
        });
      }),
      
      // Engagement stats
      Promise.all([
        // Tutorial completion rate
        Progress.aggregate([
          {
            $group: {
              _id: null,
              avgProgress: { $avg: '$progress' }
            }
          }
        ]),
        // DSA challenge success rate
        DSAExercise.aggregate([
          {
            $group: {
              _id: null,
              successRate: { 
                $avg: { 
                  $cond: [
                    { $eq: ['$totalSubmissions', 0] },
                    0,
                    { $divide: ['$successfulSubmissions', '$totalSubmissions'] }
                  ]
                }
              }
            }
          }
        ]),
        // Average typing WPM
        TypingStats.aggregate([
          {
            $group: {
              _id: null,
              avgWpm: { $avg: '$wpm' }
            }
          }
        ])
      ]),
      
      // Daily active users
      User.aggregate([
        { 
          $match: { 
            lastActive: { $gte: thirtyDaysAgo } 
          } 
        },
        {
          $group: {
            _id: { 
              $dateToString: { format: '%Y-%m-%d', date: '$lastActive' } 
            },
            users: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: '$_id',
            users: 1,
            _id: 0
          }
        }
      ]),
      
      // Feature usage
      Promise.all([
        Progress.countDocuments(),
        TypingStats.countDocuments(),
        DSAExercise.aggregate([
          { $unwind: '$submissions' },
          { $count: 'count' }
        ]),
        Post.countDocuments(),
        Post.aggregate([
          { $unwind: '$comments' },
          { $count: 'count' }
        ])
      ]).then(([tutorials, typing, dsa, posts, comments]) => [
        { name: 'Tutorials', value: tutorials },
        { name: 'Typing Practice', value: typing },
        { name: 'DSA Challenges', value: dsa[0]?.count || 0 },
        { name: 'Community Posts', value: posts },
        { name: 'Comments', value: comments[0]?.count || 0 }
      ])
    ]);
    
    // Process user stats
    const totalUsers = userStats[0]?.total[0]?.count || 0;
    const activeUsers = userStats[0]?.active[0]?.count || 0;
    const newUsers = userStats[0]?.new[0]?.count || 0;
    const verifiedUsers = userStats[0]?.verified[0]?.count || 0;
    
    // Process content stats
    const [totalTutorials, totalDSAChallenges, totalPosts] = contentStats;
    const totalContent = totalTutorials + totalDSAChallenges + totalPosts;
    
    // Calculate engagement rate
    const engagementRate = Math.round((activeUsers / totalUsers) * 100) || 0;
    
    // Calculate user growth rate
    const previousMonthUsers = totalUsers - newUsers;
    const userGrowthRate = previousMonthUsers ? Math.round((newUsers / previousMonthUsers) * 100) : 0;
    
    // Process engagement stats
    const tutorialCompletionRate = Math.round(engagementStats[0][0]?.avgProgress || 0);
    const dsaSuccessRate = Math.round((engagementStats[1][0]?.successRate || 0) * 100);
    const avgTypingWPM = Math.round(engagementStats[2][0]?.avgWpm || 0);
    
    res.json({
      overview: {
        totalUsers,
        totalContent,
        engagementRate,
        userGrowth: userGrowthRate
      },
      users: {
        activeUsers,
        newUsers,
        verifiedUsers: Math.round((verifiedUsers / totalUsers) * 100) || 0
      },
      content: {
        totalTutorials,
        totalDSAChallenges,
        totalPosts
      },
      engagement: {
        tutorialCompletionRate,
        dsaSuccessRate,
        avgTypingWPM
      },
      userGrowth,
      contentDistribution,
      userRegistrationTrend,
      popularCategories,
      contentCreationTrend,
      dailyActiveUsers,
      featureUsage
    });
  });
}

export default new AdminController(); 