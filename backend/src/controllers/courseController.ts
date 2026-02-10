import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { category, level, search } = req.query;
        let query = 'SELECT * FROM courses WHERE 1=1';
        const params: any[] = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (level) {
            query += ' AND level = ?';
            params.push(level);
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [courses]: any = await pool.execute(query, params);

        // Calculate student count and rating for each course (mocking for now or complex query)
        // For simplicity, we can just return the courses
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [courses]: any = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const course = courses[0];

        // Get lessons
        const [lessons]: any = await pool.execute('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC', [id]);
        course.lessons = lessons;

        // Get quizzes with questions and options
        // This is a simplified fetch. For production, consider a more efficient join or separate endpoints if data is large.
        const [quizzes]: any = await pool.execute('SELECT * FROM quizzes WHERE course_id = ? ORDER BY order_index ASC', [id]);

        for (const quiz of quizzes) {
            const [questions]: any = await pool.execute('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC', [quiz.id]);

            const questionsData = [];
            for (const question of questions) {
                const [options]: any = await pool.execute('SELECT * FROM quiz_question_options WHERE question_id = ? ORDER BY order_index ASC', [question.id]);

                questionsData.push({
                    id: question.id,
                    question_text: question.question_text,
                    options: options.map((o: any) => o.option_text),
                    correctAnswer: options.findIndex((o: any) => o.is_correct),
                    points: question.points
                });
            }

            // Map to new Quiz interface (supporting multiple questions)
            quiz.questions = questionsData;

            // Legacy support for old frontend (optional, can remove if fully switching)
            if (questionsData.length > 0) {
                quiz.question = questionsData[0].question_text;
                quiz.options = questionsData[0].options;
                quiz.correctAnswer = questionsData[0].correctAnswer;
            }
        }

        // Filter out quizzes that don't have questions ? Or keep them empty
        course.quizzes = quizzes;

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
    const { title, description, thumbnail, category, level, duration } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [result]: any = await pool.execute(
            'INSERT INTO courses (title, description, instructor_id, thumbnail, category, level, duration) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, req.user.id, thumbnail, category, level, duration]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, thumbnail, category, level, duration, is_locked } = req.body;

    try {
        await pool.execute(
            'UPDATE courses SET title = ?, description = ?, thumbnail = ?, category = ?, level = ?, duration = ?, is_locked = ? WHERE id = ?',
            [title, description, thumbnail, category, level, duration, is_locked, id]
        );
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        await pool.execute('INSERT IGNORE INTO user_courses (user_id, course_id) VALUES (?, ?)', [req.user.id, id]);
        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [courses]: any = await pool.execute(
            `SELECT c.*, uc.completed, uc.enrolled_at 
       FROM courses c 
       JOIN user_courses uc ON c.id = uc.course_id 
       WHERE uc.user_id = ?`,
            [req.user.id]
        );
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addRating = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        await pool.execute(
            'INSERT INTO course_ratings (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)',
            [req.user.id, id, rating, comment]
        );
        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Only Admin or the Instructor can delete
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Check ownership if not admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this course' });
            }
        }

        await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
