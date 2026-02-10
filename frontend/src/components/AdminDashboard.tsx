import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Target } from 'lucide-react';

export const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-bold uppercase  tracking-tighter leading-none text-slate-900">Vue <span className="text-brand-600">D'ensemble</span></h2>
                <p className="text-slate-500 text-sm ">Voici l'état actuel de votre espace admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Utilisateurs', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Cours Actifs', value: '42', icon: BookOpen, color: 'text-brand-500', bg: 'bg-brand-500/10' },
                    { label: 'Revenus', value: '15.2M FCFA', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest ">{stat.label}</div>
                            <div className="text-lg font-bold tracking-tight text-slate-900">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="py-12 glass-panel rounded-xl border-border/50 border-dashed text-center space-y-3 bg-slate-50/50">
                <div className="inline-flex p-3 rounded-full bg-white text-brand-600 shadow-sm border border-slate-100">
                    <Target size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase  tracking-tighter text-slate-900">Plus d'analyses arrivent</h3>
                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto ">
                        Nous préparons de nouveaux graphiques interactifs pour vous aider à mieux piloter votre activité.
                    </p>
                </div>
            </div>
        </div>
    );
};
