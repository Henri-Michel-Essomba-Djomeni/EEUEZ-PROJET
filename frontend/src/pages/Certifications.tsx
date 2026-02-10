import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Trophy, Star, Loader2 } from 'lucide-react';
import { certificationsAPI } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
                toast.error("Impossible de charger les certifications.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
                    <Trophy className="text-brand-600" size={36} />
                    Mes <span className="text-brand-600">Certifications</span>
                </h1>
                <p className="text-muted-foreground text-lg">Vos accomplissements et certificats officiels obtenus.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-brand-600" size={48} />
                    <p className="text-muted-foreground">Recherche de vos diplômes...</p>
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                    <Award size={120} />
                                </div>

                                <CardContent className="p-10 space-y-8 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                                            <Trophy size={32} />
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter group-hover:text-brand-600 transition-colors">
                                            {cert.courseTitle}
                                        </h3>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium text-slate-500">
                                                Délivré le {new Date(cert.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <Badge variant="outline" className="w-fit text-[10px] font-black uppercase tracking-widest border-slate-100 bg-slate-50 text-slate-400">
                                                ID: {cert.certificateCode || cert.id.substring(0, 8)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Instructeur</p>
                                            <p className="font-bold text-slate-900">{cert.instructor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Score</p>
                                            <p className="text-2xl font-black text-emerald-600">{cert.score}%</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02]">
                                            <Download className="mr-2 h-5 w-5" /> Télécharger
                                        </Button>
                                        <Button variant="outline" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-500 transition-all">
                                            <Share2 size={24} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm">
                        <Award size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Aucune certification</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                        Relevez le défi ! Complétez vos cours et réussissez les évaluations pour obtenir vos premiers diplômes.
                    </p>
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/dashboard'}
                        className="mt-8 text-brand-600 font-black uppercase tracking-widest hover:bg-white"
                    >
                        Parcourir les cours
                    </Button>
                </div>
            )}
        </div>
    );
};
