import { Post } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{post.authorId.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">
              Posted by {post.authorId.name} • {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{post.content}</p>
        <div className="flex gap-2 mt-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-secondary px-2 py-1 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onLike?.(post._id)}
          >
            ❤️ {post.likes}
          </Button>
          <Button variant="ghost" size="sm">
            💬 {post.comments.length}
          </Button>
        </div>
        <Link to={`/community/post/${post._id}`}>
          <Button variant="outline" size="sm">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 