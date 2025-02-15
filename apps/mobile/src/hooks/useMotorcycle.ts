import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Motorcycle } from '../types/motorcycle.types';

export function useMotorcycle(id: string) {
  const { getToken } = useAuth();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${Constants.expoConfig?.extra?.apiUrl}/api/motorcycles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la moto');
        }

        const data = await response.json();
        setMotorcycle(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycle();
  }, [id]);

  return { motorcycle, isLoading, error };
} 