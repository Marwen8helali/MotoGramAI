import { User } from './auth.types';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface CreateCommentDTO {
  content: string;
} 