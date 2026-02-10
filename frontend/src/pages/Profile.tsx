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
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="space-y-1">
                    <Badge className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full mb-1 font-bold uppercase  text-xs border-brand-100 ">
                        Paramètres du compte
                    </Badge>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight ">
                        Mon <span className="text-brand-600">Profil</span>
                    </h1>
                    <p className="text-slate-500 text-sm ">Gérez votre identité et vos préférences.</p>
                </div>

                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="h-10 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold uppercase  text-sm shadow-md shadow-brand-500/10 transition-all hover:scale-[1.02]"
                    >
                        <Edit3 className="mr-2 h-4 w-4" /> Modifier le profil
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSave}
                            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold uppercase  text-sm shadow-md shadow-emerald-500/10 transition-all"
                        >
                            <Save className="mr-2 h-4 w-4" /> Enregistrer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="h-10 px-6 border-slate-200 text-slate-500 rounded-lg font-bold uppercase  text-sm hover:bg-slate-50 transition-all"
                        >
                            <X className="mr-2 h-4 w-4" /> Annuler
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                        <CardContent className="p-6 text-center space-y-6">
                            <div className="relative inline-block group">
                                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-lg overflow-hidden group-hover:opacity-90 transition-opacity mx-auto">
                                    <img
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-1 right-1 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all shadow-lg border border-white">
                                        <Camera size={14} />
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight ">{formData.name}</h3>
                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                    <Badge variant="secondary" className="bg-brand-50 text-brand-700 font-bold uppercase  text-xs px-2 py-0 border-none">
                                        {user?.role || 'Apprenant'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 py-4 border-y border-slate-50">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase  mb-0.5">Cours finis</p>
                                    <p className="text-lg font-bold text-slate-900">12</p>
                                </div>
                                <div className="border-l border-slate-50">
                                    <p className="text-xs font-bold text-slate-400 uppercase  mb-0.5">Score Moyen</p>
                                    <p className="text-lg font-bold text-brand-600">85%</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium ">
                                    <MapPin size={12} className="text-brand-500" />
                                    {formData.location}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium ">
                                    <Calendar size={12} className="text-brand-500" />
                                    Membre depuis Janvier 2024
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-slate-400 border-none rounded-xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3 text-white">
                            <ShieldCheck size={24} className="text-brand-500" />
                            <div>
                                <p className="font-bold uppercase  text-xs ">Abonnement</p>
                                <p className="text-lg font-bold ">Plan Premium</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed ">
                            Accès illimité à toutes nos formations et certifications.
                        </p>
                        <Button className="w-full h-10 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold border-none transition-all text-sm">
                            Gérer l'abonnement
                        </Button>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-8 space-y-4">
                    <Card className="border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
                        <CardHeader className="p-6 pb-0">
                            <CardTitle className="text-lg font-bold text-slate-900 uppercase  tracking-tighter flex items-center gap-2">
                                <User className="text-brand-600" size={18} />
                                Détails du <span className="text-brand-600">Compte</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase  text-slate-400 ">Nom Complet</label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-10 rounded-lg border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold text-sm"
                                        />
                                    ) : (
                                        <div className="h-10 flex items-center px-4 bg-slate-50 rounded-lg font-bold text-slate-900 text-sm">{formData.name}</div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase  text-slate-400 ">Adresse Email</label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-10 rounded-lg border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold text-sm"
                                        />
                                    ) : (
                                        <div className="h-10 flex items-center px-4 bg-slate-50 rounded-lg font-bold text-slate-600 text-sm">{formData.email}</div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase  text-slate-400 ">Localisation</label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="h-10 rounded-lg border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 font-bold text-sm"
                                        />
                                    ) : (
                                        <div className="h-10 flex items-center px-4 bg-slate-50 rounded-lg font-bold text-slate-900 text-sm">{formData.location}</div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase  text-slate-400 ">Niveau</label>
                                    <div className="h-10 flex items-center px-4 bg-slate-50 rounded-lg font-bold text-slate-900 text-sm">Intermédiaire</div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase  text-slate-400 ">Biographie</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full min-h-[80px] p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-xs text-slate-700 bg-white"
                                    />
                                ) : (
                                    <div className="p-4 bg-slate-50 rounded-lg font-medium text-xs text-slate-600 leading-relaxed ">
                                        "{formData.bio}"
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-brand-50/50 border-brand-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/10">
                            <Zap size={20} fill="white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-sm font-bold mb-0.5 ">Boostez votre visibilité !</h4>
                            <p className="text-slate-500 text-sm font-medium">Partagez votre profil sur LinkedIn.</p>
                        </div>
                        <Button variant="outline" className="h-9 border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white rounded-lg font-bold px-6 text-sm">
                            Partager
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
