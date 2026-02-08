import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Course } from '../data/mockData';
import { Search, Play, Lock, Clock, FileText, Users } from 'lucide-react';

interface StudentDashboardProps {
    onSelectCourse: (course: Course) => void;
}

export const StudentDashboard = ({ onSelectCourse }: StudentDashboardProps) => {
    const { user } = useAuth();
    const { courses } = useData();

    // Daily tip component matching screenshot
    const DailyTip = () => (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 flex gap-4 items-start mb-8">
            <div className="p-3 bg-brand-500 rounded-xl text-white shrink-0">
                <GraduationCap size={24} />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">Conseil du jour</h3>
                <p className="text-slate-600 leading-relaxed">
                    La pratique régulière est la clé de la réussite en informatique. Essayez de consacrer au moins 30 minutes par jour à vos formations pour progresser efficacement.
                </p>
            </div>
        </div>
    );

    // Helper to render stars
    const GraduationCap = ({ size }: { size: number }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Bonjour, {user?.name.split(' ')[0]} <span className="text-brand-500">👋</span>
                    </h2>
                    <p className="text-slate-500">Prêt à apprendre quelque chose de nouveau aujourd'hui ?</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
                            className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-72 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {courses.map((course, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={course.id}
                        className={`bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col ${course.isLocked ? 'opacity-90' : ''}`}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className={`w-full h-full object-cover transition-transform duration-700 ${course.isLocked ? 'grayscale-[0.5]' : 'group-hover:scale-105'}`}
                            />

                            {/* Level Badge */}
                            {course.level && (
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                                    {course.level}
                                </div>
                            )}

                            {/* Locked Overlay */}
                            {course.isLocked && (
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-md mb-2">
                                        <Lock size={32} />
                                    </div>
                                    <span className="font-medium">Cours verrouillé</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-1 rounded-md">
                                    {course.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-6">{course.description}</p>

                            <div className="flex items-center gap-4 text-slate-400 text-xs font-medium mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText size={14} />
                                    <span>{course.lessonsCount} leçons</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    <span>{course.studentCount}</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                {course.isLocked ? (
                                    <button
                                        disabled
                                        className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <Lock size={16} />
                                        Verrouillé
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onSelectCourse(course)}
                                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02]"
                                    >
                                        <Play size={16} fill="currentColor" />
                                        Commencer
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <DailyTip />
        </div>
    );
};
