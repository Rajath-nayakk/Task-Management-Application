import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Task, TaskFilterState, TaskStats } from '../types/task';
import { tasksApi } from '../api/tasks';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { TaskFormData } from '../types/schema';

import { useSocket } from './SocketContext';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  filters: TaskFilterState;
  isLoading: boolean;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  addTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: TaskFormData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialFilters: TaskFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'dueDate-asc',
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const refreshTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Real-time synchronization across browser tabs and devices via authenticated Socket.IO room
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (task: Task) => {
      setTasks((prev) => {
        if (prev.some((t) => t.id === task.id)) {
          return prev.map((t) => (t.id === task.id ? task : t));
        }
        return [task, ...prev.filter((t) => !t.id.startsWith('temp-'))];
      });
    };

    const handleUpdated = (task: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    };

    const handleDeleted = ({ id }: { id: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleCleared = () => {
      setTasks([]);
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);
    socket.on('task:cleared', handleCleared);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
      socket.off('task:cleared', handleCleared);
    };
  }, [socket]);

  // Optimistic Add with rollback
  const addTask = async (data: TaskFormData) => {
    const isCompleted = data.status === 'done';
    const tempId = 'temp-' + Date.now();
    const optimisticTask: Task = {
      id: tempId,
      userId: 'pending',
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate || undefined,
      completed: isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const created = await tasksApi.createTask(data);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
      showToast(`Mission "${data.title}" deployed!`, 'success');
    } catch (err: any) {
      // Rollback
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      showToast(err.message || 'Failed to deploy mission.', 'error');
      throw err;
    }
  };

  // Optimistic Update with rollback
  const updateTask = async (id: string, data: TaskFormData) => {
    const previous = [...tasks];
    const isCompleted = data.status === 'done';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
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

    try {
      const updated = await tasksApi.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast('Mission parameters synchronized.', 'success');
    } catch (err: any) {
      // Rollback
      setTasks(previous);
      showToast(err.message || 'Failed to update mission.', 'error');
      throw err;
    }
  };

  // Optimistic Delete with rollback
  const deleteTask = async (id: string) => {
    const previous = [...tasks];
    const target = tasks.find((t) => t.id === id);

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await tasksApi.deleteTask(id);
      showToast(`Terminated mission "${target?.title || id}".`, 'info');
    } catch (err: any) {
      // Rollback
      setTasks(previous);
      showToast(err.message || 'Failed to delete mission.', 'error');
      throw err;
    }
  };

  // Optimistic Toggle with rollback
  const toggleComplete = async (id: string) => {
    const previous = [...tasks];

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

    try {
      const updated = await tasksApi.toggleComplete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      // Rollback
      setTasks(previous);
      showToast(err.message || 'Failed to update mission status.', 'error');
    }
  };

  // Optimistic Clear All with rollback
  const clearAllTasks = async () => {
    const previous = [...tasks];
    setTasks([]);

    try {
      await tasksApi.clearAllTasks();
      showToast(`Cleared all ${previous.length} missions.`, 'info');
    } catch (err: any) {
      // Rollback
      setTasks(previous);
      showToast(err.message || 'Failed to clear missions.', 'error');
      throw err;
    }
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
