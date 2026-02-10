import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMyCertifications = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [certs]: any = await pool.execute(
            `SELECT cert.*, c.title as courseTitle, u.name as instructorName 
             FROM certifications cert
             JOIN courses c ON cert.course_id = c.id
             LEFT JOIN users u ON c.instructor_id = u.id
             WHERE cert.user_id = ?`,
            [req.user.id]
        );

        const formattedCerts = certs.map((cert: any) => ({
            id: cert.id,
            courseTitle: cert.courseTitle,
            issueDate: cert.issue_date,
            instructor: cert.instructorName || 'Unknown Instructor',
            score: cert.score,
            certificateCode: cert.certificate_code
        }));

        res.json(formattedCerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const issueCertificate = async (req: AuthRequest, res: Response) => {
    // Only Admin or System (internal call) usually, but for now allow logged in user to "claim" if completed? 
    // Or better, logic should check if course is completed.
    // Let's assume this endpoint is called when a user finishes a course 100%.

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { courseId, score } = req.body;

    try {
        // Verify completion (Optional: check user_progress)

        // Generate unique code
        const certificateCode = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [result]: any = await pool.execute(
            'INSERT INTO certifications (user_id, course_id, certificate_code, score) VALUES (?, ?, ?, ?)',
            [req.user.id, courseId, certificateCode, score || 100]
        );

        res.status(201).json({
            message: 'Certificate issued',
            certificateCode
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
