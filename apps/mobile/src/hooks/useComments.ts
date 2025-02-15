import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Comment } from '../types/comment.types';

export function useComments(postId: string) {
  const { getToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/posts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commentaires');
      }

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    refresh: fetchComments,
  };
} 