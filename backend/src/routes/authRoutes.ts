import express from 'express';
import { register, login, getMe, updateSubscription } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/subscription', authenticateToken, updateSubscription);

export default router;
