import mongoose from 'mongoose';
import DSAChallenge from '../models/DSAChallenge';
import dotenv from 'dotenv';

dotenv.config();

const sampleChallenges = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "hash-table"],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`
    },
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        output: [0, 1],
        explanation: "nums[0] + nums[1] = 2 + 7 = 9"
      },
      {
        input: [[3, 2, 4], 6],
        output: [1, 2],
        explanation: "nums[1] + nums[2] = 2 + 4 = 6"
      }
    ]
  },
  // Add more sample challenges here
];

async function initDSAChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await DSAChallenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert sample challenges
    await DSAChallenge.insertMany(sampleChallenges);
    console.log('Inserted sample challenges');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDSAChallenges(); 