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
  const { _id } = useParams();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_id) {
      console.log('Tutorial ID:', _id);
      loadTutorial(_id);
    }
  }, [_id]);

  const loadTutorial = async (tutorialId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tutorials/${tutorialId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tutorial: ${response.statusText}`);
      }
      const data = await response.json();
      setTutorial(data);
    } catch (error) {
      console.error('Error loading tutorial:', error);
      setError('Failed to load tutorial');
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
                key={section.id}
                onClick={() => setCurrentSection(section)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${
                  currentSection?.id === section.id ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="prose dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-4">{currentSection?.title}</h1>
              <MarkdownRenderer content={currentSection?.content || ''} />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={!tutorial.sections[tutorial.sections.findIndex(s => s.id === currentSection?.id) - 1]}
              onClick={() => {
                const prevIndex = tutorial.sections.findIndex(s => s.id === currentSection?.id) - 1;
                if (prevIndex >= 0) {
                  setCurrentSection(tutorial.sections[prevIndex]);
                }
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!tutorial.sections[tutorial.sections.findIndex(s => s.id === currentSection?.id) + 1]}
              onClick={() => {
                const nextIndex = tutorial.sections.findIndex(s => s.id === currentSection?.id) + 1;
                if (nextIndex < tutorial.sections.length) {
                  setCurrentSection(tutorial.sections[nextIndex]);
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}