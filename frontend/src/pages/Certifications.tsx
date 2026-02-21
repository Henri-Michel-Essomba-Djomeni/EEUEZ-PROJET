import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Trophy, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { certificationsAPI, authAPI } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CertificateTemplate } from '../components/CertificateTemplate';

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
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const [certsData, userData] = await Promise.all([
                    certificationsAPI.getMyCertifications(),
                    authAPI.getCurrentUser()
                ]);
                setCertificates(certsData);
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch certifications", error);
                toast.error("Impossible de charger les certifications.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCerts();
    }, []);

    const handleDownload = async (cert: Certificate) => {
        setIsDownloading(cert.id);
        const toastId = toast.loading("Génération de votre certificat premium...");

        try {
            // Give React a moment to render the hidden template if needed
            // Though we use a technique where it's always there but hidden from view
            await new Promise(resolve => setTimeout(resolve, 500));

            const element = document.getElementById('certificate-template');
            if (!element) throw new Error("Template not found");

            const canvas = await html2canvas(element, {
                scale: 2, // High quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1123, 794] // Matches template size
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
            pdf.save(`Certificat_EEUEZ_${cert.courseTitle.replace(/\s+/g, '_')}.pdf`);

            toast.success("Certificat téléchargé avec succès !", { id: toastId });
        } catch (error) {
            console.error("Download failed", error);
            toast.error("Échec du téléchargement du certificat.", { id: toastId });
        } finally {
            setIsDownloading(null);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <div className="flex flex-col gap-1 mb-6">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 italic">
                    <Trophy className="text-brand-600" size={24} />
                    Mes <span className="text-brand-600">Certifications</span>
                </h1>
                <p className="text-muted-foreground text-sm">Vos accomplissements officiels.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <Loader2 className="animate-spin text-brand-600" size={32} />
                    <p className="text-xs text-muted-foreground">Recherche de vos diplômes...</p>
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 bg-white relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Award size={60} />
                                </div>

                                <CardContent className="p-4 space-y-4 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                                            <Trophy size={18} />
                                        </div>
                                        <div className="flex items-center gap-0.5 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-900 leading-tight uppercase italic tracking-tighter group-hover:text-brand-600 transition-colors line-clamp-2">
                                            {cert.courseTitle}
                                        </h3>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-medium text-slate-500">
                                                Délivré le {new Date(cert.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <Badge variant="outline" className="w-fit text-xs font-bold uppercase  border-slate-100 bg-slate-50 text-slate-400 py-0 px-1">
                                                ID: {cert.certificateCode || cert.id.substring(0, 8)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1 py-3 border-y border-slate-50">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-0">Instructeur</p>
                                            <p className="font-bold text-slate-900 text-sm truncate">{cert.instructor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-0">Score</p>
                                            <p className="text-sm font-bold text-emerald-600">{cert.score}%</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => handleDownload(cert)}
                                            disabled={isDownloading === cert.id}
                                            className="flex-1 h-8 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg font-bold uppercase  text-xs shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-1"
                                        >
                                            {isDownloading === cert.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <Download className="h-3 w-3" />
                                            )}
                                            {isDownloading === cert.id ? "Génération..." : "Télécharger"}
                                        </button>
                                        <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-500 transition-all flex items-center justify-center">
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm border border-slate-100">
                        <Award size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase italic tracking-tighter">Aucune certification</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 text-xs leading-relaxed font-medium">
                        Complétez vos cours et réussissez les évaluations pour obtenir vos diplômes.
                    </p>
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/dashboard'}
                        className="mt-6 text-brand-600 font-bold uppercase  hover:bg-white h-10 text-xs"
                    >
                        Parcourir les cours
                    </Button>
                </div>
            )}

            {/* Hidden Certificate Template for PDF Generation */}
            <div className="fixed -left-[2000px] top-0 pointer-events-none">
                {isDownloading && certificates.find(c => c.id === isDownloading) && (
                    <CertificateTemplate
                        studentName={`${user?.firstName || 'Étudiant'} ${user?.lastName || 'EEUEZ'}`}
                        courseTitle={certificates.find(c => c.id === isDownloading)!.courseTitle}
                        date={new Date(certificates.find(c => c.id === isDownloading)!.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        instructor={certificates.find(c => c.id === isDownloading)!.instructor}
                        certificateId={certificates.find(c => c.id === isDownloading)!.certificateCode || isDownloading.substring(0, 12).toUpperCase()}
                        score={certificates.find(c => c.id === isDownloading)!.score}
                    />
                )}
            </div>
        </div>
    );
};
