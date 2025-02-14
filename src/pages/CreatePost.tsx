import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';


export function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const availableTags = ['question', 'discussion', 'showcase', 'help'];

  const createPostMutation = useMutation({
    mutationFn: (postData: { title: string; content: string; tags: string[] }) =>
      api.community.createPost(postData),
    onSuccess: () => {
      navigate('/community');
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to create post');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
      return;
    }
    createPostMutation.mutate({ title, content, tags: selectedTags });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
            placeholder="Enter your post title"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-border rounded-md bg-background resize-none"
            placeholder="Write your post content..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Button
                key={tag}
                type="button"
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => toggleTag(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={createPostMutation.isPending}
            className="w-full"
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/community')}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 