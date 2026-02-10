import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, BookOpen, Clock, Users, MoreVertical, X, Eye, Video, PlusSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Course } from '../types';

export const CourseManagement = () => {
    const { courses, refreshData } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newCourse, setNewCourse] = useState<Partial<Course>>({
        title: '',
        category: 'Développement Web',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
        lessons: [],
        quizzes: []
    });

    const teacherCourses = courses.filter(c => user?.role === 'ADMIN' || c.instructorId === user?.id || c.instructorId === '2'); // Show demo courses for now if ID doesn't match

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Call backend API to create course
            const courseData = {
                title: newCourse.title || 'Sans titre',
                description: newCourse.description || '',
                category: newCourse.category || 'Général',
                thumbnail: newCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
                level: 'Débutant', // Default level
                duration: '0h' // Default duration
            };

            await coursesAPI.createCourse(courseData);
            await refreshData();

            setIsModalOpen(false);
            setNewCourse({
                title: '',
                category: 'Développement Web',
                description: '',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
                lessons: [],
                quizzes: []
            });
        } catch (error) {
            console.error("Failed to create course", error);
            alert("Erreur lors de la création du cours. Veuillez réessayer.");
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;
        try {
            await coursesAPI.deleteCourse(id);
            await refreshData();
        } catch (error) {
            console.error("Failed to delete course", error);
            alert("Impossible de supprimer le cours.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Gestion <span className="text-brand-400">Des Cours</span>
                    </h2>
                    <p className="text-muted-foreground">Administrez votre catalogue de formations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 group"
                >
                    <PlusSquare size={20} className="group-hover:scale-110 transition-transform" />
                    Créer un nouveau cours
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {teacherCourses.map((course, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={course.id}
                        className="glass-panel p-6 rounded-3xl border-border/50 group hover:border-brand-500/30 transition-all overflow-hidden relative"
                    >
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-64 h-48 rounded-2xl overflow-hidden relative shrink-0">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                                        <Edit2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest leading-none flex items-center gap-1">
                                            <BookOpen size={10} /> {course.category}
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight italic uppercase">{course.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-xl hover:bg-muted transition-colors flex items-center gap-2">
                                            <Eye size={14} /> Aperçu
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="px-4 py-2 bg-destructive/10 text-destructive text-xs font-bold rounded-xl hover:bg-destructive hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 divide-y divide-border/50">
                                    <div className="pb-3 flex items-center justify-between">
                                        <div className="text-sm font-bold flex items-center gap-2">
                                            <Video size={16} className="text-slate-500" />
                                            {course.lessons?.length || 0} Leçons publiées
                                        </div>
                                        <button
                                            onClick={() => navigate(`/course/${course.id}`)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-brand-400 hover:underline"
                                        >
                                            Gérer le contenu
                                        </button>
                                    </div>
                                    <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Étudiants</div>
                                            <div className="text-lg font-bold">{course.studentCount || 0}</div>
                                        </div>
                                        <div className="text-center border-x border-border/50">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Note</div>
                                            <div className="text-lg font-bold">{course.rating || 'New'}</div>
                                        </div>
                                        <div className="text-center border-r border-border/50">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</div>
                                            <div className="text-[10px] font-bold text-green-500 px-2 py-1 rounded-full bg-green-500/10 inline-block mt-1">Publié</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Revenus</div>
                                            <div className="text-lg font-bold">--</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer un nouveau cours</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre du cours</label>
                            <input
                                type="text"
                                required
                                value={newCourse.title}
                                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Ex: Introduction à React"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie</label>
                            <select
                                value={newCourse.category}
                                onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            >
                                <option>Développement Web</option>
                                <option>Design</option>
                                <option>Marketing</option>
                                <option>Business</option>
                                <option>Data</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description courte</label>
                            <textarea
                                required
                                value={newCourse.description}
                                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]"
                                placeholder="Décrivez le contenu du cours..."
                            />
                        </div>
                        <DialogFooter>
                            <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-brand-500/20">
                                Créer le cours
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
