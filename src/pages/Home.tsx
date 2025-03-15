import { Link } from 'react-router-dom';
import { BookOpen,  Users, Star, Keyboard,  BrainCircuitIcon } from 'lucide-react';
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
        if (tutorialsResponse?.data?.tutorials && Array.isArray(tutorialsResponse.data.tutorials)) {
          setTutorials(tutorialsResponse.data.tutorials);
        } else {
          console.log('Unexpected API response format:', tutorialsResponse);
          setTutorials([]); // Set empty array instead of throwing error
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load tutorials. Please try again later.');
        setTutorials([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const FeaturedTutorialCard = ({ tutorial }: { tutorial: Tutorial }) => (
    <div className="bg-white dark:bg-slate-300/35 hover:bg-slate-200 hover:dark:bg-gray-900/65  rounded-lg shadow-lg text-center">
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{tutorial.title}</h3>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="ml-1">N/A</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{tutorial.description.slice(0,63) || 'No description available.'}</p>
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
        <p className="text-xl text-gray-600 mb-8">Learn and Grow with Our Community</p>
        {/* <Link */}
          {/* to="/tutorials" */}
          {/* className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block" */}
        {/* > */}
          {/* Explore TutorialHub */}
        {/* </Link> */}
      </section>

      <section className="grid md:grid-cols-3 gap-8 ">
        <Link to={"/typing"} >
        <div className="bg-slate-200/80  hover:bg-slate-300 hover:dark:bg-gray-900/20 p-6 rounded-lg shadow-lg text-center">
          <Keyboard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Practice Typing</h2>
          <p className="text-gray-600">Improve your typing speed and accuracy with interactive exercises</p>
        </div></Link>
        <Link to={"/tutorials"}>
        <div className="bg-slate-200/80  hover:bg-slate-200  hover:dark:bg-gray-900/20  p-6 rounded-lg shadow-lg text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Written Guides</h2>
          <p className="text-gray-600">Detailed step-by-step instructions for every skill level</p>
        </div></Link>
        <Link to={"/community"}>
        <div className="bg-slate-200/80  hover:bg-slate-200 hover:dark:bg-gray-900/20  p-6 rounded-lg shadow-lg text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-gray-600">Join discussions and share knowledge with fellow learners</p>
        </div></Link>
        <Link to={"/community"}>
        <div className="bg-slate-200/80  hover:bg-slate-200 hover:dark:bg-gray-900/20  p-6 rounded-lg shadow-lg text-center">
          <BrainCircuitIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Challenges</h2>
          <p className="text-gray-600">Test your knowledge and problem-solving skills with our coding challenges</p>
        </div></Link>
      </section>

      <section className="-mx-4 px-4 py-12">
        <div className=" mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">New Tutorials</h2>
          {isLoading ? (
            <p>Loading tutorials...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : tutorials.length === 0 ? (
            <p>No tutorials available.</p>
          ) : (
            <>
            <div className="flex flex-row gap-1 w-full box-border">
              
              {tutorials.slice(0, 3).map((tutorial, index) => (
                <div key={tutorial._id || index} className='rounded-lg  p-2 text-center'>
                <FeaturedTutorialCard tutorial={tutorial}
                
                />
                </div>
              ))}
              
            </div>
            </>
          )}
        </div>
        {/* <Link to='/tutorials'> */}
            {/* <Button className=''> */}
              {/* More Tutorials */}
            {/* </Button> */}
            {/* </Link>  */}
      </section>
    </div>
  );
}
