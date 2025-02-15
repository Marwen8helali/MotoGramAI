export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostWithLikes extends Post {
  likes: Like[];
  likes_count: number;
  is_liked: boolean;
} 