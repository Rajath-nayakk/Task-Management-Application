import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { use3DStore } from '../store/use3DStore';
import { Header } from '../components/common/Header';
import { ProgressTracker } from '../components/tasks/ProgressTracker';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/tasks/EmptyState';
import { TaskSkeleton } from '../components/tasks/TaskSkeleton';
import { CustomizerPanel } from '../components/3d/CustomizerPanel';
import { Task } from '../types/task';
import { TaskFormData } from '../types/schema';
import { Plus, Trash2, Sparkles, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { accent } = use3DStore();
  const {
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
  } = useTasks();

  // Modal and dialog states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskFormSubmit = (data: TaskFormData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data);
    } else {
      addTask(data);
    }
  };

  const handlePromptDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmSingleDelete = () => {
    if (deleteTargetId) {
      deleteTask(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sort: 'dueDate-asc',
    });
  };

  const isFiltering =
    filters.search !== '' || filters.status !== 'all' || filters.priority !== 'all';

  const targetTaskForDelete = tasks.find((t) => t.id === deleteTargetId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome & Primary Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <span
                className="hidden sm:inline-flex p-1 rounded-lg border"
                style={{
                  backgroundColor: `${accent.hex}15`,
                  borderColor: `${accent.hex}40`,
                  color: accent.hex,
                }}
              >
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Keep track of daily priorities and achieve goals with real-time 3D telemetry.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {tasks.length > 0 && (
              <button
                type="button"
                onClick={() => setClearAllConfirmOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
                aria-label="Clear all tasks"
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Clear All</span>
              </button>
            )}

            <button
              type="button"
              onClick={refreshTasks}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Refresh tasks"
              aria-label="Refresh tasks"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500"
              style={{
                backgroundColor: accent.hex,
                boxShadow: `0 4px 20px ${accent.hex}40`,
              }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* 3D Progress Tracker Card */}
        <ProgressTracker stats={stats} />

        {/* Search, Filter Pills & Sort Drawer */}
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          activeCount={filteredTasks.length}
        />

        {/* Task List Section */}
        <section aria-label="Task board list">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks ({filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'})
            </h2>
            {isFiltering && (
              <span
                className="text-[11px] font-bold"
                style={{ color: accent.hex }}
              >
                Filtered view
              </span>
            )}
          </div>

          {isLoading ? (
            <TaskSkeleton />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              isFiltering={isFiltering}
              onAction={isFiltering ? handleResetFilters : handleOpenAdd}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={handleOpenEdit}
                  onDelete={handlePromptDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating 3D Studio Customizer */}
      <CustomizerPanel />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskFormSubmit}
        taskToEdit={taskToEdit}
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearAllConfirmOpen}
        onClose={() => setClearAllConfirmOpen(false)}
        onConfirm={clearAllTasks}
        title="Clear All Tasks?"
        message="Are you sure you want to permanently delete all tasks on your personal board? This action cannot be reversed."
        confirmLabel="Yes, Clear All"
        confirmVariant="danger"
      />

      {/* Delete Single Task Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Task?"
        message={`Are you sure you want to delete "${targetTaskForDelete?.title || 'this task'}"?`}
        confirmLabel="Delete Task"
        confirmVariant="danger"
      />
    </div>
  );
};
