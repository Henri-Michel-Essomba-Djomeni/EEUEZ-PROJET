"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', courseController_1.getAllCourses);
router.get('/enrolled/my-courses', authMiddleware_1.authenticateToken, courseController_1.getEnrolledCourses); // Specific route before :id
router.get('/:id', courseController_1.getCourseById);
router.post('/', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'TEACHER']), courseController_1.createCourse);
router.put('/:id', authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'TEACHER']), courseController_1.updateCourse);
router.post('/:id/enroll', authMiddleware_1.authenticateToken, courseController_1.enrollInCourse);
router.post('/:id/rating', authMiddleware_1.authenticateToken, courseController_1.addRating);
exports.default = router;
