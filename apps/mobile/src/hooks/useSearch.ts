import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { UserWithFollowStats } from '../types/follow.types';
import { Motorcycle } from '../types/motorcycle.types';

interface SearchFilters {
  brand?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy?: 'recent' | 'popular';
}

interface SearchResults {
  users: UserWithFollowStats[];
  motorcycles: Motorcycle[];
}

interface SearchSuggestion {
  query: string;
  count?: number;
}

interface SearchSuggestions {
  history: SearchSuggestion[];
  popular: SearchSuggestion[];
}

export function useSearch() {
  const { getToken } = useAuth();
  const [results, setResults] = useState<SearchResults>({ users: [], motorcycles: [] });
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ history: [], popular: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setResults({ users: [], motorcycles: [] });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();
      const queryParams = new URLSearchParams({
        q: query,
        ...(filters?.brand && { brand: filters.brand }),
        ...(filters?.yearMin && { yearMin: filters.yearMin.toString() }),
        ...(filters?.yearMax && { yearMax: filters.yearMax.toString() }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
      });

      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/search?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/search/suggestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  }, []);

  return {
    results,
    suggestions,
    isLoading,
    error,
    search,
    fetchSuggestions,
  };
} 