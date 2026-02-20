import { DSAExercise } from '../models/DSAExercise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const sampleExercises = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "easy",
    category: "Arrays",
    testCases: [
      {
        input: { nums: [2,7,11,15], target: 9 },
        expectedOutput: [0,1],
        isHidden: false,
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: { nums: [3,2,4], target: 6 },
        expectedOutput: [1,2],
        isHidden: false,
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: { nums: [3,3], target: 6 },
        expectedOutput: [0,1],
        isHidden: false,
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    starterCode: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
};`,
    solution: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
    constraints: {
      timeLimit: 2000,
      memoryLimit: 128
    },
    hints: [
      "Use a hash map to store the complement of each number",
      "Check if the complement exists in the map before adding the current number",
      "The complement is the difference between the target and the current number",
      "Store each number's index in the map as you iterate through the array"
    ],
    tags: ["hash-table", "array"]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    category: "Stack",
    testCases: [
      {
        input: "()",
        expectedOutput: true,
        isHidden: false,
        explanation: "The string contains valid parentheses."
      },
      {
        input: "()[]{}",
        expectedOutput: true,
        isHidden: false,
        explanation: "The string contains valid parentheses."
      }
    ],
    starterCode: `function isValid(s: string): boolean {
    // Your code here
};`,
    solution: `function isValid(s: string): boolean {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let char of s) {
        if (map[char]) {
            stack.push(map[char]);
        } else if (stack.pop() !== char) {
            return false;
        }
    }
    return stack.length === 0;
};`,
    constraints: {
      timeLimit: 5000,
      memoryLimit: 256
    },
    hints: [
      "Use a stack to keep track of opening brackets",
      "When you encounter a closing bracket, check if it matches the top of the stack"
    ],
    tags: ["stack", "string"]
  }
];

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing exercises
    await DSAExercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert new exercises
    await DSAExercise.insertMany(sampleExercises);
    console.log('Successfully seeded exercises');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
};

seedExercises(); 