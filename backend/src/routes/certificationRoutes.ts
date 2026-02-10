import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getMyCertifications, issueCertificate } from '../controllers/certificationController';

const router = express.Router();

router.use(authenticateToken);

router.get('/my-certifications', getMyCertifications);
router.post('/issue', issueCertificate);

export default router;
