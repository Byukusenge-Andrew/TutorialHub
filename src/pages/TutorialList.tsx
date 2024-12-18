import React, { useState, useEffect } from 'react';
import { TutorialCard } from '../components/TutorialCard';
import { TutorialFilter } from '../components/TutorialFilter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Tutorial } from '../types';
import { api } from '@/services/api';

const ITEMS_PER_PAGE = 9;

export function TutorialList() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tutorialsResponse, categoriesData] = await Promise.all([
        api.tutorials.getAll(), // Ensure this returns the full response object
        api.tutorials.getCategories()
      ]);
  
      // Extract tutorials from the response
      const tutorialsData = tutorialsResponse.data.tutorials;
  
      setTutorials(Array.isArray(tutorialsData) ? tutorialsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      console.log('Tutorials in frontend:', tutorialsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load tutorials');
      setTutorials([]); // Set empty array on error
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const filteredTutorials = tutorials.filter((tutorial) => {
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
  console.log(tutorials)
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tutorials</h1>
        <TutorialFilter
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
        
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
          <Button>
            <a href="/tutorials/create" className="flex items-center gap-2">
              <span>New Tutorial</span>
            </a>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentTutorials.map((tutorial) => (
              <TutorialCard key={tutorial._id} tutorial={tutorial} />
            ))}
          </div>

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

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tutorials found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}