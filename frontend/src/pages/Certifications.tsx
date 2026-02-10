import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Trophy, Star } from 'lucide-react';
import { certificationsAPI } from '../services/api';

interface Certificate {
    id: string;
    courseTitle: string;
    issueDate: string;
    instructor: string;
    score: number;
    certificateCode?: string;
}

export const Certifications = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const data = await certificationsAPI.getMyCertifications();
                setCertificates(data);
            } catch (error) {
                console.error("Failed to fetch certifications", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Mes <span className="text-brand-400">Certifications</span>
                    </h2>
                    <p className="text-muted-foreground">Vos accomplissements et certificats obtenus.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 rounded-3xl space-y-6 border-border/50 hover:border-brand-500/30 transition-all group relative overflow-hidden"
                        >
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white">
                                        <Trophy size={32} />
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">{cert.courseTitle}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Délivré le {new Date(cert.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                        Par {cert.instructor}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                                    <div className="flex-1 text-center p-3 rounded-xl bg-secondary">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score Final</div>
                                        <div className="text-2xl font-black text-brand-500">{cert.score}%</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                                        <Download size={16} /> Télécharger
                                    </button>
                                    <button className="px-4 py-3 bg-secondary hover:bg-muted text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="p-12 glass-panel rounded-3xl border-border/50 border-dashed text-center space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-secondary text-muted-foreground">
                        <Award size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold uppercase italic tracking-tighter">Aucune certification</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Complétez vos cours et réussissez les évaluations pour obtenir vos premières certifications !
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
