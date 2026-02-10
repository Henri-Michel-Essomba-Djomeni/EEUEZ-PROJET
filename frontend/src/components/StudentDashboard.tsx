import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, Play, Lock, Clock, FileText, Users, GraduationCap, Trophy } from 'lucide-react';
import { Course } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentDashboardProps {
    onSelectCourse: (course: Course) => void;
}

export const StudentDashboard = ({ onSelectCourse }: StudentDashboardProps) => {
    const { user } = useAuth();
    const { courses } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                        Bonjour, <span className="text-brand-600">{user?.name?.split(' ')[0] || 'Apprenant'}</span> !
                    </h2>
                    <p className="text-slate-500 text-sm ">Prêt à propulser votre carrière aujourd'hui ?</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors z-10" size={16} />
                    <Input
                        type="text"
                        placeholder="Rechercher une formation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-brand-500/20 focus-visible:border-brand-500 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Daily Tip Widget */}
            <Card className="bg-brand-600 border-none shadow-lg shadow-brand-500/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={100} />
                </div>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4 relative z-10 text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/30">
                        <GraduationCap size={24} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-lg mb-0.5 tracking-tight">Conseil du jour</h3>
                        <p className="text-brand-100 text-sm max-w-2xl leading-relaxed">
                            "La pratique régulière est la clé de la réussite. Consacrez 30 minutes chaque jour à vos formations."
                        </p>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white text-brand-600 hover:bg-brand-50 font-bold px-6 h-10 rounded-lg text-xs">
                        Découvrir
                    </Button>
                </CardContent>
            </Card>

            {/* Course Grid */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-brand-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tighter ">Formations <span className="text-brand-600">Disponibles</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={course.id}
                        >
                            <Card className={`group border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1 bg-white flex flex-col h-full ${course.is_locked ? 'opacity-75' : ''}`}>
                                <div className="relative h-32 overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className={`w-full h-full object-cover transition-transform duration-1000 ${course.is_locked ? 'grayscale' : 'group-hover:scale-110'}`}
                                    />

                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-slate-800 border-none font-bold px-1.5 py-0 text-xs shadow-sm">
                                            {course.level}
                                        </Badge>
                                    </div>

                                    {course.is_locked && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex flex-col items-center justify-center text-white p-2 text-center">
                                            <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-md mb-1 border border-white/30 animate-pulse">
                                                <Lock size={14} />
                                            </div>
                                            <span className="font-bold uppercase  text-xs">Verrouillé</span>
                                        </div>
                                    )}

                                    {!course.is_locked && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                            <Button variant="secondary" size="sm" className="w-full bg-white/20 backdrop-blur-md text-white border-white/30 font-bold hover:bg-white/40 h-7 text-sm">
                                                Aperçu
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-bold uppercase tracking-wider text-xs px-1.5 py-0">
                                            {course.category}
                                        </Badge>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors leading-tight line-clamp-2 ">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-500 line-clamp-2 mb-3 text-sm leading-relaxed">
                                        {course.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-1 mb-3 py-2 border-y border-slate-50">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <Clock size={12} className="text-brand-500" />
                                            <span className="text-xs font-bold uppercase text-slate-400 tracking-tighter">{course.duration}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5 border-x border-slate-50">
                                            <FileText size={12} className="text-brand-500" />
                                            <span className="text-xs font-bold uppercase text-slate-400 tracking-tighter">{course.lessonsCount}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <Users size={12} className="text-brand-500" />
                                            <span className="text-xs font-bold uppercase text-slate-400 tracking-tighter">{course.studentCount}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {course.is_locked ? (
                                            <Button disabled className="w-full h-8 rounded-lg bg-slate-100 text-slate-400 font-bold uppercase  text-sm cursor-not-allowed">
                                                <Lock size={12} className="mr-1.5" />
                                                Verrouillé
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={async () => {
                                                    try {
                                                        const m = await import('../services/api');
                                                        const fullCourse = await m.coursesAPI.getCourseById(course.id);
                                                        if (!fullCourse.lessons) fullCourse.lessons = [];
                                                        if (!fullCourse.quizzes) fullCourse.quizzes = [];
                                                        onSelectCourse(fullCourse);
                                                    } catch (error) {
                                                        onSelectCourse(course);
                                                    }
                                                }}
                                                className="w-full h-8 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold uppercase  text-sm shadow-md shadow-brand-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <Play size={12} fill="currentColor" className="mr-1.5" />
                                                Commencer
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Search size={24} className="mx-auto text-slate-300 mb-2" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase  tracking-tighter">Aucune formation trouvée</h3>
                        <p className="text-slate-500 mt-1 text-xs ">Essayez d'autres mots-clés.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
