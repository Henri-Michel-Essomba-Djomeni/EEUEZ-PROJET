import express from 'express';
import {
    getQuizzesByCourse,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getQuizSubmissions,
    getMySubmissions
} from '../controllers/evaluationController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/:id', getQuizById);

// Student routes (authenticated)
router.post('/:id/submit', authenticateToken, submitQuiz);
router.get('/my-submissions/all', authenticateToken, getMySubmissions);

// Teacher/Admin routes
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), createQuiz);
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), updateQuiz);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), deleteQuiz);
router.get('/:id/submissions', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), getQuizSubmissions);

export default router;
