import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TutorialService from '../services/TutorialService';
import { catchAsync } from '../utils/catchAsync';

export class TutorialController {

  createTutorial = catchAsync(async (req: AuthRequest, res: Response) => {
    const tutorial = await TutorialService.createTutorial(req.body, req.user.id);
   try{ 
    res.status(201).json({
      status: 'success',
      data: { tutorial }
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

  

  
}

export default new TutorialController(); 