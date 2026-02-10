import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const register = async (req: Request, res: Response) => {
    const { name, firstName, lastName, email, password, role } = req.body;

    // Support both formats: name OR firstName + lastName
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if user exists
        const [existingUsers]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result]: any = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, role || 'STUDENT']
        );

        const token = jwt.sign({ id: result.insertId, email, role: role || 'STUDENT' }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.status(201).json({
            token,
            user: { id: result.insertId, name: fullName, email, role: role || 'STUDENT' },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, subscription_plan: user.subscription_plan },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const [users]: any = await pool.execute('SELECT id, name, email, role, avatar, subscription_plan FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateSubscription = async (req: AuthRequest, res: Response) => {
    const { subscriptionPlan } = req.body;

    if (!subscriptionPlan) {
        return res.status(400).json({ message: 'Subscription plan is required' });
    }

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        await pool.execute('UPDATE users SET subscription_plan = ? WHERE id = ?', [subscriptionPlan, req.user.id]);
        res.json({ message: 'Subscription updated successfully', subscriptionPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
