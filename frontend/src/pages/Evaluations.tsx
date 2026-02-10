import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Award, RefreshCw, Loader2 } from 'lucide-react';
import { evaluationsAPI } from '../services/api';
import { EvaluationViewer } from '../components/EvaluationViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
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

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <Dialog open={!!activeQuizId} onOpenChange={(open) => !open && setActiveQuizId(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                    <div className="bg-background rounded-2xl overflow-hidden p-6 shadow-2xl border border-border">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">
                                Évaluation <span className="text-brand-600">En Cours</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs italic">
                                Répondez aux questions pour valider vos compétences.
                            </DialogDescription>
                        </DialogHeader>
                        {activeQuizId && (
                            <EvaluationViewer quizId={activeQuizId} onComplete={handleQuizComplete} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col gap-1 mb-4">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 italic">
                    <Award className="text-brand-600" size={24} />
                    Mes <span className="text-brand-600">Évaluations</span>
                </h1>
                <p className="text-muted-foreground text-sm italic">Suivez vos résultats et vos certifications obtenues.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="animate-spin text-brand-600" size={32} />
                    <p className="text-xs text-muted-foreground animate-pulse">Chargement de vos résultats...</p>
                </div>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-xs mb-4 h-9">
                        <TabsTrigger value="all" className="text-xs font-semibold">Toutes</TabsTrigger>
                        <TabsTrigger value="passed" className="text-xs font-semibold">Réussies</TabsTrigger>
                        <TabsTrigger value="failed" className="text-xs font-semibold">À repasser</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-3">
                        {evaluations.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <ClipboardCheck className="mx-auto h-10 w-10 text-slate-200 mb-2" />
                                <h3 className="text-sm font-semibold text-slate-900 italic">Aucun résultat</h3>
                                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                                    Vous n'avez pas encore passé d'évaluations.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
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

                    <TabsContent value="passed" className="space-y-3">
                        <div className="grid gap-3">
                            {evaluations.filter(e => e.status === 'passed').map((evalItem) => (
                                <EvaluationItem key={evalItem.id} evaluation={evalItem} onRetake={() => setActiveQuizId(evalItem.quizId)} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="failed" className="space-y-3">
                        <div className="grid gap-3">
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
                <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isPassed ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                        }`}>
                        <ClipboardCheck size={18} />
                    </div>

                    <div className="flex-1 space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors italic">
                            {evaluation.courseTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-xs font-medium text-slate-600">{evaluation.quizTitle}</span>
                            <span className="text-slate-300 hidden sm:inline text-sm">•</span>
                            <div className="flex items-center gap-1 text-slate-400">
                                <Clock size={12} />
                                <span className="text-sm font-medium uppercase tracking-wider">
                                    {evaluation.date ? new Date(evaluation.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'Date inconnue'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="text-center sm:text-right px-2">
                            <p className="text-xs font-bold text-slate-400 uppercase  mb-0.5">Score Final</p>
                            <p className="text-lg font-bold text-slate-900">
                                {evaluation.score}<span className="text-slate-400 text-xs font-bold">/{evaluation.maxScore}</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Badge variant={isPassed ? 'default' : 'destructive'} className={`px-3 py-0.5 rounded-full font-bold text-sm flex items-center justify-center gap-1 ${isPassed ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                                }`}>
                                {isPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                {isPassed ? 'Réussi' : 'Échoué'}
                            </Badge>

                            {!isPassed && (
                                <Button
                                    onClick={onRetake}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-sm font-bold uppercase tracking-wider gap-1.5 border-slate-200 hover:border-brand-500 hover:text-brand-600 p-0 px-2"
                                >
                                    <RefreshCw size={10} />
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
