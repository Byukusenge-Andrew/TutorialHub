import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function CreatePostForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const createPostMutation = useMutation({
    mutationFn: api.community.createPost,
    onSuccess: () => {
      toast.success('Post created successfully');
      navigate('/community');
    },
    onError: () => {
      toast.error('Failed to create post');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ title, content, tags });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Write your post content..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={10}
        />
      </div>
      <div>
        <Input
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
        <div className="flex gap-2 mt-2">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="bg-secondary px-2 py-1 rounded text-sm"
              onClick={() => setTags(tags.filter(t => t !== tag))}
            >
              {tag} ×
            </span>
          ))}
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  );
} 