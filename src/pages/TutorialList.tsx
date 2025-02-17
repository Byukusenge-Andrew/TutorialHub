import React, { useState, useEffect } from 'react';
import { TutorialCard } from '../components/TutorialCard';
import { TutorialFilter } from '../components/TutorialFilter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tutorial } from '../types';
import { api } from '@/services/api';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 9;

export function TutorialList() {
  const { data: tutorialsResponse, isLoading } = useQuery({
    queryKey: ['tutorials'],
    queryFn: () => api.tutorials.getAll(),
    select: (data) => data?.data?.tutorials || []
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['tutorial-categories'],
    queryFn: () => api.tutorials.getCategories()
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTutorials = (tutorialsResponse || []).filter((tutorial) => {
    const matchesCategory = !selectedCategory || tutorial.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTutorials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTutorials = filteredTutorials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tutorials</h1>
        <div className="flex gap-4 items-center">
          <TutorialFilter
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
          <Link to="/tutorials/create">
            <Button>Create Tutorial</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          

            {currentTutorials.map((tutorial) => (
              <TutorialCard key={tutorial._id} tutorial={tutorial} />
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tutorials found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}