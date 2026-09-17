import { api } from './api';
import { ExchangeRequest } from '../types/request';
import { Session } from '../types/session';

export const exchangeService = {
  async getRequests(): Promise<ExchangeRequest[]> {
    try {
      const response = await api.get('/requests');
      return response.data.requests || [];
    } catch (err) {
      console.warn('Failed to fetch exchange requests:', err);
      return [];
    }
  },

  async sendRequest(data: {
    receiver_id: number;
    offered_skill: string;
    requested_skill: string;
    message: string;
  }): Promise<{ message: string }> {
    const response = await api.post('/requests', data);
    return response.data;
  },

  async updateRequestStatus(id: number, status: 'Accepted' | 'Rejected' | 'Cancelled'): Promise<{ message: string }> {
    const response = await api.put(`/requests/${id}`, { status });
    return response.data;
  },

  async getSessions(): Promise<Session[]> {
    try {
      const response = await api.get('/sessions');
      return response.data.sessions || [];
    } catch (err) {
      console.warn('Failed to fetch sessions:', err);
      return [];
    }
  },

  async createSession(data: {
    request_id: number;
    scheduled_at: string;
    duration_minutes: number;
    meeting_link?: string;
  }): Promise<{ message: string; session_id: number }> {
    const response = await api.post('/sessions', data);
    return response.data;
  }
};
