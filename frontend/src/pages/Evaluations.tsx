import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Award, RefreshCw, Loader2 } from 'lucide-react';
import { evaluationsAPI } from '../services/api';
import { EvaluationViewer } from '../components/EvaluationViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Evaluation {
    id: string; // Submission ID
    quizId: string;
    courseTitle: string;
    quizTitle: string;
    date?: string;
    score?: number;
    maxScore?: number;
    status: 'passed' | 'failed';
}

export const Evaluations = () => {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const submissions = await evaluationsAPI.getMySubmissions();

            const mappedEvaluations: Evaluation[] = submissions.map((sub: any) => ({
                id: sub.id.toString(),
                quizId: sub.quiz_id.toString(),
                courseTitle: sub.course_title || 'Cours inconnu',
                quizTitle: sub.quiz_title || 'Évaluation',
                date: sub.submitted_at,
                score: sub.score,
                maxScore: sub.max_score || 100,
                status: sub.passed ? 'passed' : 'failed'
            }));

            setEvaluations(mappedEvaluations);
        } catch (error) {
            console.error("Failed to fetch evaluations", error);
            toast.error("Impossible de charger les évaluations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuizComplete = () => {
        toast.info("Quiz terminé !");
        setActiveQuizId(null);
        fetchData();
    };

    if (activeQuizId) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="fixed top-6 left-6 z-50">
                    <Button variant="outline" onClick={() => setActiveQuizId(null)}>
                        Quitter le quiz
                    </Button>
                </div>
                <div className="pt-16">
                    <EvaluationViewer quizId={activeQuizId} onComplete={handleQuizComplete} />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <Award className="text-brand-600" size={36} />
                    Mes <span className="text-brand-600">Évaluations</span>
                </h1>
                <p className="text-muted-foreground text-lg">Suivez vos résultats et vos certifications obtenues.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-brand-600" size={48} />
                    <p className="text-muted-foreground animate-pulse">Chargement de vos résultats...</p>
                </div>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 h-12">
                        <TabsTrigger value="all" className="text-sm font-semibold">Toutes</TabsTrigger>
                        <TabsTrigger value="passed" className="text-sm font-semibold">Réussies</TabsTrigger>
                        <TabsTrigger value="failed" className="text-sm font-semibold">À repasser</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {evaluations.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <ClipboardCheck className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900">Aucun résultat</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                    Vous n'avez pas encore passé d'évaluations. Continuez vos cours pour débloquer les examens !
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {evaluations.map((evalItem) => (
                                    <EvaluationItem
                                        key={evalItem.id}
                                        evaluation={evalItem}
                                        onRetake={() => setActiveQuizId(evalItem.quizId)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="passed" className="space-y-4">
                        <div className="grid gap-4">
                            {evaluations.filter(e => e.status === 'passed').map((evalItem) => (
                                <EvaluationItem key={evalItem.id} evaluation={evalItem} onRetake={() => setActiveQuizId(evalItem.quizId)} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="failed" className="space-y-4">
                        <div className="grid gap-4">
                            {evaluations.filter(e => e.status === 'failed').map((evalItem) => (
                                <EvaluationItem key={evalItem.id} evaluation={evalItem} onRetake={() => setActiveQuizId(evalItem.quizId)} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

const EvaluationItem = ({ evaluation, onRetake }: { evaluation: Evaluation, onRetake: () => void }) => {
    const isPassed = evaluation.status === 'passed';

    return (
        <Card className="group hover:border-brand-500/50 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden bg-white">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isPassed ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                        }`}>
                        <ClipboardCheck size={24} />
                    </div>

                    <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {evaluation.courseTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-sm font-medium text-slate-600">{evaluation.quizTitle}</span>
                            <span className="text-slate-300 hidden sm:inline">•</span>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock size={14} />
                                <span className="text-xs font-medium uppercase tracking-wider">
                                    {evaluation.date ? new Date(evaluation.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'Date inconnue'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="text-center sm:text-right px-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score Final</p>
                            <p className="text-2xl font-black text-slate-900">
                                {evaluation.score}<span className="text-slate-400 text-sm font-bold">/{evaluation.maxScore}</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Badge variant={isPassed ? 'default' : 'destructive'} className={`px-4 py-1.5 rounded-full font-bold flex items-center justify-center gap-2 ${isPassed ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                                }`}>
                                {isPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                {isPassed ? 'Réussi' : 'Échoué'}
                            </Badge>

                            {!isPassed && (
                                <Button
                                    onClick={onRetake}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-[11px] font-bold uppercase tracking-wider gap-2 border-slate-200 hover:border-brand-500 hover:text-brand-600"
                                >
                                    <RefreshCw size={12} />
                                    Repasser
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
