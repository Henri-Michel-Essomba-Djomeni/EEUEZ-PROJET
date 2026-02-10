import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { evaluationsAPI } from '../services/api';

interface QuizOption {
    id: number;
    option_text: string;
    is_correct?: boolean;
}

interface QuizQuestion {
    id: number;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    points: number;
    options?: QuizOption[];
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    passing_score: number;
    duration_minutes: number;
    questions: QuizQuestion[];
}

interface EvaluationViewerProps {
    quizId: string;
    onComplete?: () => void;
}

export const EvaluationViewer: React.FC<EvaluationViewerProps> = ({ quizId, onComplete }) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuiz();
    }, [quizId]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            const data = await evaluationsAPI.getQuizById(quizId);
            setQuiz(data);
        } catch (error) {
            console.error('Failed to load quiz', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: number, answer: any) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        // Validate all questions are answered
        const unanswered = quiz.questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            alert(`Veuillez répondre à toutes les questions. ${unanswered.length} question(s) restante(s).`);
            return;
        }

        try {
            const formattedAnswers = quiz.questions.map(q => {
                const answer = answers[q.id];
                if (q.question_type === 'short_answer') {
                    return {
                        question_id: q.id,
                        answer_text: answer
                    };
                } else {
                    return {
                        question_id: q.id,
                        selected_option_id: answer
                    };
                }
            });

            const result = await evaluationsAPI.submitQuiz(quizId, formattedAnswers);
            setResult(result);
            setSubmitted(true);

            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            console.error('Failed to submit quiz', error);
            alert('Erreur lors de la soumission du quiz');
        }
    };

    const nextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Quiz introuvable</p>
            </div>
        );
    }

    if (submitted && result) {
        const percentage = result.percentage || 0;
        const passed = result.passed;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto"
            >
                <div className="glass-panel p-8 rounded-3xl border border-border text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        {passed ? (
                            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                        ) : (
                            <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                        )}
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-2">
                        {passed ? 'Félicitations !' : 'Pas encore...'}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {passed
                            ? 'Vous avez réussi ce quiz avec succès !'
                            : 'Continuez à apprendre et réessayez !'}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-secondary rounded-2xl">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Score</div>
                            <div className="text-2xl font-bold">{result.score}/{result.max_score}</div>
                        </div>
                        <div className="p-4 bg-secondary rounded-2xl">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Pourcentage</div>
                            <div className={`text-2xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                                {percentage}%
                            </div>
                        </div>
                        <div className="p-4 bg-secondary rounded-2xl">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Requis</div>
                            <div className="text-2xl font-bold">{result.passing_score}%</div>
                        </div>
                    </div>

                    {passed && (
                        <div className="p-4 bg-brand-500/10 border border-brand-500/30 rounded-2xl">
                            <div className="flex items-center justify-center gap-2 text-brand-500">
                                <Award size={20} />
                                <span className="font-bold">Quiz validé avec succès !</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="glass-panel p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">{quiz.title}</h2>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span className="text-sm font-medium">{quiz.duration_minutes} min</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="absolute inset-y-0 left-0 bg-brand-500"
                    />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                        Question {currentQuestionIndex + 1} sur {quiz.questions.length}
                    </span>
                    <span className="text-xs font-bold text-brand-500">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-8 rounded-2xl border border-border"
                >
                    <div className="flex items-start gap-3 mb-6">
                        <span className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {currentQuestionIndex + 1}
                        </span>
                        <div className="flex-1">
                            <p className="text-lg font-medium mb-1">{currentQuestion.question_text}</p>
                            <p className="text-xs text-muted-foreground">{currentQuestion.points} point(s)</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.question_type === 'short_answer' ? (
                            <textarea
                                value={answers[currentQuestion.id] || ''}
                                onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px]"
                                placeholder="Votre réponse..."
                            />
                        ) : (
                            currentQuestion.options?.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === option.id
                                            ? 'border-brand-500 bg-brand-500/10'
                                            : 'border-border bg-secondary hover:border-brand-500/50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option.id}
                                        checked={answers[currentQuestion.id] === option.id}
                                        onChange={() => handleAnswer(currentQuestion.id, option.id)}
                                        className="w-5 h-5 text-brand-500"
                                    />
                                    <span className="flex-1 font-medium">{option.option_text}</span>
                                </label>
                            ))
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 bg-secondary hover:bg-muted rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={18} />
                    Précédent
                </button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                    >
                        Soumettre le quiz
                        <CheckCircle2 size={18} />
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                    >
                        Suivant
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Answer Summary */}
            <div className="glass-panel p-4 rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-3">Progression</p>
                <div className="flex flex-wrap gap-2">
                    {quiz.questions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${answers[q.id]
                                    ? 'bg-brand-500 text-white'
                                    : idx === currentQuestionIndex
                                        ? 'bg-secondary border-2 border-brand-500'
                                        : 'bg-secondary hover:bg-muted'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
