export interface User {
    id: string;
    clerk_id: string;
    username: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserDTO {
    clerkId: string;
    username: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
} 