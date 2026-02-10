import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Trash2, Mail, BookOpen, UserMinus, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import { usersAPI } from '../services/api';
import { Modal } from './Modal';
import { User } from '../types';

export const StudentManagement = () => {
    const { courses } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [newStudent, setNewStudent] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await usersAPI.getUsers('STUDENT');
            // Map data if necessary, ensuring avatar is present
            const mappedStudents = data.map((s: any) => ({
                ...s,
                id: s.id.toString(),
                avatar: s.avatar || `https://ui-avatars.com/api/?name=${s.name}&background=6366f1&color=fff`
            }));
            setStudents(mappedStudents);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStudentEnrollmentCount = (studentId: string) => {
        // This would ideally come from the backend
        // For now, return a placeholder
        return Math.floor(Math.random() * 5) + 1;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await usersAPI.createUser({
                name: newStudent.name,
                email: newStudent.email,
                password: newStudent.password || 'password123',
                role: 'STUDENT'
            });
            await fetchStudents(); // Refresh list
            setIsModalOpen(false);
            setNewStudent({ name: '', email: '', password: '' });
        } catch (error) {
            console.error("Failed to create student", error);
            alert("Erreur lors de la création de l'étudiant");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) return;
        try {
            await usersAPI.deleteUser(id);
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Failed to delete student", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Gestion <span className="text-brand-400">Étudiants</span>
                    </h2>
                    <p className="text-muted-foreground">Gérez les comptes étudiants de la plateforme.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 group"
                >
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Ajouter un Étudiant
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl border-border/50"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Étudiants</div>
                            <div className="text-2xl font-black tracking-tight">{students.length}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border-border/50"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actifs</div>
                            <div className="text-2xl font-black tracking-tight">{students.length}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-3xl border-border/50"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <Award size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Certifiés</div>
                            <div className="text-2xl font-black tracking-tight">0</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-10">Chargement...</div>
                ) : students.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">Aucun étudiant trouvé.</div>
                ) : (
                    students.map((student, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={student.id}
                            className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-brand-500/30 transition-all border-border/50"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-1 text-center md:text-left">
                                <div className="font-bold text-lg">{student.name}</div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                    <Mail size={12} /> {student.email}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 px-8 border-x border-border/50">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cours</div>
                                    <div className="text-lg font-bold">{getStudentEnrollmentCount(student.id)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Statut</div>
                                    <div className="text-xs font-bold mt-1.5 text-green-500">Actif</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inscrit</div>
                                    <div className="text-[10px] font-bold mt-1.5">2024</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                                >
                                    <UserMinus size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un étudiant">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nom complet</label>
                        <input
                            type="text"
                            required
                            value={newStudent.name}
                            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ex: Marie Martin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={newStudent.email}
                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ex: marie@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe temporaire</label>
                        <input
                            type="password"
                            required
                            value={newStudent.password}
                            onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="********"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-brand-500/20">
                        Ajouter l'étudiant
                    </button>
                </form>
            </Modal>
        </div>
    );
};
