import mongoose from 'mongoose';
import { config } from 'dotenv';
import Tutorial from '../models/Tutorial';
import User from '../models/User';
import Progress from '../models/Progress';
import DSAChallenge from '../models/DSAChallenge';

config(); // Load environment variables

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorial-platform');
    console.log('Connected to MongoDB');

    // Create indexes
    await Promise.all([
      // User indexes
      User.collection.createIndex({ email: 1 }, { unique: true }),
      
      // Tutorial indexes
      Tutorial.collection.createIndex({ title: 1 }),
      Tutorial.collection.createIndex({ category: 1 }),
      Tutorial.collection.createIndex({ tags: 1 }),
      Tutorial.collection.createIndex({ authorId: 1 }),
      
      // Progress indexes
      Progress.collection.createIndex({ userId: 1, tutorialId: 1 }, { unique: true }),
      Progress.collection.createIndex({ userId: 1 }),
      Progress.collection.createIndex({ lastAccessedAt: -1 })
    ]);

    console.log('Database indexes created successfully');

    // Create sample data for testing
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });

    const tutorial = await Tutorial.create({
      title: 'Getting Started with TypeScript',
      description: 'Learn the basics of TypeScript',
      content: 'Introduction to TypeScript...',
      authorId: adminUser._id,
      category: 'Programming',
      tags: ['typescript', 'javascript', 'web development'],
      sections: [
        {
          title: 'Introduction',
          content: 'TypeScript is a typed superset of JavaScript...',
          order: 1
        },
        {
          title: 'Basic Types',
          content: 'TypeScript supports several types...',
          order: 2
        }
      ]
    });

    await Progress.create({
      userId: adminUser._id,
      tutorialId: tutorial._id,
      completedSections: [],
      progress: 0,
      lastAccessedAt: new Date()
    });

    // Create DSA Challenges
    const dsaChallenges = [
      {
        title: 'Two Sum',
        description: `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers in the array such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]
\`\`\`
        `,
        difficulty: 'easy',
        category: 'Arrays',
        tags: ['array', 'hash-table'],
        starterCode: `function solution(nums: number[], target: number): number[] {
  // Your code here
  return [0, 0];
}`,
        testCases: [
          {
            input: { nums: [2, 7, 11, 15], target: 9 },
            output: [0, 1],
            explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
          },
          {
            input: { nums: [3, 2, 4], target: 6 },
            output: [1, 2],
            explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
          }
        ],
        constraints: [
          '2 <= nums.length <= 104',
          '-109 <= nums[i] <= 109',
          '-109 <= target <= 109'
        ],
        authorId: adminUser._id
      },
      {
        title: 'Valid Parentheses',
        description: `
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.
        `,
        difficulty: 'easy',
        category: 'Stack',
        tags: ['stack', 'string'],
        starterCode: `function solution(s: string): boolean {
  // Your code here
  return false;
}`,
        testCases: [
          {
            input: "()",
            output: true,
            explanation: "Simple matching parentheses"
          },
          {
            input: "()[]{}",
            output: true,
            explanation: "Multiple matching pairs"
          },
          {
            input: "(]",
            output: false,
            explanation: "Mismatched brackets"
          }
        ],
        constraints: [
          '1 <= s.length <= 104',
          's consists of parentheses only ()'
        ],
        authorId: adminUser._id
      }
    ];

    await DSAChallenge.insertMany(dsaChallenges);
    console.log('DSA challenges created successfully');

    console.log('Sample data created successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeDatabase(); 