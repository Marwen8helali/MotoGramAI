import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { SearchHistoryService } from '../services/search-history.service';

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const { q, brand, yearMin, yearMax, sortBy } = req.query;
      const currentUserId = req.auth.userId;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      // Ajout à l'historique
      await SearchHistoryService.addToHistory(currentUserId, q);

      const filters = {
        brand: typeof brand === 'string' ? brand : undefined,
        yearMin: yearMin ? parseInt(yearMin as string) : undefined,
        yearMax: yearMax ? parseInt(yearMax as string) : undefined,
        sortBy: sortBy === 'popular' ? 'popular' : 'recent',
      };

      const results = await SearchService.search(q, currentUserId, filters);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSearchSuggestions(req: Request, res: Response) {
    try {
      const currentUserId = req.auth.userId;
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