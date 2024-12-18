import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.register(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    
    console.log('Login response:', { user, token });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  });

  validate = catchAsync(async (req: AuthRequest, res: Response) => {
    const { user } = req;
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });
}

export default new AuthController(); 