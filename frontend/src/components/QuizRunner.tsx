import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Trophy } from 'lucide-react';

interface QuizRunnerProps {
    quiz: any;
    onComplete: (score: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Calculate score
        let correctCount = 0;
        questions.forEach((q: any, idx: number) => {
            if (selectedAnswers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        setIsSubmitted(true);
        onComplete(finalScore);
    };

    // Helper to get formatted question text
    const getQuestionText = (q: any) => {
        return q.question_text || q.question;
    };

    // Helper to get options
    const getOptions = (q: any) => {
        return q.options || [];
    };

    if (!currentQuestion) return <div>No questions in this quiz.</div>;

    if (isSubmitted) {
        return (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-8 space-y-6 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${score >= 70 ? 'bg-brand-500/20 text-brand-400' : 'bg-red-500/20 text-red-400'}`}
                >
                    {score >= 70 ? <Trophy size={48} /> : <div className="text-4xl font-bold">{score}%</div>}
                </motion.div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold uppercase italic tracking-tighter text-white">
                        {score >= 70 ? 'Félicitations !' : 'Dommage !'}
                    </h3>
                    <p className="text-slate-400">
                        {score >= 70
                            ? 'Vous avez terminé le cours et réussi l\'examen avec succès.'
                            : 'Vous n\'avez pas atteint le score minimum. Réessayez pour obtenir votre certificat.'}
                    </p>
                </div>
                {score >= 70 ? (
                    <button className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold flex items-center gap-2 hover:bg-brand-700 transition-colors">
                        <Award size={20} />
                        Télécharger mon Certificat
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setCurrentQuestionIndex(0);
                            setSelectedAnswers({});
                        }}
                        className="px-8 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                    >
                        Réessayer le quiz
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-slate-50 flex flex-col">
            {/* Header / Progress */}
            <div className="p-6 border-b border-slate-200 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Évaluation Finale</h3>
                    <span className="text-sm font-medium text-slate-500">Question {currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-600 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Body */}
            <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-center max-w-2xl mx-auto w-full">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">{getQuestionText(currentQuestion)}</h2>

                <div className="space-y-3">
                    {getOptions(currentQuestion).map((option: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${selectedAnswers[currentQuestionIndex] === idx
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAnswers[currentQuestionIndex] === idx ? 'border-brand-500' : 'border-slate-300'
                                }`}>
                                {selectedAnswers[currentQuestionIndex] === idx && <div className="w-3 h-3 rounded-full bg-brand-500" />}
                            </div>
                            <span className="font-medium">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-white flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold flex items-center gap-2 hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
