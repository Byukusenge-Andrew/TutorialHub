import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TutorialService from '../services/TutorialService';
import { catchAsync } from '../utils/catchAsync';
import Progress from '../models/Progress';

export class TutorialController {

  createTutorial = catchAsync(async (req: AuthRequest, res: Response) => {
    try {
      // Clean up sections data before saving
      const tutorialData = {
        ...req.body,
        sections: req.body.sections.map((section: any, index: number) => ({
          title: section.title,
          content: section.content,
          order: section.order || index
        })),
        authorId: req.user.id
      };

      const tutorial = await TutorialService.createTutorial(tutorialData, req.user.id);

      res.status(201).json({
        status: 'success',
        data: { tutorial }
      });
    } catch (error) {
      console.error('Error creating tutorial:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create tutorial',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  getTutorials = catchAsync(async (req: Request, res: Response) => {
    const tutorials = await TutorialService.getTutorials(req.query);
    
    res.status(200).json({
      status: 'success',
      results: tutorials.length,
      data: { tutorials }
    });
  });



  getTutorial = catchAsync(async (req: Request, res: Response) => {
    const tutorial = await TutorialService.getTutorialById(req.params.id);
    console.log('tutorial', tutorial);
    console.log('tutorial id', req.params.id)
    
    res.status(200).json({
      status: 'success',
      data: { tutorial },
      message: 'Tutorial fetched successfully'
    });
  });

  updateTutorial = catchAsync(async (req: AuthRequest, res: Response) => {
    const tutorial = await TutorialService.updateTutorial(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: { tutorial }
    });
  });

  deleteTutorial = catchAsync(async (req: AuthRequest, res: Response) => {
    await TutorialService.deleteTutorial(req.params.id, req.user.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  rateTutorial = catchAsync(async (req: Request, res: Response) => {
    const tutorial = await TutorialService.rateTutorial(
      req.params.id,
      req.body.rating
    );
    
    res.status(200).json({
      status: 'success',
      data: { tutorial }
    });
  });
  
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await TutorialService.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get categories' });
    }
  }

  getUserProgress = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    // Get all progress records for the user
    const progress = await Progress.find({ userId });

    // Calculate stats
    const completed = progress.filter(p => p.progress === 100).length;
    const inProgress = progress.filter(p => p.progress > 0 && p.progress < 100).length;

    res.status(200).json({
      status: 'success',
      data: {
        completed,
        inProgress,
        totalTime: 0 // You can add time tracking if needed
      }
    });
  });

}

export default new TutorialController(); 