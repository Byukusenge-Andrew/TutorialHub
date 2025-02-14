import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ThumbsUp, User, ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

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

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => api.community.getPost(id!) as Promise<Post>
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => api.community.addComment(id!, content) as Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setNewComment('');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: () => api.community.likePost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    }
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/community"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Link>

      <article className="bg-card rounded-lg p-6 shadow-md border border-border mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.authorId.name}</span>
          </div>
          <span>•</span>
          <time>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</time>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-6">
          {post.content}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => likePostMutation.mutate()}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes}</span>
            </Button>
          )}
        </div>
      </article>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Comments ({post.comments.length})</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitComment} className="flex gap-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background"
            />
            <Button
              type="submit"
              disabled={addCommentMutation.isPending || !newComment.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-card/50 rounded-lg p-4 border border-border"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                <span>{comment.authorId.name}</span>
                <span>•</span>
                <time>{formatDistanceToNow(new Date(comment.createdAt))} ago</time>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 