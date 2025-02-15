import dotenv from 'dotenv';
import path from 'path';

// Configuration de l'environnement de test
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.CLERK_SECRET_KEY = 'test-clerk-key';

// Charger les variables d'environnement de test
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// Mock global de Supabase
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
        })),
    };
}); 