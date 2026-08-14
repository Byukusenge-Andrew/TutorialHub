import { IDSAChallenge } from '../models/DSAChallenge';
import DSAChallenge from '../models/DSAChallenge';
import { AppError } from '../utils/errors';
import { CodeExecutionService } from './CodeExecutionService';

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
    
    const evalResult = await CodeExecutionService.executeCode(
      solution,
      'javascript',
      challenge.testCases
    );

    const isPassed = evalResult.passed;

    // Update challenge stats and push submission
    challenge.totalSubmissions = (challenge.totalSubmissions || 0) + 1;
    if (isPassed) {
      challenge.successfulSubmissions = (challenge.successfulSubmissions || 0) + 1;
    }
    challenge.successRate = (challenge.successfulSubmissions / challenge.totalSubmissions) * 100;
    
    if (userId) {
      challenge.submissions.push({
        userId: userId as unknown as import('mongoose').Schema.Types.ObjectId,
        code: solution,
        language: 'javascript',
        passed: isPassed,
        executionTime: 0,
        memory: 0,
        createdAt: new Date()
      });
    }

    await challenge.save();

    return {
      success: isPassed,
      results: evalResult,
      stats: {
        passed: isPassed ? challenge.testCases.length : 0,
        total: challenge.testCases.length,
        successRate: challenge.successRate
      }
    };
  }
}

export default new DSAChallengeService(); 