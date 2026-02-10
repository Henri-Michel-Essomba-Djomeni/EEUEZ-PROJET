import express from 'express';
import {
    getUserProgress,
    getCourseProgress,
    updateModuleCompletion,
    submitEvaluation
} from '../controllers/progressController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken); // All progress routes require auth

router.get('/all', getUserProgress);
router.get('/:courseId', getCourseProgress);
router.put('/:courseId/module', updateModuleCompletion);
router.post('/:courseId/evaluation', submitEvaluation);

export default router;
