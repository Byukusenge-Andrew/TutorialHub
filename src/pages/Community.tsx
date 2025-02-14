import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MessageSquare, ThumbsUp, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
}

export function Community() {
  const { isAuthenticated } = useAuthStore();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['community-posts'],
    queryFn: () => api.community.getPosts() as Promise<Post[]>
  });

  const tags = ['all', 'question', 'discussion', 'showcase', 'help'];

  const filteredPosts = posts?.filter(post => {
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        {isAuthenticated && (
          <Button asChild>
            <Link to="/community/post/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(tag)}
              className="whitespace-nowrap"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts?.map((post) => (
          <Link
            key={post._id}
            to={`/community/post/${post._id}`}
            className="block bg-card hover:bg-card/80 rounded-lg p-6 shadow-md transition-all duration-200 border border-border"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.authorId.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  );
} 