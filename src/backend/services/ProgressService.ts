import { IProgress } from '../models/Progress';
import Progress from '../models/Progress';
import Tutorial from '../models/Tutorial';
import { AppError } from '../utils/errors';
import { Document } from 'mongoose';

export class ProgressService {
  async getProgress(userId: string, tutorialId: string): Promise<Document | null> {
    const progress = await Progress.findOne({ userId, tutorialId })
      .populate('tutorialId', 'title sections')
      .exec();

    if (!progress) {
      return Progress.create({
        userId,
        tutorialId,
        completedSections: [],
        progress: 0,
        lastAccessedAt: new Date()
      });
    }

    return progress;
  }

  async getAllUserProgress(userId: string): Promise<IProgress[]> {
    const progress = await Progress.find({ userId })
      .populate('tutorialId', 'title description')
      .sort('-lastAccessedAt');
    return progress;
  }

  async updateProgress(
    userId: string,
    tutorialId: string,
    completedSection: string
  ): Promise<IProgress> {
    // Verify tutorial exists
    const tutorial = await Tutorial.findById(tutorialId);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Validate that the section exists in the tutorial
    const sectionExists = tutorial.sections.some(
      section => section.id && section.id.toString() === completedSection
    );
    if (!sectionExists) {
      throw new AppError('Invalid section ID', 400);
    }

    // Find or create progress
    let progress = await Progress.findOne({ userId, tutorialId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        tutorialId,
        completedSections: [],
        progress: 0
      });
    }

    // Update completed sections if not already completed
    if (!progress.completedSections.includes(completedSection)) {
      progress.completedSections.push(completedSection);
      // Calculate progress percentage (assuming total sections is stored somewhere)
      // This is a simplified calculation
      progress.progress = (progress.completedSections.length / tutorial.sections.length) * 100;
    }

    progress.lastAccessedAt = new Date();
    await progress.save();

    return progress;
  }

  async resetProgress(userId: string, tutorialId: string): Promise<IProgress> {
    const progress = await Progress.findOne({ userId, tutorialId });
    if (!progress) {
      throw new AppError('Progress not found', 404);
    }

    progress.completedSections = [];
    progress.progress = 0;
    progress.lastAccessedAt = new Date();
    
    await progress.save();
    return progress;
  }
}

export default new ProgressService();