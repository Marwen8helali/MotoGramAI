import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { SearchHistoryService } from '../services/search-history.service';
import { AuthObject } from '@clerk/clerk-sdk-node';

interface AuthenticatedRequest extends Request {
  auth?: AuthObject;
}

// Définition du type SearchFilters pour correspondre au service
interface SearchFilters {
  brand?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy?: 'popular' | 'recent';
}

export class SearchController {
  static async search(req: AuthenticatedRequest, res: Response) {
    try {
      const { q, brand, yearMin, yearMax, sortBy } = req.query;
      const currentUserId = req.auth?.userId;

      if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      // Ajout à l'historique
      await SearchHistoryService.addToHistory(currentUserId, q);

      const filters: SearchFilters = {
        brand: typeof brand === 'string' ? brand : undefined,
        yearMin: yearMin ? parseInt(yearMin as string) : undefined,
        yearMax: yearMax ? parseInt(yearMax as string) : undefined,
        sortBy: sortBy === 'popular' || sortBy === 'recent' ? (sortBy as 'popular' | 'recent') : 'recent'
      };

      const results = await SearchService.search(q, currentUserId, filters);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSearchSuggestions(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUserId = req.auth?.userId;

      if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const [userHistory, popularSearches] = await Promise.all([
        SearchHistoryService.getUserSearchHistory(currentUserId),
        SearchHistoryService.getPopularSearches(),
      ]);

      res.json({
        history: userHistory,
        popular: popularSearches,
      });
    } catch (error) {
      console.error('Search suggestions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
