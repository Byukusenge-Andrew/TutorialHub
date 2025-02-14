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
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
}

export interface PostResponse {
  status: string;
  data: Post;
}

export interface PostsResponse {
  status: string;
  data: Post[];
} 