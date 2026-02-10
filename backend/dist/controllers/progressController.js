"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitEvaluation = exports.updateModuleCompletion = exports.getCourseProgress = exports.getUserProgress = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUserProgress = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const [progress] = await db_1.default.execute(`SELECT c.id as courseId, c.title, COUNT(up.lesson_id) as completedLessons, 
       (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as totalLessons
       FROM user_progress up
       JOIN courses c ON up.course_id = c.id
       WHERE up.user_id = ?
       GROUP BY c.id`, [req.user.id]);
        res.json(progress);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserProgress = getUserProgress;
const getCourseProgress = async (req, res) => {
    const { courseId } = req.params;
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const [progress] = await db_1.default.execute('SELECT lesson_id, completed, last_accessed FROM user_progress WHERE user_id = ? AND course_id = ?', [req.user.id, courseId]);
        res.json(progress);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCourseProgress = getCourseProgress;
const updateModuleCompletion = async (req, res) => {
    const { courseId } = req.params;
    const { moduleIndex, timeSpent } = req.body;
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        // Find lesson ID by index (assuming order_index is used)
        const [lessons] = await db_1.default.execute('SELECT id FROM lessons WHERE course_id = ? AND order_index = ?', [courseId, moduleIndex]);
        if (lessons.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        const lessonId = lessons[0].id;
        await db_1.default.execute(`INSERT INTO user_progress (user_id, course_id, lesson_id, completed) 
       VALUES (?, ?, ?, TRUE) 
       ON DUPLICATE KEY UPDATE completed = TRUE, last_accessed = CURRENT_TIMESTAMP`, [req.user.id, courseId, lessonId]);
        res.json({ message: 'Progress updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateModuleCompletion = updateModuleCompletion;
const submitEvaluation = async (req, res) => {
    const { courseId } = req.params;
    const { answers } = req.body;
    // Evaluation logic would go here. For now, just logging it.
    console.log(`User ${req.user?.id} submitted evaluation for course ${courseId}:`, answers);
    res.json({ message: 'Evaluation submitted successfully', passed: true, score: 100 });
};
exports.submitEvaluation = submitEvaluation;
