import { Router } from 'express';
import { authRequired } from '../middlewares/auth.middleware.js';
import { changePassword, getMe, updateMe } from '../controllers/users.controller.js';

const router = Router();
router.use(authRequired);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changePassword);

export default router;
