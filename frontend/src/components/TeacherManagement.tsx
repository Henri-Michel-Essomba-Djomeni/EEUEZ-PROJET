import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Trash2, Mail, ShieldCheck, UserMinus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { usersAPI } from '../services/api';
import { Modal } from './Modal';
import { User } from '../data/mockData';

export const TeacherManagement = () => {
    const { courses } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        password: '' // Added password field for creation
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const data = await usersAPI.getUsers('TEACHER');
            // Map data if necessary, ensuring avatar is present
            const mappedTeachers = data.map((t: any) => ({
                ...t,
                id: t.id.toString(),
                avatar: t.avatar || `https://ui-avatars.com/api/?name=${t.name}&background=16a34a&color=fff`
            }));
            setTeachers(mappedTeachers);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTeacherCourseCount = (teacherId: string) => {
        return courses.filter(c => c.instructorId === teacherId).length;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await usersAPI.createUser({
                name: newTeacher.name,
                email: newTeacher.email,
                password: newTeacher.password || 'password123', // Default password or from form
                role: 'TEACHER'
            });
            await fetchTeachers(); // Refresh list
            setIsModalOpen(false);
            setNewTeacher({ name: '', email: '', password: '' });
        } catch (error) {
            console.error("Failed to create teacher", error);
            alert("Erreur lors de la création de l'enseignant");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) return;
        try {
            await usersAPI.deleteUser(id);
            setTeachers(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete teacher", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Gestion <span className="text-brand-400">Enseignants</span>
                    </h2>
                    <p className="text-muted-foreground">Gérez l'accès des professeurs à la plateforme.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 group"
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Ajouter un Enseignant
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-10">Chargement...</div>
                ) : teachers.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">Aucun enseignant trouvé.</div>
                ) : (
                    teachers.map((prof, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={prof.id}
                            className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-brand-500/30 transition-all border-border/50"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                                <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-1 text-center md:text-left">
                                <div className="font-bold text-lg">{prof.name}</div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                    <Mail size={12} /> {prof.email}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 px-8 border-x border-border/50">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cours</div>
                                    <div className="text-lg font-bold">{getTeacherCourseCount(prof.id)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Statut</div>
                                    <div className="text-xs font-bold mt-1.5 text-green-500">Actif</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Depuis</div>
                                    <div className="text-[10px] font-bold mt-1.5">2024</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-all">
                                    <ShieldCheck size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(prof.id)}
                                    className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                                >
                                    <UserMinus size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un enseignant">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nom complet</label>
                        <input
                            type="text"
                            required
                            value={newTeacher.name}
                            onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ex: Jean Dupont"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email professionnel</label>
                        <input
                            type="email"
                            required
                            value={newTeacher.email}
                            onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ex: jean@academie.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe temporaire</label>
                        <input
                            type="password"
                            required
                            value={newTeacher.password}
                            onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="********"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-brand-500/20">
                        Ajouter l'enseignant
                    </button>
                </form>
            </Modal>
        </div>
    );
};
