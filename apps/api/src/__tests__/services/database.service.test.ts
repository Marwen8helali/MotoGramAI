import { DatabaseService } from '../../services/database.service';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('DatabaseService', () => {
    let dbService: DatabaseService;

    beforeEach(() => {
        // Réinitialiser les mocks
        jest.clearAllMocks();
        DatabaseService.resetInstance();
        dbService = new DatabaseService('http://localhost:54321', 'test-key');
    });

    describe('createUser', () => {
        it('devrait créer un utilisateur avec succès', async () => {
            const mockUser = {
                id: 'test_id',
                clerk_id: 'test_clerk_id',
                username: 'testuser',
                email: 'test@example.com',
                created_at: new Date(),
                updated_at: new Date()
            };

            const mockSupabase = dbService.getClient();
            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: mockUser, error: null })
                    })
                })
            });

            const result = await dbService.createUser('test_clerk_id', {
                username: 'testuser',
                email: 'test@example.com'
            });

            expect(result).toEqual(mockUser);
            expect(mockSupabase.from).toHaveBeenCalledWith('users');
        });

        it('devrait gérer les erreurs de création', async () => {
            const mockError = new Error('Erreur de base de données');
            const mockSupabase = dbService.getClient();
            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: null, error: mockError })
                    })
                })
            });

            await expect(dbService.createUser('test_clerk_id', {
                username: 'testuser',
                email: 'test@example.com'
            })).rejects.toThrow();
        });
    });
}); 