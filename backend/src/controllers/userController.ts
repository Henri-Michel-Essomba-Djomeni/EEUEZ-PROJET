import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response) => {
    // Only Admin can list users
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const { role } = req.query;
        let query = 'SELECT id, name, email, role, avatar FROM users';
        const params: any[] = [];

        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }

        const [users]: any = await pool.execute(query, params);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req: AuthRequest, res: Response) => {
    // Only Admin can create users (teachers)
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Default avatar
        const avatar = `https://ui-avatars.com/api/?name=${name}&background=random`;

        const [result]: any = await pool.execute(
            'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, avatar]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            role,
            avatar
        });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;

    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
