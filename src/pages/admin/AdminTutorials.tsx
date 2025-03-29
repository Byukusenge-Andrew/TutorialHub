import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tutorial } from '@/types';
import { Button } from '@/components/ui/button';

export function AdminTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ['tutorials'],
    queryFn: () => api.tutorials.getAll(),
  });
  
  useEffect(() => {
    if (data && data.data && data.data.tutorials) {
      setTutorials(data.data.tutorials);
    }
  }, [data]);
  
  const handleDeleteTutorial = async (tutorialId: string) => {
    await api.tutorials.delete(tutorialId);
    window.location.reload();
  };
   
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No tutorials found</div>;
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tutorial Management</h1>
        <Link
          to="/admin/tutorials/create"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Tutorial
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xl font-medium">Title</th>
                <th className="px-6 py-3 text-left text-xl font-medium">Author</th>
                <th className="px-6 py-3 text-left text-xl font-medium">Category</th>
                <th className="px-6 py-3 text-left text-xl font-medium">Created</th>
                <th className="px-6 py-3 text-left text-xl font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tutorials.map((tutorial: any) => (
                <tr key={tutorial._id || tutorial.id}>
                  <td className="px-6 py-4">{tutorial.title}</td>
                  <td className="px-6 py-4">
                    {tutorial.authorId?.name || 
                     (typeof tutorial.authorId === 'string' ? tutorial.authorId : 'Unknown')}
                  </td>
                  <td className="px-6 py-4">{tutorial.category}</td>
                  <td className="px-6 py-4">
                    {tutorial.createdAt ? new Date(tutorial.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Button className="text-blue-500 hover:text-blue-700"
                      variant="destructive"
                      size="sm"
                      title="Edit Tutorial"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                      variant="destructive"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      title='Delete Tutorial'
                      onClick={() => handleDeleteTutorial(tutorial._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 