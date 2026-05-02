import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { createTransaction, listTransactions } from '../controllers/transactions.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', listTransactions);
router.post('/', createTransaction);

export default router;
