import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, SearchController.search);
router.get('/suggestions', authMiddleware, SearchController.getSearchSuggestions);

export default router; 