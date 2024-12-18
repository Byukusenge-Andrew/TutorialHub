import { Link } from 'react-router-dom';
import { BookOpen, Video, Users, Star } from 'lucide-react';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Tutorial } from '../types';

export function Home() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const tutorialsResponse = await api.tutorials.getAll();
        const tutorialsData = tutorialsResponse?.data?.tutorials;

        if (Array.isArray(tutorialsData)) {
          setTutorials(tutorialsData);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load tutorials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const FeaturedTutorialCard = ({ tutorial }: { tutorial: Tutorial }) => (
    <div className="bg-white  rounded-lg shadow-md text-center">
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{tutorial.title}</h3>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="ml-1">{tutorial.rating || 'N/A'}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{tutorial.description || 'No description available.'}</p>
      <Link
        to={`/tutorials/${tutorial._id}`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Start Learning →
      </Link>
    </div>
    </div>
  );

  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to TutorialHub</h1>
        <p className="text-xl text-gray-600 mb-8">Learn, Share, and Grow with Our Community</p>
        <Link
          to="/tutorials"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
        >
          Explore Tutorials
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Video Tutorials</h2>
          <p className="text-gray-600">Learn at your own pace with our comprehensive video lessons</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Written Guides</h2>
          <p className="text-gray-600">Detailed step-by-step instructions for every skill level</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-gray-600">Join discussions and share knowledge with fellow learners</p>
        </div>
      </section>

      <section className="bg-gray-50 -mx-4 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Tutorials</h2>
          {isLoading ? (
            <p>Loading tutorials...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : tutorials.length === 0 ? (
            <p>No tutorials available.</p>
          ) : (
            <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tutorials.slice(0, 3).map((tutorial) => (
                <FeaturedTutorialCard key={tutorial._id} tutorial={tutorial}
                
                />
              ))}
            </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
