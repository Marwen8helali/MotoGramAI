import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Motorcycle } from '../types/motorcycle.types';

export function useMotorcycles(searchQuery?: string, userId?: string) {
  const { getToken } = useAuth();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const token = await getToken();
        let url = `${Constants.expoConfig?.extra?.apiUrl}/api/motorcycles`;
        
        if (userId) {
          url += `/${userId}`;
        }
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des motos');
        }

        const data = await response.json();
        setMotorcycles(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycles();
  }, [searchQuery, userId]);

  return { motorcycles, isLoading, error };
} 