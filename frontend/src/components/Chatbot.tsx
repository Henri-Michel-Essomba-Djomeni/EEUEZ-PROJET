import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatService, ChatMessage } from '../services/chatService';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export const Chatbot = () => {
    const { user, role } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const sessionId = localStorage.getItem('sessionId') || undefined;

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const loadHistory = async () => {
        try {
            const data = await chatService.getHistory(sessionId);
            if (data.history && data.history.length > 0) {
                setMessages(data.history.map((msg: any) => ({
                    role: msg.role === 'assistant' ? 'bot' : msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp
                })));
            } else {
                setMessages([
                    { role: 'bot', content: "Bonjour ! Je suis l'assistant EEUEZ. Comment puis-je vous aider aujourd'hui ?" }
                ]);
            }
        } catch (error) {
            console.error('Failed to load history', error);
            setMessages([
                { role: 'bot', content: "Bonjour ! Je suis l'assistant EEUEZ. Comment puis-je vous aider aujourd'hui ?" }
            ]);
        }
    };

    const handleSend = async (text: string = input) => {
        const messageToSend = text.trim();
        if (!messageToSend || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsLoading(true);

        try {
            const data = await chatService.sendMessage(messageToSend, sessionId);
            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
        } catch (error) {
            console.error('Chat error', error);
            setMessages(prev => [...prev, { role: 'bot', content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
            try {
                await chatService.clearHistory(sessionId);
                setMessages([{ role: 'bot', content: "Historique effacé. Comment puis-je vous aider ?" }]);
            } catch (error) {
                console.error('Failed to clear history', error);
            }
        }
    };

    const handleNewConversation = () => {
        if (window.confirm('Commencer une nouvelle conversation ?')) {
            setMessages([{ role: 'bot', content: "Nouvelle conversation commencée ! Posez-moi vos questions sur EEUEZ." }]);
        }
    };

    const formatText = (text: string) => {
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
                {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4"
                    >
                        <Card className="w-96 h-[550px] max-h-[calc(100vh-140px)] flex flex-col shadow-2xl border-white/20 overflow-hidden rounded-3xl">
                            {/* Header */}
                            <CardHeader className="p-4 premium-gradient text-white flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-2 rounded-xl">
                                        <Bot size={20} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold">Assistant EEUEZ</CardTitle>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                                            <p className="text-[10px] opacity-80">En ligne</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                                        onClick={handleNewConversation}
                                    >
                                        <PlusCircle size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                                        onClick={handleClearHistory}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X size={18} />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Content */}
                            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-brand-500 border-brand-400' : 'bg-white border-slate-100 text-slate-600'
                                                }`}>
                                                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} />}
                                            </div>
                                            <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                ? 'bg-brand-500 text-white rounded-tr-none'
                                                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                                }`}>
                                                {formatText(msg.content)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-end gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <Bot size={14} className="text-slate-600" />
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2 text-slate-400 text-xs italic">
                                                <Loader2 size={12} className="animate-spin text-brand-500" />
                                                Analyse en cours...
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            {/* Footer */}
                            <CardFooter className="p-0 flex-col bg-white border-t">
                                {/* Quick Actions */}
                                <div className="w-full px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-50">
                                    {["Comment ça fonctionne ?", "Quels outils sont disponibles ?", "Besoin d'aide"].map((q) => (
                                        <Button
                                            key={q}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSend(q)}
                                            className="h-7 px-3 rounded-full text-[10px] bg-slate-50 border-slate-200 text-slate-500 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200"
                                        >
                                            {q}
                                        </Button>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="w-full p-4">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="relative flex-1 group">
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Posez votre question…"
                                                className="pr-10 bg-slate-50 border-slate-200 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 rounded-2xl h-10 transition-all"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                                <MessageSquare size={14} />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="h-10 w-10 p-0 rounded-2xl bg-brand-500 hover:bg-brand-600 shadow-brand-500/20 shadow-lg"
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </form>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full premium-gradient shadow-xl flex items-center justify-center text-white relative group border-2 border-white/20"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <Badge className="absolute -top-1 -right-1 p-0 w-5 h-5 flex items-center justify-center bg-red-500 border-2 border-white rounded-full">
                        1
                    </Badge>
                )}
                {/* Tooltip hint */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 px-3 py-2 bg-white text-slate-800 text-xs font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-slate-100">
                        Besoin d'aide ? 🤖
                    </div>
                )}
            </motion.button>
        </div>
    );
};
