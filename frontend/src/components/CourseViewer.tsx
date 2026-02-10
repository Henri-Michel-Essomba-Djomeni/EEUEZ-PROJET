import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, ChevronRight, Award, Trophy, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Course, Lesson } from '../types';
import confetti from 'canvas-confetti';

interface CourseViewerProps {
    course: Course;
    onBack: () => void;
}

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { EvaluationViewer } from './EvaluationViewer';

export const CourseViewer = ({ course, onBack }: CourseViewerProps) => {
    const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(course.lessons[0]);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);

    const handleLessonComplete = (lessonId: string) => {
        if (!completedLessons.includes(lessonId)) {
            setCompletedLessons([...completedLessons, lessonId]);
        }
    };

    const handleQuizComplete = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#4ade80', '#f0fdf4']
        });
        toast.success("Quiz terminé ! Votre résultat a été enregistré.");
    };

    if (!activeLesson) {
        return (
            <div className="container mx-auto py-10">
                <Button variant="ghost" onClick={onBack} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <BookOpen size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold">Aucune leçon disponible</h3>
                    <p className="text-muted-foreground mt-2">Le contenu de ce cours est en cours de préparation.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 max-w-7xl">
            <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-slate-100 h-8 text-xs  font-bold uppercase  px-3">
                <ArrowLeft className="mr-2 h-3 w-3" /> Retour dashboard
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content (Video / Quiz) */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="overflow-hidden border-none shadow-2xl bg-black aspect-video relative group">
                        {!showQuiz ? (
                            <>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" className="w-20 h-20 rounded-full bg-brand-600 hover:bg-brand-700">
                                        <Play size={32} fill="currentColor" />
                                    </Button>
                                </div>
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Play size={64} className="text-white opacity-20" />
                                </div>
                            </>
                        ) : (
                            course.quizzes && course.quizzes.length > 0 ? (
                                <div className="absolute inset-0 bg-background overflow-y-auto p-4 sm:p-8">
                                    <EvaluationViewer
                                        quizId={course.quizzes[0].id.toString()}
                                        onComplete={handleQuizComplete}
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-50">
                                    <div className="text-center">
                                        <Award size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Aucune évaluation n'est encore disponible pour ce cours.</p>
                                    </div>
                                </div>
                            )
                        )}
                    </Card>

                    <div className="space-y-3">
                        <h1 className="text-xl font-bold tracking-tight  uppercase text-slate-900 leading-none">{activeLesson.title}</h1>
                        <div className="flex items-center gap-3 py-1.5 border-b border-slate-100">
                            <Badge variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm font-bold uppercase  h-5 px-2 ">
                                {course.level}
                            </Badge>
                            <span className="text-sm text-slate-400 font-bold uppercase  flex items-center gap-1 ">
                                <Clock size={12} /> {activeLesson.duration}
                            </span>
                        </div>
                        <p className="text-slate-500 leading-relaxed text-sm ">{course.description}</p>
                    </div>
                </div>

                {/* Sidebar (Lesson List) */}
                <div className="space-y-6">
                    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="p-3 border-b border-slate-50">
                            <CardTitle className="text-xs font-bold uppercase  flex items-center gap-2 text-slate-800 ">
                                <BookOpen className="text-brand-600" size={16} />
                                Contenu du cours
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-4">
                            <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {course.lessons.map((lesson, idx) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => {
                                            setActiveLesson(lesson);
                                            setShowQuiz(false);
                                        }}
                                        className={`w-full p-2.5 rounded-lg flex items-center gap-2.5 transition-all group ${activeLesson.id === lesson.id && !showQuiz
                                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                                            : 'hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeLesson.id === lesson.id && !showQuiz
                                            ? 'bg-white/20'
                                            : completedLessons.includes(lesson.id)
                                                ? 'bg-brand-100 text-brand-600'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                            }`}>
                                            {completedLessons.includes(lesson.id) ? (
                                                <CheckCircle2 size={14} />
                                            ) : (
                                                <span className="text-sm font-bold">{idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="text-sm font-bold truncate leading-tight  uppercase">{lesson.title}</p>
                                            <p className={`text-sm uppercase font-bold   ${activeLesson.id === lesson.id && !showQuiz ? 'text-white/60' : 'text-slate-400'
                                                }`}>
                                                {lesson.duration}
                                            </p>
                                        </div>
                                    </button>
                                ))}

                                {course.quizzes && course.quizzes.length > 0 && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setShowQuiz(true)}
                                            className={`w-full p-3 rounded-lg flex items-center gap-3 border-2 border-dashed transition-all ${showQuiz
                                                ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                                                : 'border-slate-100 hover:border-brand-500/50 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${showQuiz ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'
                                                }`}>
                                                <Award size={18} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-bold uppercase  ">Évaluation finale</p>
                                                <p className="text-sm font-bold uppercase  text-slate-400 ">Valider compétences</p>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-brand-600 text-white border-none shadow-md shadow-brand-500/20 overflow-hidden relative rounded-xl">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Trophy size={100} />
                        </div>
                        <CardContent className="p-4 relative z-10">
                            <p className="text-sm font-bold uppercase  text-brand-200 mb-2 ">Progression</p>
                            <div className="space-y-3">
                                <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
                                        className="h-full bg-white"
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold ">
                                        {Math.round((completedLessons.length / course.lessons.length) * 100)}%
                                    </span>
                                    <span className="text-sm font-bold uppercase  text-brand-100 ">
                                        {completedLessons.length}/{course.lessons.length} Leçons
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

