import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

export function useFollow(userId: string) {
  const { getToken } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleFollow = async (currentFollowStatus: boolean) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/users/${userId}/follow`,
        {
          method: currentFollowStatus ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la gestion du suivi');
      }

      setIsFollowing(!currentFollowStatus);
      return !currentFollowStatus;
    } catch (err) {
      setError(err as Error);
      return currentFollowStatus;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    isLoading,
    error,
    toggleFollow,
  };
} 