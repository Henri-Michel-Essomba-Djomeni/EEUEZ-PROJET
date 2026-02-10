import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Target } from 'lucide-react';

export const TeacherDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-bold uppercase  leading-none text-slate-900">Vue <span className="text-brand-600">D'ensemble</span></h2>
                <p className="text-slate-500 text-sm ">Voici l'état actuel de votre espace enseignant.</p>
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
                        className="glass-panel p-4 rounded-xl border-border/50 flex items-center gap-3 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">{stat.label}</div>
                            <div className="text-lg font-bold text-foreground">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="py-12 glass-panel rounded-xl border-border/50 border-dashed text-center space-y-3 bg-slate-50/50">
                <div className="inline-flex p-3 rounded-full bg-white text-brand-600 shadow-sm border border-slate-100">
                    <Target size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Créez votre prochain cours</h3>
                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
                        Utilisez "Gestion des cours" pour créer et publier de nouveaux contenus pédagogiques.
                    </p>
                </div>
            </div>
        </div>
    );
};
