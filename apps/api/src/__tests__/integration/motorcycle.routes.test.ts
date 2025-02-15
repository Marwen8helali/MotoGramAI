import request from 'supertest';
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import motorcycleRoutes from '../../routes/motorcycle.routes';
import { dbService } from '../../services/database.service';

jest.mock('@clerk/clerk-sdk-node', () => ({
    ClerkExpressRequireAuth: () => (req: any, res: any, next: any) => next()
}));

jest.mock('../../services/database.service');

const app = express();
app.use(express.json());
app.use('/api/motorcycles', motorcycleRoutes);

describe('Motorcycle Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/motorcycles/:userId', () => {
        it('devrait créer une nouvelle moto', async () => {
            const testDate = new Date('2025-02-14T14:10:43.717Z');
            const motoData = {
                brand: 'Yamaha',
                model: 'MT-07',
                year: 2023,
                specs: {
                    power: '74hp',
                    weight: '184kg'
                }
            };

            const mockMoto = {
                id: 'test_uuid',
                user_id: 'test_user_id',
                ...motoData,
                created_at: testDate.toISOString(),
                updated_at: testDate.toISOString()
            };

            (dbService.createMotorcycle as jest.Mock).mockResolvedValueOnce({
                ...mockMoto,
                created_at: testDate,
                updated_at: testDate
            });

            const response = await request(app)
                .post('/api/motorcycles/test_user_id')
                .send(motoData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockMoto);
        });

        it('devrait retourner une erreur 400 pour des données invalides', async () => {
            const response = await request(app)
                .post('/api/motorcycles/test_user_id')
                .send({
                    brand: 'Yamaha'
                    // model manquant
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/motorcycles/:userId', () => {
        it('devrait retourner les motos de l\'utilisateur', async () => {
            const testDate = new Date('2025-02-14T14:10:43.764Z');
            const mockMotos = [
                {
                    id: 'moto1',
                    user_id: 'test_user_id',
                    brand: 'Yamaha',
                    model: 'MT-07',
                    created_at: testDate.toISOString(),
                    updated_at: testDate.toISOString()
                },
                {
                    id: 'moto2',
                    user_id: 'test_user_id',
                    brand: 'Honda',
                    model: 'CB650R',
                    created_at: testDate.toISOString(),
                    updated_at: testDate.toISOString()
                }
            ];

            (dbService.getUserMotorcycles as jest.Mock).mockResolvedValueOnce(
                mockMotos.map(moto => ({
                    ...moto,
                    created_at: new Date(moto.created_at),
                    updated_at: new Date(moto.updated_at)
                }))
            );

            const response = await request(app)
                .get('/api/motorcycles/test_user_id');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMotos);
        });
    });
}); 