import { IDSAChallenge } from '../models/DSAChallenge';
import DSAChallenge from '../models/DSAChallenge';
import { AppError } from '../utils/errors';

export class DSAChallengeService {
  async getChallenges(): Promise<IDSAChallenge[]> {
    const challenges = await DSAChallenge.find()
      .populate('authorId', 'name email')
      .sort('-createdAt');
    return challenges;
  }

  async getChallengeById(id: string): Promise<IDSAChallenge> {
    const challenge = await DSAChallenge.findById(id)
      .populate('authorId', 'name email');
    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }
    return challenge;
  }

  async createChallenge(data: Partial<IDSAChallenge>): Promise<IDSAChallenge> {
    const challenge = await DSAChallenge.create(data);
    return challenge;
  }

  async submitSolution(challengeId: string, solution: string, userId: string) {
    const challenge = await this.getChallengeById(challengeId);
    
    // Run test cases
    let passed = 0;
    const results = challenge.testCases.map(testCase => {
      try {
        const fn = new Function('input', solution);
        const result = fn(testCase.input);
        const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.output);
        if (isCorrect) passed++;
        return { passed: isCorrect, input: testCase.input, expected: testCase.output, received: result };
      } catch (error) {
        return { passed: false, input: testCase.input, expected: testCase.output, error: error.message };
      }
    });

    // Update challenge stats
    challenge.submissions += 1;
    if (passed === challenge.testCases.length) {
      challenge.successfulSubmissions += 1;
    }
    challenge.successRate = (challenge.successfulSubmissions / challenge.submissions) * 100;
    await challenge.save();

    return {
      success: passed === challenge.testCases.length,
      results,
      stats: {
        passed,
        total: challenge.testCases.length,
        successRate: challenge.successRate
      }
    };
  }
}

export default new DSAChallengeService(); 