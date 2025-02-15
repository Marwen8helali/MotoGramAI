import { db } from './database.service';
import { User } from '../types/user.types';
import { Motorcycle } from '../types/motorcycle.types';

interface SearchFilters {
  brand?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy?: 'recent' | 'popular';
}

export class SearchService {
  static async search(query: string, currentUserId: string, filters?: SearchFilters) {
    const searchTerm = `%${query}%`;
    const params: any[] = [searchTerm, currentUserId];
    let paramCount = 3;

    // Construction de la requête pour les motos avec filtres
    let motorcycleQuery = `
      SELECT 
        m.*,
        u.username,
        u.avatar_url,
        COUNT(DISTINCT l.id) as likes_count
      FROM motorcycles m
      JOIN users u ON u.id = m.user_id
      LEFT JOIN likes l ON l.post_id = m.id
      WHERE (m.brand ILIKE $1 OR m.model ILIKE $1)
    `;

    if (filters?.brand) {
      motorcycleQuery += ` AND m.brand = $${paramCount}`;
      params.push(filters.brand);
      paramCount++;
    }

    if (filters?.yearMin) {
      motorcycleQuery += ` AND m.year >= $${paramCount}`;
      params.push(filters.yearMin);
      paramCount++;
    }

    if (filters?.yearMax) {
      motorcycleQuery += ` AND m.year <= $${paramCount}`;
      params.push(filters.yearMax);
      paramCount++;
    }

    motorcycleQuery += ` GROUP BY m.id, u.username, u.avatar_url`;

    if (filters?.sortBy === 'popular') {
      motorcycleQuery += ` ORDER BY likes_count DESC`;
    } else {
      motorcycleQuery += ` ORDER BY m.created_at DESC`;
    }

    motorcycleQuery += ` LIMIT 10`;

    // Exécution des requêtes
    const [users, motorcycles] = await Promise.all([
      db.query<User>(
        `SELECT 
          u.*,
          COUNT(DISTINCT f1.id) as followers_count,
          COUNT(DISTINCT f2.id) as following_count,
          EXISTS(
            SELECT 1 FROM follows 
            WHERE follower_id = $2 AND following_id = u.id
          ) as is_following
        FROM users u
        LEFT JOIN follows f1 ON f1.following_id = u.id
        LEFT JOIN follows f2 ON f2.follower_id = u.id
        WHERE 
          (u.username ILIKE $1 OR u.full_name ILIKE $1)
          AND u.id != $2
        GROUP BY u.id
        LIMIT 10`,
        [searchTerm, currentUserId]
      ),
      db.query<Motorcycle>(motorcycleQuery, params)
    ]);

    return {
      users: users.rows,
      motorcycles: motorcycles.rows,
    };
  }
} 