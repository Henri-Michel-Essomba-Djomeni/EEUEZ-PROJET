import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, ChevronRight, Award, Trophy, ArrowLeft, BookOpen } from 'lucide-react';
import { Course, Lesson } from '../data/mockData';
import confetti from 'canvas-confetti';

interface CourseViewerProps {
    course: Course;
    onBack: () => void;
}

export const CourseViewer = ({ course, onBack }: CourseViewerProps) => {
    const [activeLesson, setActiveLesson] = useState<Lesson>(course.lessons[0]);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const handleLessonComplete = (lessonId: string) => {
        if (!completedLessons.includes(lessonId)) {
            setCompletedLessons([...completedLessons, lessonId]);
        }
    };

    const handleQuizSubmit = () => {
        if (selectedAnswer === course.quizzes[0].correctAnswer) {
            setQuizFinished(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#4ade80', '#f0fdf4']
            });
        } else {
            alert("Dommage ! Réessayez.");
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors group px-4 py-2 hover:bg-white rounded-lg"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Retour au dashboard</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Video / Quiz) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden relative group shadow-xl">
                        {!showQuiz ? (
                            <>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30"
                                    >
                                        <Play size={32} fill="currentColor" />
                                    </motion.button>
                                </div>
                                <img
                                    src={course.thumbnail}
                                    alt="Video placeholder"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </>
                        ) : quizFinished ? (
                            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-8 space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center"
                                >
                                    <Trophy size={48} />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold uppercase italic tracking-tighter text-white">Félicitations !</h3>
                                    <p className="text-slate-400">Vous avez terminé le cours et réussi l'examen avec succès.</p>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold flex items-center gap-2 hover:bg-brand-700 transition-colors">
                                    <Award size={20} />
                                    Télécharger mon Certificat
                                </button>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-slate-50 p-12 flex flex-col justify-center gap-8">
                                <div className="space-y-4">
                                    <div className="text-brand-600 text-xs font-bold uppercase tracking-widest">Évaluation Finale</div>
                                    <h3 className="text-2xl font-bold text-slate-900">{course.quizzes[0].question}</h3>
                                </div>
                                <div className="space-y-3">
                                    {course.quizzes[0].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedAnswer(idx)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedAnswer === idx
                                                ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleQuizSubmit}
                                    disabled={selectedAnswer === null}
                                    className="w-full py-4 rounded-2xl bg-brand-600 text-white font-bold disabled:opacity-50 transition-all hover:bg-brand-700"
                                >
                                    Valider ma réponse
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 px-2">
                        <h1 className="text-3xl font-bold text-slate-900">{activeLesson.title}</h1>
                        <p className="text-slate-500 leading-relaxed">{course.description}</p>
                    </div>
                </div>

                {/* Sidebar (Lesson List) */}
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <BookOpen size={20} className="text-brand-600" />
                            Contenu du cours
                        </h4>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {course.lessons.map((lesson, idx) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => {
                                        setActiveLesson(lesson);
                                        setShowQuiz(false);
                                    }}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${activeLesson.id === lesson.id && !showQuiz
                                        ? 'bg-brand-50 ring-1 ring-brand-200'
                                        : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${completedLessons.includes(lesson.id)
                                        ? 'bg-brand-100 text-brand-600'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {completedLessons.includes(lesson.id) ? <CheckCircle2 size={16} /> : <Play size={14} fill="currentColor" />}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <div className={`text-sm font-bold truncate ${activeLesson.id === lesson.id ? 'text-brand-900' : 'text-slate-700'}`}>{lesson.title}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-medium">{lesson.duration}</div>
                                    </div>
                                    {activeLesson.id === lesson.id && (
                                        <ChevronRight size={16} className="text-brand-500" />
                                    )}
                                </button>
                            ))}

                            {course.quizzes.length > 0 && (
                                <button
                                    onClick={() => setShowQuiz(true)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${showQuiz
                                        ? 'bg-brand-50 ring-1 ring-brand-200'
                                        : 'hover:bg-slate-50 border border-dashed border-slate-200'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                                        <Award size={16} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-bold uppercase text-slate-700">Évaluation finale</div>
                                        <div className="text-[10px] text-slate-500">Obtenez votre certificat</div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-brand-500 text-white shadow-xl shadow-brand-500/20">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-brand-100 mb-4">Votre Progression</h5>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
                                />
                            </div>
                            <div className="text-xs font-bold text-brand-50 uppercase tracking-widest text-right">
                                {completedLessons.length}/{course.lessons.length} Complétées
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
