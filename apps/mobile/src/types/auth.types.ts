export interface User {
    id: string;
    clerk_id: string;
    username: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    isLoading: boolean;
    isSignedIn: boolean;
    user: User | null;
} 