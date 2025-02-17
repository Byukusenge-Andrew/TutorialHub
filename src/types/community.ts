export interface Comment {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
  };
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  status: string;
  data: Post;
}

export interface PostsResponse {
  status: string;
  data: Post[];
} 