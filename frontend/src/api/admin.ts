import { apiClient } from './client';
import { User } from './auth';

export interface AdminUserRecord extends User {
  taskCount: number;
  completedCount: number;
}

export interface AdminTaskRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  getUsers: async (): Promise<AdminUserRecord[]> => {
    const res = await apiClient<{ success: boolean; data: AdminUserRecord[] }>('/admin/users');
    return res.data;
  },

  getTasks: async (): Promise<AdminTaskRecord[]> => {
    const res = await apiClient<{ success: boolean; data: AdminTaskRecord[] }>('/admin/tasks');
    return res.data;
  },
};
