"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        // Check if user exists
        const [existingUsers] = await db_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Insert user
        const [result] = await db_1.default.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role || 'STUDENT']);
        const token = jsonwebtoken_1.default.sign({ id: result.insertId, email, role: role || 'STUDENT' }, JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(201).json({
            token,
            user: { id: result.insertId, name, email, role: role || 'STUDENT' },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    try {
        const [users] = await db_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: '24h',
        });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, subscription_plan: user.subscription_plan },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const [users] = await db_1.default.execute('SELECT id, name, email, role, avatar, subscription_plan FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
const updateSubscription = async (req, res) => {
    const { subscriptionPlan } = req.body;
    if (!subscriptionPlan) {
        return res.status(400).json({ message: 'Subscription plan is required' });
    }
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        await db_1.default.execute('UPDATE users SET subscription_plan = ? WHERE id = ?', [subscriptionPlan, req.user.id]);
        res.json({ message: 'Subscription updated successfully', subscriptionPlan });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateSubscription = updateSubscription;
