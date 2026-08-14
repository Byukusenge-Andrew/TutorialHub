import { Request, Response } from 'express';
import { DSAExercise } from '../models/DSAExercise';
import { CodeExecutionService } from '../services/CodeExecutionService';

export class DSAExerciseController {
  static async getExercises(req: Request, res: Response) {
    try {
      const { difficulty, category, tag } = req.query;
      const query: Record<string, unknown> = {};

      if (difficulty) query.difficulty = difficulty;
      if (category) query.category = category;
      if (tag) query.tags = tag;

      const exercises = await DSAExercise.find(query)
        .select('id title difficulty category description testCases successRate');
      
      return res.json({
        status: 'success',
        data: exercises
      });
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch exercises'
      });
    }
  }

  static async getExercise(req: Request, res: Response) {
    try {
      const exercise = await DSAExercise.findById(req.params.id);
      if (!exercise) {
        return res.status(404).json({
          status: 'error',
          message: 'Exercise not found'
        });
      }

      // Don't send solution to client
      const exerciseData = exercise.toObject();
      delete (exerciseData as { solution?: unknown }).solution;

      return res.json({
        status: 'success',
        data: exerciseData
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch exercise'
      });
    }
  }

  static async createExercise(req: Request, res: Response) {
    try {
      const exercise = new DSAExercise({
        ...req.body,
        createdBy: req.user.id
      });
      await exercise.save();

      return res.status(201).json({
        status: 'success',
        data: exercise
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create exercise'
      });
    }
  }

  static async submitSolution(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { code, language } = req.body;
      const exercise = await DSAExercise.findById(id);

      if (!exercise) {
        return res.status(404).json({
          status: 'error',
          message: 'Exercise not found'
        });
      }

      // Format test cases for execution
      const formattedTestCases = exercise.testCases.map(testCase => ({
        input: testCase.input,
        output: testCase.expectedOutput
      }));

      // Execute code
      const result = await CodeExecutionService.executeCode(code, language, formattedTestCases);

      // Update exercise stats
      exercise.totalSubmissions += 1;
      if (result.passed) {
        exercise.successfulSubmissions += 1;
      }
      exercise.successRate = (exercise.successfulSubmissions / exercise.totalSubmissions) * 100;
      await exercise.save();

      return res.json({
        status: 'success',
        data: {
          success: result.passed,
          executionTime: result.executionTime,
          memoryUsed: result.memory,
          passedTestCases: result.passed ? formattedTestCases.length : 0,
          totalTestCases: formattedTestCases.length,
          error: result.failedTestCase ? formattedTestCases[result.failedTestCase].output : null
        }
      });
    } catch (error) {
      console.error('Error submitting solution:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process submission'
      });
    }
  }

  static async getUserStats(req: Request, res: Response) {
    try {
      const stats = await DSAExercise.aggregate([
        {
          $match: {
            'submissions.userId': req.user.id
          }
        },
        {
          $group: {
            _id: null,
            totalAttempted: { $sum: 1 },
            totalSolved: {
              $sum: {
                $cond: [{ $eq: ['$submissions.success', true] }, 1, 0]
              }
            }
          }
        }
      ]);

      return res.json({
        status: 'success',
        data: {
          solved: stats[0]?.totalSolved || 0,
          attempted: stats[0]?.totalAttempted || 0
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user stats'
      });
    }
  }

  static async testSolution(req: Request, res: Response) {
    try {
      const { code, input } = req.body;

      if (!code || !input) {
        return res.status(400).json({
          status: 'error',
          message: 'Code and input are required'
        });
      }

      // Create a sandbox environment to run the code
      const sandbox = [{
        input: JSON.parse(input),
        output: null,
        expectedOutput: null
      }];

      try {
        // Run the code in a safe environment
        const result = await CodeExecutionService.executeCode(code, 'javascript', sandbox);

        return res.json({
          status: 'success',
          data: {
            passed: result.passed,
            executionTime: result.executionTime,
            memory: result.memory
          }
        });
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: error instanceof Error ? error.message : 'Code execution failed'
        });
      }
    } catch (error) {
      console.error('Test solution error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to test solution'
      });
    }
  }
} 