import { CreatePostForm } from '@/components/community/CreatePostForm';

export function CreatePostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Post</h1>
      <CreatePostForm />
    </div>
  );
} 