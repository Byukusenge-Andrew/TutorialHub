import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { CommentList } from '@/components/community/CommentList';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => api.community.getPost(id!)
  });

  const commentMutation = useMutation({
    mutationFn: () => api.community.addComment(id!, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setComment('');
      toast.success('Comment added');
    }
  });

  if (isLoading || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-32 mb-8" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{post.data.title}</h1>
      <p className="text-muted-foreground mb-8">
        Posted by {post.data.authorId.name} • {formatDistanceToNow(new Date(post.data.createdAt))} ago
      </p>
      <div className="prose max-w-none mb-8">
        {post.data.content}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="space-y-4">
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button 
            onClick={() => commentMutation.mutate()}
            disabled={commentMutation.isPending || !comment.trim()}
          >
            {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
        <CommentList comments={post.data.comments} />
      </div>
    </div>
  );
} 