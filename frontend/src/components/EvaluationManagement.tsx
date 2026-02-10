import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, ClipboardList, Users, Award, Plus, X, Check } from 'lucide-react';
import { evaluationsAPI } from '../services/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface QuizOption {
    option_text: string;
    is_correct: boolean;
    order_index: number;
}

interface QuizQuestion {
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    points: number;
    order_index: number;
    options?: QuizOption[];
}

interface Quiz {
    id: number;
    course_id: number;
    title: string;
    description: string;
    passing_score: number;
    duration_minutes: number;
    order_index: number;
    questions?: QuizQuestion[];
}

interface EvaluationManagementProps {
    courseId: string;
}

export const EvaluationManagement: React.FC<EvaluationManagementProps> = ({ courseId }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewingSubmissions, setViewingSubmissions] = useState<number | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        passing_score: 70,
        duration_minutes: 30
    });

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);

    useEffect(() => {
        loadQuizzes();
    }, [courseId]);

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const data = await evaluationsAPI.getQuizzesByCourse(courseId);
            setQuizzes(data);
        } catch (error) {
            console.error('Failed to load quizzes', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubmissions = async (quizId: number) => {
        try {
            const data = await evaluationsAPI.getQuizSubmissions(quizId.toString());
            setSubmissions(data);
            setViewingSubmissions(quizId);
        } catch (error) {
            console.error('Failed to load submissions', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const quizData = {
                ...formData,
                course_id: parseInt(courseId),
                order_index: editingQuiz ? editingQuiz.order_index : quizzes.length + 1,
                questions: questions.map((q, idx) => ({
                    ...q,
                    order_index: idx + 1
                }))
            };

            if (editingQuiz) {
                await evaluationsAPI.updateQuiz(editingQuiz.id.toString(), quizData);
            } else {
                await evaluationsAPI.createQuiz(quizData);
            }

            await loadQuizzes();
            closeModal();
        } catch (error) {
            console.error('Failed to save quiz', error);
            alert('Erreur lors de la sauvegarde du quiz');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) return;

        try {
            await evaluationsAPI.deleteQuiz(id.toString());
            await loadQuizzes();
        } catch (error) {
            console.error('Failed to delete quiz', error);
            alert('Erreur lors de la suppression du quiz');
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                question_type: 'multiple_choice',
                points: 1,
                order_index: questions.length + 1,
                options: [
                    { option_text: '', is_correct: false, order_index: 1 },
                    { option_text: '', is_correct: false, order_index: 2 }
                ]
            }
        ]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };

        // If changing to true/false, set default options
        if (field === 'question_type' && value === 'true_false') {
            updated[index].options = [
                { option_text: 'Vrai', is_correct: false, order_index: 1 },
                { option_text: 'Faux', is_correct: false, order_index: 2 }
            ];
        } else if (field === 'question_type' && value === 'short_answer') {
            updated[index].options = [];
        }

        setQuestions(updated);
    };

    const addOption = (questionIndex: number) => {
        const updated = [...questions];
        if (!updated[questionIndex].options) updated[questionIndex].options = [];
        updated[questionIndex].options!.push({
            option_text: '',
            is_correct: false,
            order_index: updated[questionIndex].options!.length + 1
        });
        setQuestions(updated);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updated = [...questions];
        updated[questionIndex].options = updated[questionIndex].options!.filter((_, i) => i !== optionIndex);
        setQuestions(updated);
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
        const updated = [...questions];
        updated[questionIndex].options![optionIndex] = {
            ...updated[questionIndex].options![optionIndex],
            [field]: value
        };
        setQuestions(updated);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
        setFormData({
            title: '',
            description: '',
            passing_score: 70,
            duration_minutes: 30
        });
        setQuestions([]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">
                        Gestion des <span className="text-brand-400">Évaluations</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {quizzes.length} quiz dans ce cours
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                >
                    <PlusCircle size={18} />
                    Créer un quiz
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {quizzes.map((quiz, index) => (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel p-6 rounded-2xl border border-border/50 hover:border-brand-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ClipboardList size={20} className="text-brand-500" />
                                        <h4 className="text-xl font-bold">{quiz.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-xl">
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Questions</div>
                                            <div className="text-lg font-bold">{quiz.questions?.length || 0}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Durée</div>
                                            <div className="text-lg font-bold">{quiz.duration_minutes}min</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Note min.</div>
                                            <div className="text-lg font-bold">{quiz.passing_score}%</div>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                onClick={() => loadSubmissions(quiz.id)}
                                                className="text-xs text-brand-500 hover:underline font-bold uppercase tracking-widest flex items-center gap-1 mx-auto"
                                            >
                                                <Users size={12} />
                                                Soumissions
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(quiz.id)}
                                        className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {quizzes.length === 0 && (
                    <div className="text-center py-12 glass-panel rounded-2xl border border-dashed border-border">
                        <Award size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Aucun quiz pour le moment</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Créez un quiz pour évaluer vos étudiants
                        </p>
                    </div>
                )}
            </div>

            {/* Submissions Modal */}
            <Dialog open={!!viewingSubmissions} onOpenChange={(open) => !open && setViewingSubmissions(null)}>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Soumissions du quiz</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="p-4 bg-secondary rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{sub.user_name}</p>
                                        <p className="text-xs text-muted-foreground">{sub.user_email}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${sub.passed ? 'text-green-500' : 'text-red-500'}`}>
                                            {sub.score}/{sub.max_score}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round((sub.score / sub.max_score) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {submissions.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">Aucune soumission</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create/Edit Quiz Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingQuiz ? 'Modifier le quiz' : 'Nouveau quiz'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Titre du quiz</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="Ex: Quiz final - React Avancé"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none min-h-[80px]"
                                    placeholder="Décrivez le quiz..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Note minimale (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.passing_score}
                                        onChange={e => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.duration_minutes}
                                        onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold">Questions</h4>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-bold flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Ajouter
                                </button>
                            </div>

                            <div className="space-y-4">
                                {questions.map((question, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-secondary/50 rounded-xl space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-bold text-brand-500">Q{qIdx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIdx)}
                                                className="p-1 hover:bg-destructive/20 text-destructive rounded"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            required
                                            value={question.question_text}
                                            onChange={e => updateQuestion(qIdx, 'question_text', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                            placeholder="Question..."
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={question.question_type}
                                                onChange={e => updateQuestion(qIdx, 'question_type', e.target.value)}
                                                className="px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                            >
                                                <option value="multiple_choice">Choix multiple</option>
                                                <option value="true_false">Vrai/Faux</option>
                                                <option value="short_answer">Réponse courte</option>
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                value={question.points}
                                                onChange={e => updateQuestion(qIdx, 'points', parseInt(e.target.value))}
                                                className="px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                                placeholder="Points"
                                            />
                                        </div>

                                        {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium">Options</span>
                                                    {question.question_type === 'multiple_choice' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => addOption(qIdx)}
                                                            className="text-xs text-brand-500 hover:underline"
                                                        >
                                                            + Option
                                                        </button>
                                                    )}
                                                </div>
                                                {question.options?.map((option, oIdx) => (
                                                    <div key={oIdx} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={option.is_correct}
                                                            onChange={e => updateOption(qIdx, oIdx, 'is_correct', e.target.checked)}
                                                            className="w-4 h-4 rounded border-border"
                                                        />
                                                        <input
                                                            type="text"
                                                            required
                                                            value={option.option_text}
                                                            onChange={e => updateOption(qIdx, oIdx, 'option_text', e.target.value)}
                                                            className="flex-1 px-3 py-1 rounded-lg bg-background border border-border focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            disabled={question.question_type === 'true_false'}
                                                        />
                                                        {question.question_type === 'multiple_choice' && question.options!.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(qIdx, oIdx)}
                                                                className="p-1 hover:bg-destructive/20 text-destructive rounded"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <div className="flex gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-secondary hover:bg-muted rounded-xl font-bold transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all"
                                >
                                    {editingQuiz ? 'Mettre à jour' : 'Créer le quiz'}
                                </button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
