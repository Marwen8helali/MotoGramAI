import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

export function useLikes(postId: string) {
  const { getToken } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleLike = async (currentLikeStatus: boolean) => {
    try {
      setIsLiking(true);
      const token = await getToken();
      
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/posts/${postId}/like`,
        {
          method: currentLikeStatus ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la gestion du like');
      }

      return !currentLikeStatus;
    } catch (err) {
      setError(err as Error);
      return currentLikeStatus;
    } finally {
      setIsLiking(false);
    }
  };

  return {
    toggleLike,
    isLiking,
    error,
  };
} 