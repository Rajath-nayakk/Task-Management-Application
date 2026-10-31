import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: User;
}

export const authApi = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return res.data;
  },

  login: async (email: string, password: string): Promise<User> => {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<User | null> => {
    try {
      const res = await apiClient<{ success: boolean; data: User }>('/auth/me', {
        method: 'GET',
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 401) {
        return null;
      }
      throw err;
    }
  },
};
