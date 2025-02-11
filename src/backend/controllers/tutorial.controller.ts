import { Request, Response } from 'express';
import Tutorial from '../models/Tutorial';

export const getAllTutorials = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all tutorials...');
    const tutorials = await Tutorial.find()
      .populate('authorId', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });

    console.log(`Found ${tutorials.length} tutorials`);

    res.status(200).json({
      status: 'success',
      results: tutorials.length,
      data: {
        tutorials
      }
    });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tutorials',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ...existing code...
