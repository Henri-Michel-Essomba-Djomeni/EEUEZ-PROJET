import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Target } from 'lucide-react';

export const TeacherDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">Vue <span className="text-brand-400">D'ensemble</span></h2>
                <p className="text-muted-foreground">Voici l'état actuel de votre espace enseignant.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Étudiants', value: '2,456', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Mes Cours', value: '8', icon: BookOpen, color: 'text-brand-500', bg: 'bg-brand-500/10' },
                    { label: 'Revenus', value: '3.8M FCFA', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-3xl border-border/50 flex items-center gap-4"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                            <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-12 glass-panel rounded-3xl border-border/50 border-dashed text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-secondary text-muted-foreground">
                    <Target size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold uppercase italic tracking-tighter">Créez votre prochain cours</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Utilisez "Gestion des cours" pour créer et publier de nouveaux contenus pédagogiques.
                    </p>
                </div>
            </div>
        </div>
    );
};
