import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import Tutorial from '../models/Tutorial';
import { DSAExercise } from '../models/DSAExercise';
import DSAChallenge from '../models/DSAChallenge';
import { Types } from 'mongoose';

class BulkImportController {
  /**
   * Bulk import tutorials
   */
  importTutorials = catchAsync(async (req: AuthRequest, res: Response) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload: "items" must be a non-empty array'
      });
    }

    const userId = new Types.ObjectId((req.user._id || req.user.id).toString());
    const validTutorials = [];
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.title || typeof item.title !== 'string') {
        errors.push(`Item ${i + 1}: Missing or invalid "title"`);
        continue;
      }
      if (!item.description || typeof item.description !== 'string') {
        errors.push(`Item ${i + 1}: Missing or invalid "description"`);
        continue;
      }

      const category = item.category || 'General';
      const tags = Array.isArray(item.tags)
        ? item.tags
        : (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : []);

      let sections = item.sections;
      if (!Array.isArray(sections) || sections.length === 0) {
        // Fallback: create default section from content if present
        const content = item.content || item.description;
        sections = [{ title: 'Overview', content, order: 1 }];
      } else {
        sections = sections.map((sec: any, idx: number) => ({
          title: sec.title || `Section ${idx + 1}`,
          content: sec.content || '',
          order: typeof sec.order === 'number' ? sec.order : idx + 1
        }));
      }

      validTutorials.push({
        title: item.title.trim(),
        description: item.description.trim(),
        category,
        tags,
        sections,
        authorId: userId
      });
    }

    if (validTutorials.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid tutorials found in request',
        errors
      });
    }

    const inserted = await Tutorial.insertMany(validTutorials);

    res.status(201).json({
      status: 'success',
      message: `Successfully imported ${inserted.length} tutorial(s)`,
      count: inserted.length,
      errors: errors.length > 0 ? errors : undefined,
      data: inserted
    });
  });

  /**
   * Bulk import DSA exercises/challenges
   */
  importDSAExercises = catchAsync(async (req: AuthRequest, res: Response) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload: "items" must be a non-empty array'
      });
    }

    const userId = new Types.ObjectId((req.user._id || req.user.id).toString());
    const validExercises = [];
    const validChallenges = [];
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.title || typeof item.title !== 'string') {
        errors.push(`Item ${i + 1}: Missing or invalid "title"`);
        continue;
      }
      if (!item.description || typeof item.description !== 'string') {
        errors.push(`Item ${i + 1}: Missing or invalid "description"`);
        continue;
      }

      const difficulty = ['easy', 'medium', 'hard'].includes(String(item.difficulty).toLowerCase())
        ? String(item.difficulty).toLowerCase()
        : 'easy';

      const category = item.category || 'General';
      const starterCode = typeof item.starterCode === 'string'
        ? item.starterCode
        : (item.starterCode?.javascript || 'function solution() {\n  // Write solution\n}');
      const solution = item.solution || starterCode;

      let testCases = item.testCases;
      if (!Array.isArray(testCases)) {
        testCases = [];
      } else {
        testCases = testCases.map((tc: any) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput ?? tc.output,
          output: tc.output ?? tc.expectedOutput,
          explanation: tc.explanation || '',
          isHidden: Boolean(tc.isHidden)
        }));
      }

      const tags = Array.isArray(item.tags)
        ? item.tags
        : (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : []);

      validExercises.push({
        title: item.title.trim(),
        description: item.description.trim(),
        difficulty,
        category,
        starterCode,
        solution,
        testCases,
        tags,
        createdBy: userId
      });

      validChallenges.push({
        title: item.title.trim(),
        description: item.description.trim(),
        difficulty,
        category,
        tags,
        starterCode: {
          javascript: starterCode,
          typescript: typeof item.starterCode === 'object' ? item.starterCode.typescript || starterCode : starterCode,
          python: typeof item.starterCode === 'object' ? item.starterCode.python || '# Write code' : '# Write code'
        },
        testCases,
        authorId: userId
      });
    }

    if (validExercises.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid exercises found in request',
        errors
      });
    }

    const insertedExercises = await DSAExercise.insertMany(validExercises);
    const insertedChallenges = await DSAChallenge.insertMany(validChallenges);

    res.status(201).json({
      status: 'success',
      message: `Successfully imported ${insertedExercises.length} DSA exercise(s)`,
      count: insertedExercises.length,
      errors: errors.length > 0 ? errors : undefined,
      data: insertedExercises
    });
  });
}

export default new BulkImportController();
