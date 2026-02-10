import { Request, Response } from 'express';
import { callGeminiAPI } from '../services/geminiService';

// In-memory storage for conversations (matches server.js behavior)
const conversations = new Map<string, any[]>();
const sessions = new Map<string, any>();

async function saveConversationInternal(userId: string, message: string, role: string) {
    if (!conversations.has(userId)) {
        conversations.set(userId, []);
    }
    conversations.get(userId)?.push({
        role,
        content: message,
        timestamp: new Date().toISOString()
    });
}

async function getConversationHistoryInternal(userId: string) {
    return conversations.get(userId) || [];
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message requis' });
        }

        let userId = 'anonymous';
        if (sessionId) {
            // In the new unified backend, we might want to link this to the actual user id from JWT
            // but for compatibility with the existing frontend chatService, we check sessionId
            // If sessionId is not in our local map, we still allow 'anonymous' or look it up
            userId = sessionId;
        }

        await saveConversationInternal(userId, message, 'user');
        const history = await getConversationHistoryInternal(userId);

        try {
            const botResponse = await callGeminiAPI(message, history);
            await saveConversationInternal(userId, botResponse, 'assistant');
            res.status(200).json({ response: botResponse });
        } catch (error) {
            console.error('Gemini API Error:', error);
            res.status(500).json({ error: (error as Error).message || 'Erreur lors de l’appel à Gemini' });
        }
    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const userId = sessionId || 'anonymous';
    const history = await getConversationHistoryInternal(userId);
    res.status(200).json({ history });
};

export const clearHistory = async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const userId = sessionId || 'anonymous';
    conversations.delete(userId);
    res.status(200).json({ success: true });
};
