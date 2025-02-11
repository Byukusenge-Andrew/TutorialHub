import { body } from 'express-validator';

export const progressValidators = {
  updateProgress: [
    body('completedSection').notEmpty().withMessage('Completed section ID is required'),
    body('tutorialId').notEmpty().withMessage('Tutorial ID is required')
  ]
};

// ...existing code...
