import { apiClient } from './client';
import { Task, TaskStats } from '../types/task';
import { TaskFormData } from '../types/schema';

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
}

export const tasksApi = {
  getTasks: async (params?: TaskQueryParams): Promise<Task[]> => {
    const res = await apiClient<{ success: boolean; data: Task[] }>('/tasks', {
      params: params as any,
    });
    return res.data;
  },

  getStats: async (): Promise<TaskStats> => {
    const res = await apiClient<{ success: boolean; data: TaskStats }>('/tasks/stats');
    return res.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const res = await apiClient<{ success: boolean; data: Task }>(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (data: TaskFormData): Promise<Task> => {
    const res = await apiClient<{ success: boolean; data: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
    const res = await apiClient<{ success: boolean; data: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  toggleComplete: async (id: string): Promise<Task> => {
    const res = await apiClient<{ success: boolean; data: Task }>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return res.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  clearAllTasks: async (): Promise<void> => {
    await apiClient<{ success: boolean }>('/tasks', {
      method: 'DELETE',
    });
  },
};
