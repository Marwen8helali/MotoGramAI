import { User } from './auth.types';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: User;
  following?: User;
}

export interface UserWithFollowStats extends User {
  followers_count: number;
  following_count: number;
  is_following: boolean;
} 