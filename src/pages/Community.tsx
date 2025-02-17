import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PostCard } from '@/components/community/PostCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export function Community() {
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.community.getPosts()
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 mb-4" />
        ))}
      </div>
    );
  }

  const posts = postsResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        <Link to="/community/post/create">
          <Button>Create Post</Button>
        </Link>
      </div>
      <div>
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post}
          />
        ))}
      </div>
    </div>
  );
} 