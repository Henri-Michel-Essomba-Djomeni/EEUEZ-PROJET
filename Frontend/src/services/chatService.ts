const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'bot';
    content: string;
    timestamp?: string;
}

export const chatService = {
    sendMessage: async (message: string, sessionId?: string) => {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                sessionId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send message');
        }

        return response.json();
    },

    getHistory: async (sessionId?: string) => {
        const url = new URL(`${API_BASE_URL.replace('/api', '')}/api/history`);
        if (sessionId) {
            url.searchParams.append('sessionId', sessionId);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }

        return response.json();
    },

    clearHistory: async (sessionId?: string) => {
        const url = new URL(`${API_BASE_URL.replace('/api', '')}/api/history`);
        if (sessionId) {
            url.searchParams.append('sessionId', sessionId);
        }

        const response = await fetch(url.toString(), {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear history');
        }

        return response.json();
    }
};
