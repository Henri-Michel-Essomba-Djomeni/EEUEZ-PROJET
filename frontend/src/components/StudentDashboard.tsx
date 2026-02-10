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
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Bonjour, <span className="text-brand-600">{user?.name?.split(' ')[0] || 'Apprenant'}</span> !
                    </h2>
                    <p className="text-slate-500 text-lg">Prêt à propulser votre carrière aujourd'hui ?</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors z-10" size={18} />
                    <Input
                        type="text"
                        placeholder="Rechercher une formation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-brand-500/20 focus-visible:border-brand-500 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Daily Tip Widget */}
            <Card className="bg-brand-600 border-none shadow-xl shadow-brand-500/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={140} />
                </div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 relative z-10 text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
                        <GraduationCap size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-black text-2xl mb-1 tracking-tight">Conseil du jour</h3>
                        <p className="text-brand-100 text-lg max-w-2xl leading-relaxed">
                            "La pratique régulière est la clé de la réussite. Consacrez 30 minutes chaque jour à vos formations pour progresser efficacement."
                        </p>
                    </div>
                    <Button variant="secondary" className="bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 h-12 rounded-xl">
                        Découvrir plus
                    </Button>
                </CardContent>
            </Card>

            {/* Course Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-brand-600 rounded-full"></div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Formations <span className="text-brand-600">Disponibles</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={course.id}
                        >
                            <Card className={`group border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white flex flex-col h-full ${course.is_locked ? 'opacity-75' : ''}`}>
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className={`w-full h-full object-cover transition-transform duration-1000 ${course.is_locked ? 'grayscale' : 'group-hover:scale-110'}`}
                                    />

                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-slate-800 border-none font-bold px-3 py-1 shadow-sm">
                                            {course.level}
                                        </Badge>
                                    </div>

                                    {course.is_locked && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex flex-col items-center justify-center text-white p-6 text-center">
                                            <div className="p-4 bg-white/20 rounded-full backdrop-blur-md mb-3 border border-white/30 animate-pulse">
                                                <Lock size={32} />
                                            </div>
                                            <span className="font-black uppercase tracking-widest text-sm">Contenu Verrouillé</span>
                                            <p className="text-xs text-slate-300 mt-1">Upgradez votre plan pour accéder</p>
                                        </div>
                                    )}

                                    {!course.is_locked && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <Button variant="secondary" className="w-full bg-white/20 backdrop-blur-md text-white border-white/30 font-bold hover:bg-white/40">
                                                Aperçu rapide
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge className="bg-brand-50 text-brand-700 hover:bg-brand-100 border-brand-100 font-bold uppercase tracking-wider text-[10px]">
                                            {course.category}
                                        </Badge>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-brand-600 transition-colors leading-tight line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <p className="text-slate-500 line-clamp-2 mb-8 text-sm leading-relaxed">
                                        {course.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mb-8 py-4 border-y border-slate-50">
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock size={16} className="text-brand-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{course.duration}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-x border-slate-50">
                                            <FileText size={16} className="text-brand-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{course.lessonsCount} Leçons</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Users size={16} className="text-brand-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{course.studentCount}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {course.is_locked ? (
                                            <Button disabled className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest cursor-not-allowed">
                                                <Lock size={18} className="mr-2" />
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
                                                className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest shadow-xl shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <Play size={18} fill="currentColor" className="mr-2" />
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
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">Aucune formation trouvée</h3>
                        <p className="text-slate-500 mt-2">Essayez d'autres mots-clés pour votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
