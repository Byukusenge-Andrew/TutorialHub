import { DSAChallenge } from '@/types/dsa';

export const twoSumChallenge: DSAChallenge = {
  id: '1',
  title: 'Two Sum',
  description: `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers in the array such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

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
  starterCode: `/**
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Indices of the two numbers that add up to target
 * 
 * @example
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * 
 * @constraints
 * - 2 <= nums.length <= 104
 * - -109 <= nums[i] <= 109
 * - -109 <= target <= 109
 * - Only one valid answer exists
 */
function solution(nums: number[], target: number): number[] {
  // Your code here
  // Must return an array of two indices: [index1, index2]
  // where nums[index1] + nums[index2] = target
  
  return [0, 0]; // Replace with your solution
}`,
  testCases: [
    {
      input: {
        nums: [2, 7, 11, 15],
        target: 9
      },
      output: [0, 1],
      explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
    },
    {
      input: {
        nums: [3, 2, 4],
        target: 6
      },
      output: [1, 2],
      explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
    },
    {
      input: {
        nums: [3, 3],
        target: 6
      },
      output: [0, 1],
      explanation: 'nums[0] + nums[1] = 3 + 3 = 6'
    }
  ],
  constraints: [
    '2 <= nums.length <= 104',
    '-109 <= nums[i] <= 109',
    '-109 <= target <= 109',
    'Only one valid answer exists'
  ],
  timeLimit: 2000, // 2 seconds
  memoryLimit: 128, // 128 MB
  successRate: 85.5,
  submissions: 1000,
  successfulSubmissions: 855
};

export const validParenthesesChallenge: DSAChallenge = {
  id: '2',
  title: 'Valid Parentheses',
  description: `
Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example:
\`\`\`
Input: s = "()[]{}"
Output: true

Input: s = "([)]"
Output: false
\`\`\`
  `,
  difficulty: 'easy',
  category: 'Stack',
  tags: ['stack', 'string'],
  starterCode: `/**
 * @param {string} s - String containing only parentheses characters
 * @return {boolean} - True if the input string is valid, false otherwise
 * 
 * @example
 * Input: s = "()[]{}"
 * Output: true
 * 
 * @constraints
 * - 1 <= s.length <= 104
 * - s consists of parentheses only '()[]{}'
 */
function solution(s: string): boolean {
  // Your code here
  // Must return true if the string has valid parentheses
  // false otherwise
  
  return false; // Replace with your solution
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
    },
    {
      input: "([)]",
      output: false,
      explanation: "Incorrectly ordered closing brackets"
    }
  ],
  constraints: [
    '1 <= s.length <= 104',
    's consists of parentheses only ()',
    'Only contains: (, ), {, }, [, ]'
  ],
  timeLimit: 1000, // 1 second
  memoryLimit: 64, // 64 MB
  successRate: 78.2,
  submissions: 1200,
  successfulSubmissions: 938
};

export const dsaChallenges = [
  twoSumChallenge,
  validParenthesesChallenge,
  // Add more challenges here
]; 