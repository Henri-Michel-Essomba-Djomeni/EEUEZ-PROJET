import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, CheckCircle } from 'lucide-react';

export const Register = ({ onRegister, onSwitch }: { onRegister: () => void, onSwitch: () => void }) => {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 mb-8">
                            <div className="p-2 bg-brand-100 rounded-lg">
                                <GraduationCap className="text-brand-600" size={32} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">EEUEZ Academy</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">Créer un compte</h1>
                        <p className="text-slate-500">Rejoignez notre communauté d'apprenants.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <button
                            type="button"
                            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors text-slate-600 font-medium"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            S'inscrire avec Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Ou avec votre email</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="votre@email.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
                        >
                            Créer mon compte
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Déjà un compte ?{' '}
                        <button onClick={() => navigate('/login')} className="text-brand-600 font-bold hover:underline">
                            Se connecter
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Side - Marketing Panel */}
            <div className="hidden lg:flex w-1/2 bg-brand-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 to-brand-800/90"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-8 p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-sm">
                        <GraduationCap size={40} className="text-brand-300" />
                    </div>

                    <h2 className="text-4xl font-bold mb-6">Commencez votre voyage d'apprentissage</h2>
                    <p className="text-brand-100 text-lg mb-8 leading-relaxed">
                        Rejoignez EEUEZ Academy et accédez à des ressources exclusives pour booster votre carrière.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Accès illimité aux cours",
                            "Communauté active d'apprenants",
                            "Mentorat personnalisé"
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <div className="p-1 bg-brand-500 rounded-full">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                                <span className="font-medium">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
