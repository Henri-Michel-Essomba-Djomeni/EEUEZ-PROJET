import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Trash2, Mail, ShieldCheck, UserMinus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { usersAPI } from '../services/api';
import { Modal } from './Modal';
import { User } from '../types';

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold uppercase  tracking-tighter leading-none text-slate-900">
                        Gestion <span className="text-brand-600">Enseignants</span>
                    </h2>
                    <p className="text-slate-500 text-sm ">Gérez l'accès des professeurs à la plateforme.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold uppercase  flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-500/20 group "
                >
                    <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    Ajouter un Enseignant
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-10 text-sm ">Chargement...</div>
                ) : teachers.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm ">Aucun enseignant trouvé.</div>
                ) : (
                    teachers.map((prof, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={prof.id}
                            className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 group hover:border-brand-500/30 transition-all border-border/50 shadow-sm"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-0.5 text-center md:text-left">
                                <div className="font-bold text-slate-900 ">{prof.name}</div>
                                <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-400 text-sm uppercase  font-bold ">
                                    <Mail size={10} /> {prof.email}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 px-6 border-x border-slate-100 h-10 items-center">
                                <div className="text-center">
                                    <div className="text-xs font-bold text-slate-400 uppercase  ">Cours</div>
                                    <div className="text-sm font-bold text-slate-900 leading-tight">{getTeacherCourseCount(prof.id)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold text-slate-400 uppercase  ">Statut</div>
                                    <div className="text-sm font-bold text-green-600 uppercase ">Actif</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold text-slate-400 uppercase  ">Depuis</div>
                                    <div className="text-sm font-bold text-slate-900 uppercase ">2024</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm">
                                    <ShieldCheck size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(prof.id)}
                                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                    <UserMinus size={16} />
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
