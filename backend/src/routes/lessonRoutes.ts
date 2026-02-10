import express from 'express';
import {
    getLessonsByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons
} from '../controllers/lessonController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);

// Protected routes (teacher/admin only)
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), createLesson);
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), updateLesson);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), deleteLesson);
router.put('/reorder/course', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), reorderLessons);

export default router;
