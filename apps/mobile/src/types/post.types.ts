import { User } from "./auth.types";
import { Motorcycle } from "./motorcycle.types";

export interface Post {
  id: string;
  user_id: string;
  motorcycle_id?: string;
  caption: string;
  photos: string[];
  created_at: string;
  updated_at: string;
  user: User;
  motorcycle?: Motorcycle;
} 