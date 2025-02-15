import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Post } from '../types/post.types';

export function usePost(id: string) {
  const { getToken } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${Constants.expoConfig?.extra?.apiUrl}/api/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du post');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, isLoading, error };
} 