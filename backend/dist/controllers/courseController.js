"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRating = exports.getEnrolledCourses = exports.enrollInCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        let query = 'SELECT * FROM courses WHERE 1=1';
        const params = [];
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
        const [courses] = await db_1.default.execute(query, params);
        // Calculate student count and rating for each course (mocking for now or complex query)
        // For simplicity, we can just return the courses
        res.json(courses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCourses = getAllCourses;
const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [courses] = await db_1.default.execute('SELECT * FROM courses WHERE id = ?', [id]);
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const course = courses[0];
        // Get lessons
        const [lessons] = await db_1.default.execute('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC', [id]);
        course.lessons = lessons;
        res.json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCourseById = getCourseById;
const createCourse = async (req, res) => {
    const { title, description, thumbnail, category, level, duration } = req.body;
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const [result] = await db_1.default.execute('INSERT INTO courses (title, description, instructor_id, thumbnail, category, level, duration) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, description, req.user.id, thumbnail, category, level, duration]);
        res.status(201).json({ id: result.insertId, ...req.body });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, thumbnail, category, level, duration, is_locked } = req.body;
    try {
        await db_1.default.execute('UPDATE courses SET title = ?, description = ?, thumbnail = ?, category = ?, level = ?, duration = ?, is_locked = ? WHERE id = ?', [title, description, thumbnail, category, level, duration, is_locked, id]);
        res.json({ message: 'Course updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCourse = updateCourse;
const enrollInCourse = async (req, res) => {
    const { id } = req.params;
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await db_1.default.execute('INSERT IGNORE INTO user_courses (user_id, course_id) VALUES (?, ?)', [req.user.id, id]);
        res.json({ message: 'Enrolled successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.enrollInCourse = enrollInCourse;
const getEnrolledCourses = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const [courses] = await db_1.default.execute(`SELECT c.*, uc.completed, uc.enrolled_at 
       FROM courses c 
       JOIN user_courses uc ON c.id = uc.course_id 
       WHERE uc.user_id = ?`, [req.user.id]);
        res.json(courses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEnrolledCourses = getEnrolledCourses;
const addRating = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await db_1.default.execute('INSERT INTO course_ratings (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)', [req.user.id, id, rating, comment]);
        res.status(201).json({ message: 'Rating added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addRating = addRating;
