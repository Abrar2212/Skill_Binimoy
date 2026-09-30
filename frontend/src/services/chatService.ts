import { api } from './api';
import { ChatFriend, ChatMessage } from '../types/chat';

export interface ChatBotAction {
  type: 'request_sent' | 'session_created' | 'join_call' | 'suggest_barter';
  data?: {
    requestId?: number;
    sessionId?: number;
    partnerName?: string;
    peerId?: number;
    offeredSkill?: string;
    requestedSkill?: string;
    meetingLink?: string;
    topic?: string;
    alreadyPending?: boolean;
  };
}

export interface ChatBotResponse {
  reply: string;
  action?: ChatBotAction | null;
}

export const chatService = {
  async getFriends(): Promise<ChatFriend[]> {
    const response = await api.get('/friends');
    return response.data.friends || [];
  },

  async getMessages(userId: number): Promise<ChatMessage[]> {
    const response = await api.get(`/messages/${userId}`);
    return response.data.messages || [];
  },

  async sendMessage(receiver_id: number, message: string): Promise<ChatMessage> {
    const response = await api.post('/messages', { receiver_id, message });
    let currentUserId = 1;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id) currentUserId = parsed.id;
      }
    } catch {
      // Fallback
    }

    return {
      id: response.data.id || Date.now(),
      sender_id: currentUserId,
      receiver_id,
      message,
      created_at: new Date().toISOString(),
    };
  },

  async chatWithBot(
    message: string,
    history?: { role: string; text: string }[]
  ): Promise<ChatBotResponse> {
    let currentUserId: number | undefined;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id) currentUserId = Number(parsed.id);
      }
    } catch {}

    const response = await api.post(
      '/chatbot',
      { message, history, userId: currentUserId },
      { timeout: 35000 }
    );
    return {
      reply: response.data.reply || response.data.message || 'I am your Skill Binimoy AI Advisor.',
      action: response.data.action || null,
    };
  },
};
