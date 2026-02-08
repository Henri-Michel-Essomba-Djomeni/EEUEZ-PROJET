import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Quiz {
    id: string;
    courseTitle: string;
    courseId: string;
    date: string;
    score?: number;
    maxScore: number;
    status: 'passed' | 'failed' | 'pending';
    questions?: QuizQuestion[];
}

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: '1',
        question: 'Quelle est la principale différence entre let et const en JavaScript ?',
        options: [
            'let est pour les nombres, const pour les chaînes',
            'const ne peut pas être réassigné, let peut l\'être',
            'let est plus rapide que const',
            'Il n\'y a aucune différence'
        ],
        correctAnswer: 1
    },
    {
        id: '2',
        question: 'Qu\'est-ce que le Virtual DOM dans React ?',
        options: [
            'Une copie du DOM réel en mémoire',
            'Un serveur virtuel',
            'Une base de données',
            'Un framework CSS'
        ],
        correctAnswer: 0
    },
    {
        id: '3',
        question: 'Quel hook React permet de gérer l\'état local ?',
        options: [
            'useEffect',
            'useContext',
            'useState',
            'useReducer'
        ],
        correctAnswer: 2
    },
    {
        id: '4',
        question: 'Que signifie TypeScript ?',
        options: [
            'Un langage de programmation compilé',
            'JavaScript avec typage statique',
            'Un framework frontend',
            'Une bibliothèque de tests'
        ],
        correctAnswer: 1
    },
    {
        id: '5',
        question: 'Quelle méthode permet de parcourir un tableau en JavaScript ?',
        options: [
            'forEach',
            'loop',
            'iterate',
            'traverse'
        ],
        correctAnswer: 0
    }
];

const MOCK_QUIZZES: Quiz[] = [
    { id: '1', courseId: 'react-advanced', courseTitle: 'React Avancé', date: '2024-02-05', score: 18, maxScore: 20, status: 'passed' },
    { id: '2', courseId: 'typescript', courseTitle: 'TypeScript Mastery', date: '2024-02-03', score: 15, maxScore: 20, status: 'passed' },
    { id: '3', courseId: 'nodejs', courseTitle: 'Node.js Backend', date: '2024-02-01', score: 12, maxScore: 20, status: 'failed' },
    { id: '4', courseId: 'ui-ux', courseTitle: 'UI/UX Design', date: '2024-01-28', maxScore: 20, status: 'pending', questions: MOCK_QUIZ_QUESTIONS },
];

export const Evaluations = () => {
    const [filter, setFilter] = useState<'all' | 'passed' | 'failed' | 'pending'>('all');
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const filteredQuizzes = filter === 'all'
        ? MOCK_QUIZZES
        : MOCK_QUIZZES.filter(q => q.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed': return 'text-emerald-500 bg-emerald-500/10';
            case 'failed': return 'text-red-500 bg-red-500/10';
            case 'pending': return 'text-amber-500 bg-amber-500/10';
            default: return 'text-muted-foreground bg-secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'passed': return <CheckCircle2 size={16} />;
            case 'failed': return <XCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            default: return null;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'passed': return 'Réussi';
            case 'failed': return 'Échoué';
            case 'pending': return 'En attente';
            default: return status;
        }
    };

    const handleStartQuiz = (quiz: Quiz) => {
        if (quiz.status === 'pending' && quiz.questions) {
            setActiveQuiz(quiz);
            setCurrentQuestion(0);
            setAnswers([]);
            setShowResults(false);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (activeQuiz && currentQuestion < (activeQuiz.questions?.length || 0) - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
        const correctAnswers = answers.filter((answer, index) =>
            answer === activeQuiz?.questions?.[index]?.correctAnswer
        ).length;

        if (correctAnswers >= (activeQuiz?.questions?.length || 0) * 0.7) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const calculateScore = () => {
        if (!activeQuiz?.questions) return 0;
        const correct = answers.filter((answer, index) =>
            answer === activeQuiz.questions?.[index]?.correctAnswer
        ).length;
        return Math.round((correct / activeQuiz.questions.length) * 100);
    };

    if (activeQuiz && !showResults) {
        const question = activeQuiz.questions?.[currentQuestion];
        const progress = ((currentQuestion + 1) / (activeQuiz.questions?.length || 1)) * 100;

        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                            Évaluation : <span className="text-brand-400">{activeQuiz.courseTitle}</span>
                        </h2>
                        <p className="text-muted-foreground">Question {currentQuestion + 1} sur {activeQuiz.questions?.length}</p>
                    </div>
                    <button
                        onClick={() => setActiveQuiz(null)}
                        className="px-4 py-2 bg-secondary hover:bg-muted rounded-xl text-sm font-bold transition-all"
                    >
                        Quitter
                    </button>
                </div>

                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-brand-500"
                    />
                </div>

                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 rounded-3xl space-y-8"
                >
                    <h3 className="text-2xl font-bold">{question?.question}</h3>

                    <div className="space-y-4">
                        {question?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className={`w-full p-6 rounded-2xl text-left transition-all border-2 ${answers[currentQuestion] === index
                                        ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                                        : 'border-border bg-secondary hover:border-brand-500/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQuestion] === index
                                            ? 'border-brand-500 bg-brand-500 text-white'
                                            : 'border-border'
                                        }`}>
                                        {answers[currentQuestion] === index && <CheckCircle2 size={16} />}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 bg-secondary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center gap-2 transition-all"
                        >
                            <ArrowLeft size={18} /> Précédent
                        </button>

                        {currentQuestion === (activeQuiz.questions?.length || 0) - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={answers.length !== activeQuiz.questions?.length}
                                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                            >
                                Soumettre <Award size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                            >
                                Suivant <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (showResults && activeQuiz) {
        const score = calculateScore();
        const passed = score >= 70;

        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex p-6 rounded-full ${passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                        {passed ? <Award size={64} /> : <XCircle size={64} />}
                    </motion.div>
                    <h2 className="text-4xl font-bold uppercase italic tracking-tighter">
                        {passed ? 'Félicitations !' : 'Pas encore...'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {passed ? 'Vous avez réussi l\'évaluation !' : 'Continuez à apprendre et réessayez !'}
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
                    <div className="text-6xl font-black text-brand-500">{score}%</div>
                    <p className="text-muted-foreground">Score final</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setActiveQuiz(null);
                            setShowResults(false);
                        }}
                        className="flex-1 px-6 py-4 bg-secondary hover:bg-muted rounded-2xl font-bold transition-all"
                    >
                        Retour aux évaluations
                    </button>
                    {!passed && (
                        <button
                            onClick={() => {
                                setCurrentQuestion(0);
                                setAnswers([]);
                                setShowResults(false);
                            }}
                            className="flex-1 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all"
                        >
                            Réessayer
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter leading-none">
                        Mes <span className="text-brand-400">Évaluations</span>
                    </h2>
                    <p className="text-muted-foreground">Consultez vos résultats et progressions.</p>
                </div>
                <div className="flex gap-2">
                    {(['all', 'passed', 'failed', 'pending'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-secondary text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            {f === 'all' ? 'Tous' : f === 'passed' ? 'Réussis' : f === 'failed' ? 'Échoués' : 'En attente'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredQuizzes.map((quiz, i) => (
                    <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 border-border/50 hover:border-brand-500/30 transition-all"
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(quiz.status)}`}>
                            <ClipboardCheck size={28} />
                        </div>

                        <div className="flex-1 space-y-1 text-center md:text-left">
                            <h3 className="text-lg font-bold">{quiz.courseTitle}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                Évaluation du {new Date(quiz.date).toLocaleDateString('fr-FR')}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {quiz.status !== 'pending' && (
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</div>
                                    <div className="text-2xl font-black">
                                        {quiz.score}<span className="text-muted-foreground text-sm">/{quiz.maxScore}</span>
                                    </div>
                                </div>
                            )}

                            {quiz.status === 'pending' ? (
                                <button
                                    onClick={() => handleStartQuiz(quiz)}
                                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold transition-all"
                                >
                                    Commencer
                                </button>
                            ) : (
                                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold ${getStatusColor(quiz.status)}`}>
                                    {getStatusIcon(quiz.status)}
                                    {getStatusLabel(quiz.status)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredQuizzes.length === 0 && (
                <div className="p-12 glass-panel rounded-3xl border-border/50 border-dashed text-center space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-secondary text-muted-foreground">
                        <ClipboardCheck size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold uppercase italic tracking-tighter">Aucune évaluation</h3>
                        <p className="text-muted-foreground text-sm">
                            Vous n'avez pas encore d'évaluations dans cette catégorie.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
