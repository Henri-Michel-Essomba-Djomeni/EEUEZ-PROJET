import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, Edit3, Save, X, Camera, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        location: 'Douala, Cameroun',
        bio: 'Passionné de technologie et de développement web. Apprenant enthousiaste chez EEUEZ Academy.'
    });

    const handleSave = () => {
        setIsEditing(false);
        toast.success("Profil mis à jour avec succès !");
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <Badge className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full mb-2 font-black uppercase tracking-widest text-[10px] border-brand-100">
                        Paramètres du compte
                    </Badge>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
                        Mon <span className="text-brand-600">Profil</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Gérez votre identité et vos préférences.</p>
                </div>

                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Edit3 className="mr-2 h-5 w-5" /> Modifier le profil
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all"
                        >
                            <Save className="mr-2 h-5 w-5" /> Enregistrer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="h-14 px-8 border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            <X className="mr-2 h-5 w-5" /> Annuler
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
                        <CardContent className="p-10 text-center space-y-8">
                            <div className="relative inline-block group">
                                <div className="w-40 h-40 rounded-full bg-slate-50 border-8 border-white shadow-2xl overflow-hidden group-hover:opacity-90 transition-opacity">
                                    <img
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-2 right-2 p-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/30">
                                        <Camera size={20} />
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formData.name}</h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-brand-50 text-brand-700 font-black uppercase tracking-[0.2em] text-[10px] px-3">
                                        {user?.role || 'Apprenant'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cours finis</p>
                                    <p className="text-xl font-black text-slate-900">12</p>
                                </div>
                                <div className="border-l border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Moyen</p>
                                    <p className="text-xl font-black text-brand-600">85%</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <MapPin size={16} className="text-brand-500" />
                                    {formData.location}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <Calendar size={16} className="text-brand-500" />
                                    Membre depuis Janvier 2024
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-slate-400 border-none rounded-[2.5rem] overflow-hidden p-8 space-y-6">
                        <div className="flex items-center gap-4 text-white">
                            <ShieldCheck size={32} className="text-brand-500" />
                            <div>
                                <p className="font-black uppercase tracking-widest text-xs">Abonnement</p>
                                <p className="text-xl font-black">Plan Premium</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Vous profitez d'un accès illimité à toutes nos formations et certifications.
                        </p>
                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border-none transition-all">
                            Gérer l'abonnement
                        </Button>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-slate-200 rounded-[2.5rem] shadow-sm bg-white overflow-hidden">
                        <CardHeader className="p-10 pb-0">
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                <User className="text-brand-600" size={24} />
                                Détails du <span className="text-brand-600">Compte</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nom Complet</label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-14 rounded-2xl border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold"
                                        />
                                    ) : (
                                        <div className="h-14 flex items-center px-6 bg-slate-50 rounded-2xl font-bold text-slate-900">{formData.name}</div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Adresse Email</label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-14 rounded-2xl border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold"
                                        />
                                    ) : (
                                        <div className="h-14 flex items-center px-6 bg-slate-50 rounded-2xl font-bold text-slate-600">{formData.email}</div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Localisation</label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="h-14 rounded-2xl border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold"
                                        />
                                    ) : (
                                        <div className="h-14 flex items-center px-6 bg-slate-50 rounded-2xl font-bold text-slate-900">{formData.location}</div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Niveau d'expertise</label>
                                    <div className="h-14 flex items-center px-6 bg-slate-50 rounded-2xl font-bold text-slate-900">Intermédiaire</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Biographie</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full min-h-[120px] p-6 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-700 bg-white"
                                    />
                                ) : (
                                    <div className="p-6 bg-slate-50 rounded-2xl font-medium text-slate-600 leading-relaxed italic">
                                        "{formData.bio}"
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-brand-50/50 border-brand-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                        <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-500/20">
                            <Zap size={36} fill="white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-black mb-1">Boostez votre visibilité !</h4>
                            <p className="text-slate-500 font-medium">Partagez votre profil et vos certifications sur LinkedIn pour attirer les recruteurs.</p>
                        </div>
                        <Button variant="outline" className="h-12 border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white rounded-xl font-bold px-8">
                            Partager
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
