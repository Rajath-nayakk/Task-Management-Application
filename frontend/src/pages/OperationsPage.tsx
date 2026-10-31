import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { AppLayout } from '../components/layout/AppLayout';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/tasks/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Task } from '../types/task';
import { TaskFormData } from '../types/schema';
import { Plus, Trash2, RefreshCw, Crosshair } from 'lucide-react';

export const OperationsPage: React.FC = () => {
  const {
    tasks,
    filteredTasks,
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
    <AppLayout title="OPERATIONS // MISSION DISPATCH">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1e1e38]">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[var(--neon-primary)]" />
            <h2 className="text-2xl font-extrabold font-display text-white tracking-wider uppercase">
              ACTIVE MISSIONS BOARD
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            DEPLOY, MONITOR, AND EXECUTING TACTICAL TASKS IN REAL TIME.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {tasks.length > 0 && (
            <Button
              variant="danger"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setClearAllConfirmOpen(true)}
              className="flex-1 sm:flex-initial"
            >
              Clear All
            </Button>
          )}

          <button
            onClick={refreshTasks}
            className="p-2.5 bg-[#121221] border border-[#1e1e38] text-slate-400 hover:text-white cyber-clip-sm transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial"
          >
            Deploy Mission
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        activeCount={filteredTasks.length}
      />

      {/* Task List / Missions List */}
      <section aria-label="Missions roster">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-primary)]" />
            <span>
              ROSTER: {filteredTasks.length} {filteredTasks.length === 1 ? 'TARGET' : 'TARGETS'}
            </span>
          </div>
          {isFiltering && (
            <span className="text-[11px] font-mono text-[var(--neon-primary)] uppercase">
              // TELEMETRY FILTERED
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-28 w-full" />
            ))}
          </div>
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

      {/* Task Modal (Create & Edit) */}
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
        title="PURGE ALL MISSIONS?"
        message="This action will permanently wipe all task records from the tactical database. Are you sure you wish to proceed?"
        confirmLabel="PURGE SECTOR"
        confirmVariant="danger"
      />

      {/* Delete Single Task Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmSingleDelete}
        title="ABORT TARGET MISSION?"
        message={`Terminate and delete "${targetTaskForDelete?.title || 'this mission'}" from the roster?`}
        confirmLabel="TERMINATE MISSION"
        confirmVariant="danger"
      />
    </AppLayout>
  );
};
