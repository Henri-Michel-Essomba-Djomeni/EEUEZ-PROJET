import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { getUsers, createUser, deleteUser } from '../controllers/userController';

const router = express.Router();

// All routes are protected and for Admin only usually
router.use(authenticateToken);
router.use(authorizeRole(['ADMIN']));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;
