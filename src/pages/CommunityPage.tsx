import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Heart, MessageCircle } from 'lucide-react';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
  };
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
}

export function CommunityPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: () => api.community.getPosts()
  });

  const posts = response?.data;

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
        <Button asChild>
          <Link to="/community/create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {posts?.map((post) => (
          <Link
            key={post._id}
            to={`/community/post/${post._id}`}
            className="block bg-card hover:bg-card/80 rounded-lg p-6 transition-all duration-200 border border-border"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-muted-foreground line-clamp-2">{post.content}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments.length} comments
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.likes} likes
                </span>
                <span>Posted by {post.authorId.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
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

      {posts?.length === 0 && (
        <div className="text-center py-10">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
} 