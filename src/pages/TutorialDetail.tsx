import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { api } from '@/services/api';
import { Tutorial, Section } from '@/types';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function TutorialDetail() {
  console.log('params', useParams())
  const { id } = useParams();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const  [currentIndex, setCurrentIndex] = useState(0);
 const [activeSection, setActiveSection] = useState('');

 const handlePrevious = () => {
  if (currentIndex > 0 && tutorial) {
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSection(tutorial.sections[prevIndex]);
    setActiveSection(tutorial.sections[prevIndex]._id);
  }
};

const handleNext = async () => {
  if (tutorial && currentIndex < tutorial.sections.length - 1) {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentSection(tutorial.sections[nextIndex]);
    setActiveSection(tutorial.sections[nextIndex]._id);

    // Save progress when moving to next section
    try {
      await api.progress.updateProgress(tutorial._id, tutorial.sections[currentIndex]._id);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
};

const handleSectionClick = (section: Section, index: number) => {
  setCurrentSection(section);
  setActiveSection(section._id);
  setCurrentIndex(index);
};

  useEffect(() => {
    if (id) {
      console.log('Tutorial ID:', id);
      loadTutorial(id);
    }
  }, [id]);

  const loadTutorial = async (tutorialId: string) => {
    try {
      setIsLoading(true);
      const response = await api.tutorials.getById(tutorialId);
      
      // Extract tutorial from nested response
      if (response?.status === 'success' && response?.data?.tutorial) {
        setTutorial(response.data.tutorial);
        if (response.data.tutorial.sections?.length > 0) {
          setCurrentSection(response.data.tutorial.sections[0]);
        }
      } else {
        throw new Error('Invalid tutorial data structure');
      }
    } catch (error) {
      console.error('Error loading tutorial:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tutorial');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Tutorial not found'}
      </div>
    );
  }
 console.log('tutorial in detail', tutorial)
 
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Sidebar - Table of Contents */}
        <div className="col-span-3 bg-card border border-border rounded-lg p-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg mb-4">Tutorial Index</h3>
            {tutorial.sections.map((section: Section, index: number) => (
              <button
                key={section._id}
                onClick={() => handleSectionClick(section, index)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm bg-white text-black 
                  ${activeSection === section._id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent '}`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {currentSection && (
            <>
              <div className="bg-card border border-border rounded-lg p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">{currentSection.title}</h2>
                <div className="prose max-w-none">{currentSection.content}</div>
              </div>
                {/* Navigation Buttons */}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  Previous
                </Button>
                <Button>
                  <Link to={'/tutorials'}>
                  Back to Tutorials
                  </Link>
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === tutorial.sections.length - 1}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  Next
                </Button>
                
              </div>
            </>
          )}
        </div>

        
          
        </div>
      </div>
    
  );
}