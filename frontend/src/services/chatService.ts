import { api } from './api';
import { ChatFriend, ChatMessage } from '../types/chat';

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

  async chatWithBot(message: string): Promise<string> {
    const response = await api.post('/chatbot', { message });
    return response.data.reply || response.data.message || 'I am your Skill Binimoy AI Advisor.';
  }
};
