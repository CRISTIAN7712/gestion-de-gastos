import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { createCategory, listCategories } from '../controllers/categories.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', listCategories);
router.post('/', createCategory);

export default router;
