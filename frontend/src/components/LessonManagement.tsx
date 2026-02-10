import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, GripVertical, Video, FileText, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { lessonsAPI } from '../services/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Lesson {
    id: number;
    course_id: number;
    title: string;
    content: string;
    video_url: string;
    duration: string;
    order_index: number;
}

interface LessonManagementProps {
    courseId: string;
}

export const LessonManagement: React.FC<LessonManagementProps> = ({ courseId }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        video_url: '',
        duration: ''
    });

    useEffect(() => {
        loadLessons();
    }, [courseId]);

    const loadLessons = async () => {
        try {
            setLoading(true);
            const data = await lessonsAPI.getLessonsByCourse(courseId);
            setLessons(data);
        } catch (error) {
            console.error('Failed to load lessons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const lessonData = {
                ...formData,
                course_id: parseInt(courseId),
                order_index: editingLesson ? editingLesson.order_index : lessons.length + 1
            };

            if (editingLesson) {
                await lessonsAPI.updateLesson(editingLesson.id.toString(), lessonData);
            } else {
                await lessonsAPI.createLesson(lessonData);
            }

            await loadLessons();
            closeModal();
        } catch (error) {
            console.error('Failed to save lesson', error);
            alert('Erreur lors de la sauvegarde de la leçon');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) return;

        try {
            await lessonsAPI.deleteLesson(id.toString());
            await loadLessons();
        } catch (error) {
            console.error('Failed to delete lesson', error);
            alert('Erreur lors de la suppression de la leçon');
        }
    };

    const handleReorder = async (lessonId: number, direction: 'up' | 'down') => {
        const lessonIndex = lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex === -1) return;
        if (direction === 'up' && lessonIndex === 0) return;
        if (direction === 'down' && lessonIndex === lessons.length - 1) return;

        const newLessons = [...lessons];
        const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;

        // Swap
        [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];

        // Update order_index
        const lessonOrders = newLessons.map((lesson, index) => ({
            id: lesson.id,
            order_index: index + 1
        }));

        try {
            await lessonsAPI.reorderLessons(courseId, lessonOrders);
            await loadLessons();
        } catch (error) {
            console.error('Failed to reorder lessons', error);
        }
    };

    const openEditModal = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setFormData({
            title: lesson.title,
            content: lesson.content,
            video_url: lesson.video_url,
            duration: lesson.duration
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLesson(null);
        setFormData({
            title: '',
            content: '',
            video_url: '',
            duration: ''
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">
                        Gestion des <span className="text-brand-400">Leçons</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {lessons.length} leçon{lessons.length !== 1 ? 's' : ''} dans ce cours
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                >
                    <PlusCircle size={18} />
                    Ajouter une leçon
                </button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel p-4 rounded-2xl border border-border/50 hover:border-brand-500/30 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col gap-1 mt-2">
                                    <button
                                        onClick={() => handleReorder(lesson.id, 'up')}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <GripVertical size={16} className="text-muted-foreground" />
                                    <button
                                        onClick={() => handleReorder(lesson.id, 'down')}
                                        disabled={index === lessons.length - 1}
                                        className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-1 rounded-full">
                                                    Leçon {lesson.order_index}
                                                </span>
                                                {lesson.video_url && (
                                                    <Video size={14} className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold mb-1">{lesson.title}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {lesson.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                {lesson.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {lesson.duration}
                                                    </div>
                                                )}
                                                {lesson.video_url && (
                                                    <div className="flex items-center gap-1">
                                                        <Video size={12} />
                                                        Vidéo disponible
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(lesson)}
                                                className="p-2 bg-secondary hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lesson.id)}
                                                className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {lessons.length === 0 && (
                    <div className="text-center py-12 glass-panel rounded-2xl border border-dashed border-border">
                        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Aucune leçon pour le moment</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cliquez sur "Ajouter une leçon" pour commencer
                        </p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingLesson ? 'Modifier la leçon' : 'Nouvelle leçon'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre de la leçon</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Ex: Introduction aux composants React"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Contenu</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px]"
                                placeholder="Décrivez le contenu de la leçon..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">URL de la vidéo (optionnel)</label>
                            <input
                                type="url"
                                value={formData.video_url}
                                onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Durée</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Ex: 15min, 1h30"
                            />
                        </div>

                        <DialogFooter>
                            <div className="flex gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-secondary hover:bg-muted rounded-xl font-bold transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all"
                                >
                                    {editingLesson ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
