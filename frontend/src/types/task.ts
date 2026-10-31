export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'dueDate-asc' | 'dueDate-desc' | 'priority-desc' | 'priority-asc' | 'created-desc' | 'created-asc';

export interface TaskFilterState {
  search: string;
  status: TaskStatus | 'all';
  priority: Priority | 'all';
  sort: SortOption;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  percentComplete: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}
