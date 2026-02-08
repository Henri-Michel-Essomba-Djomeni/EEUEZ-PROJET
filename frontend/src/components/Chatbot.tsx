import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
}

export const Chatbot = () => {
    const { role } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const roleExplanations = {
        STUDENT: "En tant qu'étudiant, vous pouvez parcourir les cours, regarder des vidéos, passer des quiz et obtenir des certificats !",
        TEACHER: "En tant qu'enseignant, vous pouvez créer vos propres cours, uploader des vidéos et gérer vos évaluations.",
        ADMIN: "En tant qu'admin, vous gérez les comptes enseignants, surveillez les statistiques globales et validez les certifications."
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: '1', text: "Bonjour ! Je suis l'assistant E-Learn. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' },
                { id: '2', text: roleExplanations[role], sender: 'bot' }
            ]);
        }
    }, [isOpen, role]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleQuickAction = (action: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: action, sender: 'user' }]);

        setTimeout(() => {
            let botResponse = "";
            if (action.includes("fonctionne")) {
                botResponse = "Cette application permet une gestion complète de l'apprentissage. Naviguez via la barre latérale pour accéder à vos outils.";
            } else if (action.includes("certificat")) {
                botResponse = "Une fois un quiz réussi avec 100%, vous recevrez automatiquement un certificat numérique stylé !";
            } else {
                botResponse = "Je suis là pour vous guider. Quel aspect de la plateforme vous intrigue ?";
            }

            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-96 glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px] border-white/20"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between premium-gradient text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={20} />
                                <span className="font-bold">Assistant EEUEZ</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-brand-500 text-white rounded-tr-none'
                                        : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
                            {["Comment ça fonctionne ?", "Et les certificats ?", "Aide"].map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleQuickAction(q)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full premium-gradient shadow-lg flex items-center justify-center text-white relative group"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#0f172a] rounded-full" />
                )}
            </motion.button>
        </div>
    );
};
