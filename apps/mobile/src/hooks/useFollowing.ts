import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { UserWithFollowStats } from '../types/follow.types';

export function useFollowing(userId: string) {
  const { getToken } = useAuth();
  const [following, setFollowing] = useState<UserWithFollowStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFollowing = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/users/${userId}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des abonnements');
      }

      const data = await response.json();
      setFollowing(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFollowing = (followingId: string, isFollowing: boolean) => {
    if (!isFollowing) {
      // Si on se désabonne, on retire l'utilisateur de la liste
      setFollowing(prev => prev.filter(user => user.id !== followingId));
    } else {
      // Mise à jour du statut de suivi
      setFollowing(prev =>
        prev.map(user =>
          user.id === followingId
            ? { ...user, is_following: true }
            : user
        )
      );
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  return {
    following,
    isLoading,
    error,
    refresh: fetchFollowing,
    updateFollowing,
  };
} 