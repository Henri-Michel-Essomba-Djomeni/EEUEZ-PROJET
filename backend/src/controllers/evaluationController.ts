import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all quizzes for a course
export const getQuizzesByCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    try {
        const [quizzes]: any = await pool.execute(
            'SELECT * FROM quizzes WHERE course_id = ? ORDER BY order_index ASC',
            [courseId]
        );
        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get quiz by ID with questions and options
export const getQuizById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Get quiz details
        const [quizzes]: any = await pool.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
        if (quizzes.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const quiz = quizzes[0];

        // Get questions for this quiz
        const [questions]: any = await pool.execute(
            'SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC',
            [id]
        );

        // Get options for each question
        for (const question of questions) {
            const [options]: any = await pool.execute(
                'SELECT id, option_text, order_index FROM quiz_question_options WHERE question_id = ? ORDER BY order_index ASC',
                [question.id]
            );
            question.options = options;
        }

        quiz.questions = questions;
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new quiz (teacher/admin only)
export const createQuiz = async (req: AuthRequest, res: Response) => {
    const { course_id, title, description, passing_score, duration_minutes, order_index, questions } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to add quizzes to this course' });
            }
        }

        // Create quiz
        const [quizResult]: any = await pool.execute(
            'INSERT INTO quizzes (course_id, title, description, passing_score, duration_minutes, order_index) VALUES (?, ?, ?, ?, ?, ?)',
            [course_id, title, description, passing_score, duration_minutes, order_index]
        );

        const quizId = quizResult.insertId;

        // Create questions if provided
        if (questions && questions.length > 0) {
            for (const question of questions) {
                const [questionResult]: any = await pool.execute(
                    'INSERT INTO quiz_questions (quiz_id, question_text, question_type, points, order_index) VALUES (?, ?, ?, ?, ?)',
                    [quizId, question.question_text, question.question_type, question.points || 1, question.order_index]
                );

                const questionId = questionResult.insertId;

                // Create options for multiple choice or true/false questions
                if (question.options && question.options.length > 0) {
                    for (const option of question.options) {
                        await pool.execute(
                            'INSERT INTO quiz_question_options (question_id, option_text, is_correct, order_index) VALUES (?, ?, ?, ?)',
                            [questionId, option.option_text, option.is_correct || false, option.order_index]
                        );
                    }
                }
            }
        }

        res.status(201).json({
            id: quizId,
            course_id,
            title,
            description,
            passing_score,
            duration_minutes,
            order_index
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a quiz (teacher/admin only)
export const updateQuiz = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, passing_score, duration_minutes, order_index } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get quiz to verify ownership
        const [quizzes]: any = await pool.execute('SELECT course_id FROM quizzes WHERE id = ?', [id]);
        if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });

        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [quizzes[0].course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this quiz' });
            }
        }

        await pool.execute(
            'UPDATE quizzes SET title = ?, description = ?, passing_score = ?, duration_minutes = ?, order_index = ? WHERE id = ?',
            [title, description, passing_score, duration_minutes, order_index, id]
        );

        res.json({ message: 'Quiz updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a quiz (teacher/admin only)
export const deleteQuiz = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get quiz to verify ownership
        const [quizzes]: any = await pool.execute('SELECT course_id FROM quizzes WHERE id = ?', [id]);
        if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });

        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [quizzes[0].course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this quiz' });
            }
        }

        await pool.execute('DELETE FROM quizzes WHERE id = ?', [id]);
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit quiz answers and calculate score
export const submitQuiz = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // quiz_id
    const { answers } = req.body; // answers: [{question_id, selected_option_id?, answer_text?}, ...]

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get quiz details
        const [quizzes]: any = await pool.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
        if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });
        const quiz = quizzes[0];

        // Get all questions with correct answers
        const [questions]: any = await pool.execute(
            'SELECT * FROM quiz_questions WHERE quiz_id = ?',
            [id]
        );

        let totalScore = 0;
        let maxScore = 0;

        // Create submission
        const [submissionResult]: any = await pool.execute(
            'INSERT INTO quiz_submissions (user_id, quiz_id, score, max_score, passed) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, id, 0, 0, false] // Will update after calculating
        );

        const submissionId = submissionResult.insertId;

        // Process each answer
        for (const question of questions) {
            maxScore += question.points;
            const userAnswer = answers.find((a: any) => a.question_id === question.id);

            if (!userAnswer) {
                // No answer provided
                await pool.execute(
                    'INSERT INTO quiz_answers (submission_id, question_id, is_correct, points_earned) VALUES (?, ?, ?, ?)',
                    [submissionId, question.id, false, 0]
                );
                continue;
            }

            let isCorrect = false;
            let pointsEarned = 0;

            if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
                // Check if selected option is correct
                const [options]: any = await pool.execute(
                    'SELECT is_correct FROM quiz_question_options WHERE id = ?',
                    [userAnswer.selected_option_id]
                );

                if (options.length > 0 && options[0].is_correct) {
                    isCorrect = true;
                    pointsEarned = question.points;
                    totalScore += pointsEarned;
                }

                await pool.execute(
                    'INSERT INTO quiz_answers (submission_id, question_id, selected_option_id, is_correct, points_earned) VALUES (?, ?, ?, ?, ?)',
                    [submissionId, question.id, userAnswer.selected_option_id, isCorrect, pointsEarned]
                );
            } else if (question.question_type === 'short_answer') {
                // For short answer, store the text but don't auto-grade
                await pool.execute(
                    'INSERT INTO quiz_answers (submission_id, question_id, answer_text, is_correct, points_earned) VALUES (?, ?, ?, ?, ?)',
                    [submissionId, question.id, userAnswer.answer_text, null, 0]
                );
            }
        }

        // Calculate percentage and determine if passed
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const passed = percentage >= quiz.passing_score;

        // Update submission with final score
        await pool.execute(
            'UPDATE quiz_submissions SET score = ?, max_score = ?, passed = ? WHERE id = ?',
            [totalScore, maxScore, passed, submissionId]
        );

        res.status(201).json({
            submission_id: submissionId,
            score: totalScore,
            max_score: maxScore,
            percentage,
            passed,
            passing_score: quiz.passing_score
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get quiz submissions (teacher/admin only)
export const getQuizSubmissions = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // quiz_id

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Get quiz to verify ownership
        const [quizzes]: any = await pool.execute('SELECT course_id FROM quizzes WHERE id = ?', [id]);
        if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });

        // Verify the user owns the course or is admin
        if (req.user.role !== 'ADMIN') {
            const [courses]: any = await pool.execute('SELECT instructor_id FROM courses WHERE id = ?', [quizzes[0].course_id]);
            if (courses.length === 0) return res.status(404).json({ message: 'Course not found' });
            if (courses[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to view submissions for this quiz' });
            }
        }

        const [submissions]: any = await pool.execute(
            `SELECT qs.*, u.name as user_name, u.email as user_email 
             FROM quiz_submissions qs 
             JOIN users u ON qs.user_id = u.id 
             WHERE qs.quiz_id = ? 
             ORDER BY qs.submitted_at DESC`,
            [id]
        );

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user's quiz submissions
export const getMySubmissions = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [submissions]: any = await pool.execute(
            `SELECT qs.*, q.title as quiz_title, c.title as course_title 
             FROM quiz_submissions qs 
             JOIN quizzes q ON qs.quiz_id = q.id 
             JOIN courses c ON q.course_id = c.id 
             WHERE qs.user_id = ? 
             ORDER BY qs.submitted_at DESC`,
            [req.user.id]
        );

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
