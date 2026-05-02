import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { listTransactions, createTransaction } from '../controllers/transactions.controller.js';

const router = Router();
router.use(authRequired);

// Listar transacciones
router.get('/', listTransactions);

// 👇 CREAR nueva transacción
router.post('/', createTransaction);

export default router;
