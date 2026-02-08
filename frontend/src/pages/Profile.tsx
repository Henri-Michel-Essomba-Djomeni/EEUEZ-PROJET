import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        location: 'Douala, Cameroun',
        joinDate: 'Janvier 2024'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Here you would normally save to backend
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Mon <span className="text-brand-400">Profil</span>
                    </h2>
                    <p className="text-muted-foreground">Gérez vos informations personnelles.</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <Edit3 size={18} /> Modifier
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 transition-all"
                        >
                            <Save size={18} /> Enregistrer
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 bg-secondary hover:bg-muted text-foreground rounded-2xl text-sm font-bold flex items-center gap-2 transition-all"
                        >
                            <X size={18} /> Annuler
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-3xl text-center space-y-6"
                >
                    <div className="inline-block relative">
                        <div className="w-32 h-32 rounded-full bg-secondary border-4 border-border overflow-hidden">
                            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors">
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mt-1">{user?.role}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-panel p-8 rounded-3xl space-y-6"
                >
                    <h3 className="text-xl font-bold uppercase italic tracking-tighter">Informations Personnelles</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User size={14} /> Nom Complet
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                />
                            ) : (
                                <div className="text-lg font-semibold">{formData.name}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Mail size={14} /> Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                />
                            ) : (
                                <div className="text-lg font-semibold">{formData.email}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <MapPin size={14} /> Localisation
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                />
                            ) : (
                                <div className="text-lg font-semibold">{formData.location}</div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Calendar size={14} /> Membre depuis
                            </label>
                            <div className="text-lg font-semibold">{formData.joinDate}</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
