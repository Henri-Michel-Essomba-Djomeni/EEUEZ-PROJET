import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, ArrowRight, CheckCircle, Star, Globe, Zap, ShieldCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-brand-100 selection:text-brand-900">
            {/* Header / Nav */}
            <header className="fixed w-full top-0 z-50 transition-all">
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800" />
                <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic text-slate-900 dark:text-white">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span>EEUEZ<span className="text-brand-600">ACADEMY</span></span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                        <a href="#features" className="hover:text-brand-600 transition-colors">Fonctionnalités</a>
                        <a href="#catalog" className="hover:text-brand-600 transition-colors">Catalogue</a>
                        <a href="#testimonials" className="hover:text-brand-600 transition-colors">Témoignages</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/login')}
                            className="font-bold uppercase tracking-wider text-xs hidden sm:flex"
                        >
                            Connexion
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                            className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-8 h-11 font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Démarrer
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-400/20 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex-1 text-center lg:text-left"
                        >
                            <Badge className="bg-brand-50 text-brand-700 hover:bg-brand-50 border-brand-100 px-4 py-1.5 rounded-full mb-6 font-black uppercase tracking-[0.2em] text-[10px]">
                                <Zap className="w-3 h-3 mr-2" fill="currentColor" />
                                Plateforme de formation N°1
                            </Badge>

                            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-slate-900 dark:text-white">
                                MAÎTRISEZ<br />
                                LE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 italic">FUTUR</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                                Rejoignez une communauté mondiale d'apprenants. Accédez à des formations de haute qualité et obtenez des certifications reconnues.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button
                                    onClick={() => navigate('/register')}
                                    className="h-16 px-10 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-brand-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                >
                                    Apprendre Gratuitement <ArrowRight className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-16 px-10 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                                >
                                    Catalogue
                                </Button>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
                                            <Users size={20} className="text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                        {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                                        <span className="text-slate-900 dark:text-white font-black ml-2 text-sm">4.9/5</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejoint par +10,000 étudiants</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex-1 relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)] border-8 border-white dark:border-slate-900 bg-slate-100 aspect-[4/5] flex flex-col">
                                <div className="h-12 bg-white dark:bg-slate-900 flex items-center px-6 gap-2 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="mx-auto w-1/2 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                                </div>
                                <div className="flex-1 bg-white dark:bg-slate-950 p-8 flex flex-col justify-center items-center text-center">
                                    <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                        <Play className="w-10 h-10 text-brand-600" fill="currentColor" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 tracking-tight">Expérience Immersive</h3>
                                    <p className="text-slate-400 font-medium max-w-xs">Apprenez par la pratique avec nos laboratoires interactifs.</p>

                                    <div className="mt-12 w-full space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -right-6 z-20 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">98%</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taux de réussite</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">50+</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pays représentés</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <Badge className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full mb-6 font-black uppercase tracking-[0.2em] text-[10px] border-brand-100">
                            Pourquoi nous ?
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">UNE MÉTHODE <span className="text-brand-600 italic">RÉVOLUTIONNAIRE</span></h2>
                        <p className="text-xl text-slate-500 font-medium">
                            Nous avons repensé l'apprentissage pour le rendre plus efficace, interactif et orienté vers les résultats professionnels.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Award className="w-8 h-8" />,
                                title: "Certifications de Valeur",
                                description: "Obtenez des diplômes certifiés par EEUEZ Academy pour valoriser votre profil auprès des recruteurs.",
                                color: "emerald"
                            },
                            {
                                icon: <Zap className="w-8 h-8" />,
                                title: "Apprentissage Rapide",
                                description: "Nos modules sont conçus pour une assimilation optimale des concepts techniques complexes.",
                                color: "brand"
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8" />,
                                title: "Accès à Vie",
                                description: "Apprenez à votre rythme. Une fois inscrit, le contenu reste accessible indéfiniment.",
                                color: "blue"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic text-slate-900 dark:text-white">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-500 py-24 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic text-white mb-8">
                                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                <span>EEUEZ<span className="text-brand-600">ACADEMY</span></span>
                            </div>
                            <p className="text-sm leading-relaxed mb-8">
                                Former la prochaine génération de leaders technologiques grâce à une éducation accessible et de haute qualité.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-8">Plateforme</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Explorer les cours</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Mentorat</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Tarification</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-8">Communauté</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><a href="#" className="hover:text-brand-500 transition-colors">À propos</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Évènements</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-8">Légal</h4>
                            <ul className="space-y-4 text-sm font-bold">
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Confidentialité</a></li>
                                <li><a href="#" className="hover:text-brand-500 transition-colors">Conditions d'utilisation</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} EEUEZ ACADEMY. TOUS DROITS RÉSERVÉS.
                        </p>
                        <div className="flex gap-6">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                            <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                            <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
