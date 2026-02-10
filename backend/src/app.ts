import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/db';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import progressRoutes from './routes/progressRoutes';
import userRoutes from './routes/userRoutes';
import certificationRoutes from './routes/certificationRoutes';
import lessonRoutes from './routes/lessonRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import chatRoutes from './routes/chatRoutes';
import { loadEEUEZContent } from './services/geminiService';

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/chat', chatRoutes);

// Health Check Route
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ status: 'ok', message: 'Server is running and database is connected', timestamp: new Date() });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: (error as Error).message });
    }
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Initialize EEUEZ Content Scraping
    await loadEEUEZContent();
});
