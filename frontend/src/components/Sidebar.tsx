import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    GraduationCap,
    UserCircle,
    PlusSquare,
    Award,
    ClipboardCheck,
    UsersRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-brand-500/20 text-brand-500 ring-1 ring-brand-500/20 dark:text-brand-400 dark:ring-brand-500/50'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { role, setRole, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navigation = {
        STUDENT: [
            { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
            { id: 'my-courses', path: '/my-courses', icon: BookOpen, label: 'Mes Cours' },
            { id: 'evaluations', path: '/evaluations', icon: ClipboardCheck, label: 'Évaluations' },
            { id: 'certifications', path: '/certifications', icon: Award, label: 'Certifications' },
        ],
        TEACHER: [
            { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
            { id: 'course-management', path: '/course-management', icon: PlusSquare, label: 'Gestion des cours' },
        ],
        ADMIN: [
            { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Statistiques' },
            { id: 'course-management', path: '/course-management', icon: BookOpen, label: 'Gestion Cours' },
            { id: 'student-management', path: '/student-management', icon: GraduationCap, label: 'Gestion Étudiants' },
            { id: 'teacher-management', path: '/teacher-management', icon: UsersRound, label: 'Gestion Enseignants' },
        ]
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRoleChange = (newRole: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
        setRole(newRole);
        navigate('/dashboard');
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.aside
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    className="w-72 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-50"
                >
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">EEUEZ Academy</span>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 pb-2">
                            Espace {role}
                        </div>
                        {navigation[role].map((item) => (
                            <SidebarItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <div className="p-4 rounded-2xl bg-secondary space-y-3">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Demo Roles
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(['STUDENT', 'TEACHER', 'ADMIN'] as const).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => handleRoleChange(r)}
                                        className={`text-[10px] px-2 py-1.5 rounded-lg transition-colors capitalize font-bold ${role === r
                                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {r.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-border flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-secondary border border-border overflow-hidden cursor-pointer"
                            onClick={() => navigate('/profile')}
                        >
                            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-semibold truncate leading-none mb-1">{user?.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{user?.role}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            title="Se déconnecter"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};
