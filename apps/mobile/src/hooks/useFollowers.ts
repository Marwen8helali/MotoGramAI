import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { UserWithFollowStats } from '../types/follow.types';

export function useFollowers(userId: string) {
  const { getToken } = useAuth();
  const [followers, setFollowers] = useState<UserWithFollowStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFollowers = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/users/${userId}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des abonnés');
      }

      const data = await response.json();
      setFollowers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFollower = (followerId: string, isFollowing: boolean) => {
    setFollowers(prev =>
      prev.map(follower =>
        follower.id === followerId
          ? { ...follower, is_following: isFollowing }
          : follower
      )
    );
  };

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  return {
    followers,
    isLoading,
    error,
    refresh: fetchFollowers,
    updateFollower,
  };
} 