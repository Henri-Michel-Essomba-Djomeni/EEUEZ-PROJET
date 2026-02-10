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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold uppercase  leading-none text-slate-900">
                        Gestion <span className="text-brand-600">Des Cours</span>
                    </h2>
                    <p className="text-slate-500 text-sm">Administrez votre catalogue de formations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold  flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-500/20 group"
                >
                    <PlusSquare size={16} className="group-hover:scale-110 transition-transform" />
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
                        className="glass-panel p-4 rounded-xl border-border/50 group hover:border-brand-500/30 transition-all overflow-hidden relative shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden relative shrink-0">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-bold text-brand-600 uppercase  leading-none flex items-center gap-1 mb-4 ">
                                            <BookOpen size={14} /> {course.category}
                                        </div>
                                        <h3 className="text-base font-bold tracking-tight  uppercase text-slate-900">{course.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="h-8 px-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                                            <Eye size={12} /> Aperçu
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="h-8 px-3 bg-red-50 text-red-600 text-sm font-bold uppercase  rounded-lg hover:bg-red-100 transition-all flex items-center gap-1.5"
                                        >
                                            <Trash2 size={12} /> Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                                    <div className="pb-2 flex items-center justify-between">
                                        <div className="text-sm font-bold uppercase flex items-center gap-2 text-slate-800 ">
                                            <Video size={14} className="text-slate-400" />
                                            {course.lessons?.length || 0} Leçons publiées
                                        </div>
                                        <button
                                            onClick={() => navigate(`/course/${course.id}`)}
                                            className="text-sm font-bold  text-brand-600 hover:text-brand-700 transition-colors "
                                        >
                                            Gérer le contenu →
                                        </button>
                                    </div>
                                    <div className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-xs text-slate-400 uppercase font-bold  ">Étudiants</div>
                                            <div className="text-sm font-bold text-slate-900">{course.studentCount || 0}</div>
                                        </div>
                                        <div className="text-center border-x border-slate-100">
                                            <div className="text-xs text-slate-400 uppercase font-bold  ">Note</div>
                                            <div className="text-sm font-bold text-slate-900">{course.rating || 'New'}</div>
                                        </div>
                                        <div className="text-center border-r border-slate-100">
                                            <div className="text-xs text-slate-400 uppercase font-bold  ">Status</div>
                                            <div className="text-sm font-bold text-green-600 px-2 py-0.5 rounded-full bg-green-50 inline-block mt-0.5 uppercase ">Publié</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-slate-400 uppercase font-bold  ">Revenus</div>
                                            <div className="text-sm font-bold text-slate-900">--</div>
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
