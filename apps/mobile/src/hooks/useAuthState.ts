import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { AuthState } from '../types/auth.types';

export function useAuthState() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isSignedIn: false,
    user: null,
  });

  useEffect(() => {
    if (!isLoaded) return;

    setState({
      isLoading: false,
      isSignedIn: isSignedIn || false,
      user: clerkUser ? {
        id: clerkUser.id,
        clerk_id: clerkUser.id,
        username: clerkUser.username || '',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        full_name: clerkUser.fullName || undefined,
        avatar_url: clerkUser.imageUrl || undefined,
        created_at: clerkUser.createdAt,
        updated_at: new Date().toISOString(),
      } : null,
    });
  }, [isLoaded, isSignedIn, clerkUser]);

  return state;
} 