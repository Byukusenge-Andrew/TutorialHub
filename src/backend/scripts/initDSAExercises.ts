import mongoose from 'mongoose';
import { DSAExercise } from '../models/DSAExercise';
import dotenv from 'dotenv';

dotenv.config();

const exercises = [
  {
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'easy',
    category: 'Array',
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        isHidden: false,
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        isHidden: false,
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      },
      {
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1],
        isHidden: true,
        explanation: 'nums[0] + nums[1] = 3 + 3 = 6'
      }
    ],
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
  return [];
}`,
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
}`,
    constraints: {
      timeLimit: 2000,
      memoryLimit: 128
    },
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'So, we need a better way to check if the complement exists.',
      'If the complement exists, we need to look up its index.'
    ],
    tags: ['array', 'hash-table']
  },
  {
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    category: 'Stack',
    testCases: [
      {
        input: "()",
        expectedOutput: true,
        isHidden: false,
        explanation: 'Simple matching parentheses'
      },
      {
        input: "()[]{}",
        expectedOutput: true,
        isHidden: false,
        explanation: 'Multiple matching pairs'
      },
      {
        input: "(]",
        expectedOutput: false,
        isHidden: false,
        explanation: 'Mismatched brackets'
      }
    ],
    starterCode: `function isValid(s: string): boolean {
  // Your code here
  return false;
}`,
    solution: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (char in map) {
      const top = stack.pop();
      if (map[char] !== top) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
    constraints: {
      timeLimit: 2000,
      memoryLimit: 128
    },
    hints: [
      'Use a stack to keep track of the opening brackets.',
      'When you encounter a closing bracket, check if it matches the top of the stack.',
      'If the stack is empty at the end, the string is valid.'
    ],
    tags: ['string', 'stack']
  },
  {
    title: 'Merge Two Sorted Lists',
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    difficulty: 'easy',
    category: 'Linked List',
    testCases: [
      {
        input: { list1: [1, 2, 4], list2: [1, 3, 4] },
        expectedOutput: [1, 1, 2, 3, 4, 4],
        isHidden: false,
        explanation: 'Merged in sorted order'
      },
      {
        input: { list1: [], list2: [] },
        expectedOutput: [],
        isHidden: false,
        explanation: 'Empty lists'
      },
      {
        input: { list1: [], list2: [0] },
        expectedOutput: [0],
        isHidden: true,
        explanation: 'One empty list'
      }
    ],
    starterCode: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Your code here
  return null;
}`,
    solution: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let current = dummy;
  
  while (list1 && list2) {
    if (list1.val < list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  
  current.next = list1 || list2;
  return dummy.next;
}`,
    constraints: {
      timeLimit: 2000,
      memoryLimit: 128
    },
    hints: [
      'Use a dummy node to simplify the code.',
      'Compare the values of the current nodes of both lists.',
      'Attach the smaller node to the result list and move forward.'
    ],
    tags: ['linked-list', 'recursion']
  }
];

async function seedDSAExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorialhub');
    console.log('Connected to MongoDB');

    // Clear existing exercises
    await DSAExercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert new exercises
    await DSAExercise.insertMany(exercises);
    console.log('Successfully seeded DSA exercises');

  } catch (error) {
    console.error('Error seeding DSA exercises:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDSAExercises(); 