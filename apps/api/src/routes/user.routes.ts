import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { validateCreateUser } from '../middlewares/validation.middleware';

const router = Router();

// Route publique pour la création d'utilisateur
router.post('/', validateCreateUser, UserController.createUser);

// Routes protégées
router.get('/:clerkId', ClerkExpressRequireAuth(), UserController.getUserProfile);

export default router; 