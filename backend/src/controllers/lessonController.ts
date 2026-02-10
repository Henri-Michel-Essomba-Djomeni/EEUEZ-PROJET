import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all lessons for a course
export const getLessonsByCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    try {
        const [lessons]: any = await pool.execute(
            'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC',
            [courseId]
        );
        res.json(lessons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific lesson by ID
export const getLessonById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [lessons]: any = await pool.execute('SELECT * FROM lessons WHERE id = ?', [id]);
        if (lessons.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(lessons[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new lesson (teacher/admin only)
export const createLesson = async (req: AuthRequest, res: Response) => {
    const { course_id, title, content, video_url, duration, order_index } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
            }
        }

        const [result]: any = await pool.execute(
            'INSERT INTO lessons (course_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
            [course_id, title, content, video_url, duration, order_index]
        );

        res.status(201).json({
            id: result.insertId,
            course_id,
            title,
            content,
            video_url,
            duration,
            order_index
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a lesson (teacher/admin only)
export const updateLesson = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, content, video_url, duration, order_index } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get lesson to verify ownership
        const [lessons]: any = await pool.execute('SELECT course_id FROM lessons WHERE id = ?', [id]);
        if (lessons.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [lessons[0].course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this lesson' });
            }
        }

        await pool.execute(
            'UPDATE lessons SET title = ?, content = ?, video_url = ?, duration = ?, order_index = ? WHERE id = ?',
            [title, content, video_url, duration, order_index, id]
        );

        res.json({ message: 'Lesson updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a lesson (teacher/admin only)
export const deleteLesson = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get lesson to verify ownership
        const [lessons]: any = await pool.execute('SELECT course_id FROM lessons WHERE id = ?', [id]);
        if (lessons.length === 0) return res.status(404).json({ message: 'Lesson not found' });

        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [lessons[0].course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this lesson' });
            }
        }

        await pool.execute('DELETE FROM lessons WHERE id = ?', [id]);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reorder lessons within a course
export const reorderLessons = async (req: AuthRequest, res: Response) => {
    const { course_id, lesson_orders } = req.body; // lesson_orders: [{id, order_index}, ...]

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to reorder lessons in this course' });
            }
        }

        // Update each lesson's order
        for (const lesson of lesson_orders) {
            await pool.execute(
                'UPDATE lessons SET order_index = ? WHERE id = ? AND course_id = ?',
                [lesson.order_index, lesson.id, course_id]
            );
        }

        res.json({ message: 'Lessons reordered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
