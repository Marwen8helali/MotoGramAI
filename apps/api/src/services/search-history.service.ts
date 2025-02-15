import { db } from './database.service';

export class SearchHistoryService {
  static async addToHistory(userId: string, query: string) {
    await db.query(
      `INSERT INTO search_history (user_id, query)
       VALUES ($1, $2)
       ON CONFLICT (user_id, query) 
       DO UPDATE SET created_at = NOW()`,
      [userId, query]
    );
  }

  static async getPopularSearches() {
    const result = await db.query(
      `SELECT query, COUNT(*) as count
       FROM search_history
       WHERE created_at > NOW() - INTERVAL '7 days'
       GROUP BY query
       ORDER BY count DESC
       LIMIT 5`
    );
    return result.rows;
  }

  static async getUserSearchHistory(userId: string) {
    const result = await db.query(
      `SELECT DISTINCT query
       FROM search_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );
    return result.rows;
  }
} 