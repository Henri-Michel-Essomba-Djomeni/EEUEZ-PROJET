import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ClipboardList } from 'lucide-react';
import { LessonManagement } from '../components/LessonManagement';
import { EvaluationManagement } from '../components/EvaluationManagement';
import { coursesAPI } from '../services/api';

export const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'lessons' | 'evaluations'>('lessons');
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadCourse();
        }
    }, [courseId]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await coursesAPI.getCourseById(courseId!);
            setCourse(data);
        } catch (error) {
            console.error('Failed to load course', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-muted-foreground mb-4">Cours introuvable</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold"
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold uppercase italic tracking-tighter">
                            {course.title}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass-panel rounded-2xl border border-border overflow-hidden">
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('lessons')}
                            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'lessons'
                                    ? 'bg-brand-500 text-white'
                                    : 'hover:bg-secondary'
                                }`}
                        >
                            <BookOpen size={20} />
                            Leçons
                        </button>
                        <button
                            onClick={() => setActiveTab('evaluations')}
                            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'evaluations'
                                    ? 'bg-brand-500 text-white'
                                    : 'hover:bg-secondary'
                                }`}
                        >
                            <ClipboardList size={20} />
                            Évaluations
                        </button>
                    </div>

                    <div className="p-6">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'lessons' ? (
                                <LessonManagement courseId={courseId!} />
                            ) : (
                                <EvaluationManagement courseId={courseId!} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
