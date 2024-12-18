import { ITutorial } from '../models/Tutorial';
import Tutorial from '../models/Tutorial';
import { AppError } from '../utils/errors';

export class TutorialService {
  async createTutorial(tutorialData: Partial<ITutorial>, authorId: string): Promise<ITutorial> {
    const tutorial = await Tutorial.create({
      ...tutorialData,
      authorId
    });
    return tutorial;
  }

  async getTutorials(query: any = {}): Promise<ITutorial[]> {
    const tutorials = await Tutorial.find(query)
      .populate('authorId', 'name email')
      .sort('-createdAt');
    return tutorials;
  }

  async getTutorialById(id: string): Promise<ITutorial | string[]> {
    try {
      if (id === 'categories') {
        return this.getCategories();
      }
      
      const tutorial = await Tutorial.findById(id);
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      return tutorial;
    } catch (error) {
      console.error('Error getting tutorial:', error);
      throw error;
    }
  }

  async updateTutorial(id: string, updateData: Partial<ITutorial>, userId: string): Promise<ITutorial> {
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Check if user is the author
    if (tutorial.authorId.toString() !== userId) {
      throw new AppError('Not authorized to update this tutorial', 403);
    }

    const updatedTutorial = await Tutorial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedTutorial!;
  }

  async deleteTutorial(id: string, userId: string): Promise<void> {
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Check if user is the author
    if (tutorial.authorId.toString() !== userId) {
      throw new AppError('Not authorized to delete this tutorial', 403);
    }

    await Tutorial.findByIdAndDelete(id);
  }

  async rateTutorial(id: string, rating: number): Promise<ITutorial> {
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Update rating
    tutorial.rating = ((tutorial.rating * tutorial.totalRatings) + rating) / (tutorial.totalRatings + 1);
    tutorial.totalRatings += 1;

    await tutorial.save();
    return tutorial;
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await Tutorial.distinct('category');
      return categories;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }
}

export default new TutorialService(); 