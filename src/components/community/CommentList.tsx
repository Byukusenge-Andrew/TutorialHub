import { Comment } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment._id} className="flex gap-4 p-4 bg-card rounded-lg">
          <Avatar>
            <AvatarFallback>{comment.authorId.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.authorId.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <p className="mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 