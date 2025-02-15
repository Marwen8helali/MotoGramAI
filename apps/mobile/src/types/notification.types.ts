import { User } from './auth.types';
import { Post } from './post.types';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

export interface Notification {
  id: string;
  type: NotificationType;
  user_id: string;
  target_user_id: string;
  post_id?: string;
  comment_id?: string;
  read: boolean;
  created_at: string;
  user: User;
  post?: Post;
} 