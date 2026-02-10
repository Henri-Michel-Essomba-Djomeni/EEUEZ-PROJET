import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getEnrolledCourses,
    addRating
} from '../controllers/courseController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/enrolled/my-courses', authenticateToken, getEnrolledCourses); // Specific route before :id
router.get('/:id', getCourseById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), createCourse);
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), deleteCourse);
router.post('/:id/enroll', authenticateToken, enrollInCourse);
router.post('/:id/rating', authenticateToken, addRating);

export default router;
