import request from 'supertest';
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import userRoutes from '../../routes/user.routes';
import { dbService } from '../../services/database.service';

jest.mock('@clerk/clerk-sdk-node', () => ({
    ClerkExpressRequireAuth: () => (req: any, res: any, next: any) => next()
}));

jest.mock('../../services/database.service');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const testDate = new Date('2025-02-14T14:10:43.735Z');
            const userData = {
                clerkId: 'test_clerk_id',
                username: 'testuser',
                email: 'test@example.com',
                fullName: 'Test User'
            };

            const mockUser = {
                id: 'test_uuid',
                clerk_id: userData.clerkId,
                username: userData.username,
                email: userData.email,
                full_name: userData.fullName,
                created_at: testDate.toISOString(),
                updated_at: testDate.toISOString()
            };

            (dbService.createUser as jest.Mock).mockResolvedValueOnce({
                ...mockUser,
                created_at: testDate,
                updated_at: testDate
            });

            const response = await request(app)
                .post('/api/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockUser);
        });

        it('devrait retourner une erreur 400 pour des données invalides', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({
                    clerkId: 'test_clerk_id'
                    // username et email manquants
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/users/:clerkId', () => {
        it('devrait retourner le profil utilisateur', async () => {
            const testDate = new Date('2025-02-14T14:10:43.776Z');
            const mockUser = {
                id: 'test_uuid',
                clerk_id: 'test_clerk_id',
                username: 'testuser',
                email: 'test@example.com',
                created_at: testDate.toISOString(),
                updated_at: testDate.toISOString()
            };

            (dbService.getUserByClerkId as jest.Mock).mockResolvedValueOnce({
                ...mockUser,
                created_at: testDate,
                updated_at: testDate
            });

            const response = await request(app)
                .get('/api/users/test_clerk_id');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it('devrait retourner 404 pour un utilisateur inexistant', async () => {
            (dbService.getUserByClerkId as jest.Mock).mockResolvedValueOnce(null);

            const response = await request(app)
                .get('/api/users/nonexistent_id');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });
}); 