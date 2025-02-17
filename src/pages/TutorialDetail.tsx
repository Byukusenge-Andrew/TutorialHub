import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2, BookOpen, ChevronLeft } from 'lucide-react';
import { api } from '@/services/api';
import { Tutorial, Section } from '@/types';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function TutorialDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const { data: tutorialResponse, isLoading } = useQuery({
    queryKey: ['tutorial', id],
    queryFn: () => api.tutorials.getTutorial(id!),
    staleTime: 1000 * 60 * 5, 
  });

  const tutorial = tutorialResponse?.data?.tutorial;

  // Persist current section index
  useEffect(() => {
    const savedIndex = localStorage.getItem(`tutorial-${id}-section`);
    if (savedIndex) {
      setCurrentSectionIndex(parseInt(savedIndex));
    }
  }, [id]);

  // Save current section index
  useEffect(() => {
    if (id) {
      localStorage.setItem(`tutorial-${id}-section`, currentSectionIndex.toString());
    }
  }, [currentSectionIndex, id]);

  const handleNextSection = () => {
    if (tutorial && currentSectionIndex < tutorial.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tutorial not found</h1>
          <p className="text-muted-foreground">
            The tutorial you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const currentSection = tutorial.sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / tutorial.sections.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tutorial.title}</h1>
        <p className="text-muted-foreground mb-4">{tutorial.description}</p>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="bg-card rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{currentSection.title}</h2>
        <div className="prose max-w-none">
          {currentSection.content}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handlePreviousSection}
          disabled={currentSectionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Section
        </Button>

        <span className="text-sm text-muted-foreground">
          Section {currentSectionIndex + 1} of {tutorial.sections.length}
        </span>

        <Button
          onClick={handleNextSection}
          disabled={currentSectionIndex === tutorial.sections.length - 1}
        >
          Next Section
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}