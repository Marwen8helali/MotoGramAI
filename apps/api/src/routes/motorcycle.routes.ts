import { Router } from 'express';
import { MotorcycleController } from '../controllers/motorcycle.controller';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { validateCreateMotorcycle } from '../middlewares/validation.middleware';

const router = Router();

// Toutes les routes de motos nécessitent une authentification
router.use(ClerkExpressRequireAuth());

router.post('/:userId', validateCreateMotorcycle, MotorcycleController.createMotorcycle);
router.get('/:userId', MotorcycleController.getUserMotorcycles);

export default router; 