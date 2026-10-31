import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Task, TaskFilterState, TaskStats } from '../types/task';
import { initialMockTasks } from '../mocks/tasks';
import { useToast } from './ToastContext';
import { TaskFormData } from '../types/schema';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  filters: TaskFilterState;
  isLoading: boolean;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  clearAllTasks: () => void;
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialFilters: TaskFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'dueDate-asc',
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const [filters, setFilters] = useState<TaskFilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const refreshTasks = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const addTask = (data: TaskFormData) => {
    const isCompleted = data.status === 'done';
    const newTask: Task = {
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      userId: 'usr-101',
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate || undefined,
      completed: isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${data.title}" created successfully!`, 'success');
  };

  const updateTask = (id: string, data: TaskFormData) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isCompleted = data.status === 'done';
        return {
          ...t,
          title: data.title,
          description: data.description || '',
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate || undefined,
          completed: isCompleted,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Task updated successfully!', 'success');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted "${target?.title || 'task'}"`, 'info');
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        const newStatus = newCompleted ? 'done' : 'todo';
        return {
          ...t,
          completed: newCompleted,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const clearAllTasks = () => {
    const count = tasks.length;
    setTasks([]);
    showToast(`Cleared all ${count} tasks`, 'info');
  };

  // Compute filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) ?? false;
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (filters.status !== 'all' && task.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'dueDate-asc':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          case 'dueDate-desc':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return b.dueDate.localeCompare(a.dueDate);
          case 'priority-desc': {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
          case 'priority-asc': {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            return priorityWeight[a.priority] - priorityWeight[b.priority];
          }
          case 'created-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'created-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [tasks, filters]);

  // Compute real-time stats
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed || t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;

    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(
      (t) => !t.completed && t.status !== 'done' && t.dueDate && t.dueDate < today
    ).length;

    const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      percentComplete,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        stats,
        filters,
        isLoading,
        setFilters,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        clearAllTasks,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
