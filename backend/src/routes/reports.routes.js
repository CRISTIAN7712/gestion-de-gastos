import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { getSummary } from '../controllers/reports.controller.js';

const router = Router();
router.get('/summary', authRequired, getSummary);
export default router;
