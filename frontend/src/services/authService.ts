import { api } from './api';
import { AuthResponse } from '../types/user';

export const authService = {
  async register(full_name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', { full_name, email, password });
    return response.data;
  },

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const response = await api.post('/verify-email', { email, code });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async resendCode(email: string): Promise<{ message: string }> {
    const response = await api.post('/resend-code', { email });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post('/reset-password', { email, code, newPassword });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
