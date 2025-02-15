import { Request, Response } from 'express';
import { UserController } from '../../controllers/user.controller';
import { dbService } from '../../services/database.service';

jest.mock('../../services/database.service');

describe('UserController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRequest = {};
        mockResponse = {
            status: mockStatus,
            json: mockJson
        };
    });

    describe('createUser', () => {
        it('devrait créer un utilisateur avec succès', async () => {
            const userData = {
                clerkId: 'test_clerk_id',
                username: 'testuser',
                email: 'test@example.com'
            };

            mockRequest.body = userData;

            const mockUser = {
                id: 'test_id',
                ...userData,
                created_at: new Date(),
                updated_at: new Date()
            };

            (dbService.createUser as jest.Mock).mockResolvedValueOnce(mockUser);

            await UserController.createUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockUser);
        });

        it('devrait retourner une erreur 400 si les données sont invalides', async () => {
            mockRequest.body = {
                clerkId: 'test_clerk_id'
                // username et email manquants
            };

            await UserController.createUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Les champs clerkId, username et email sont requis'
            });
        });
    });
}); 