import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUserProgress = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [progress]: any = await pool.execute(
            `SELECT c.id as courseId, c.title, COUNT(up.lesson_id) as completedLessons, 
       (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as totalLessons
       FROM user_progress up
       JOIN courses c ON up.course_id = c.id
       WHERE up.user_id = ?
       GROUP BY c.id`,
            [req.user.id]
        );
        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCourseProgress = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [progress]: any = await pool.execute(
            'SELECT lesson_id, completed, last_accessed FROM user_progress WHERE user_id = ? AND course_id = ?',
            [req.user.id, courseId]
        );
        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateModuleCompletion = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const { moduleIndex, timeSpent } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Find lesson ID by index (assuming order_index is used)
        const [lessons]: any = await pool.execute(
            'SELECT id FROM lessons WHERE course_id = ? AND order_index = ?',
            [courseId, moduleIndex]
        );

        if (lessons.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const lessonId = lessons[0].id;

        await pool.execute(
            `INSERT INTO user_progress (user_id, course_id, lesson_id, completed) 
       VALUES (?, ?, ?, TRUE) 
       ON DUPLICATE KEY UPDATE completed = TRUE, last_accessed = CURRENT_TIMESTAMP`,
            [req.user.id, courseId, lessonId]
        );

        res.json({ message: 'Progress updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const submitEvaluation = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const { answers } = req.body;

    // Evaluation logic would go here. For now, just logging it.
    console.log(`User ${req.user?.id} submitted evaluation for course ${courseId}:`, answers);

    res.json({ message: 'Evaluation submitted successfully', passed: true, score: 100 });
};
