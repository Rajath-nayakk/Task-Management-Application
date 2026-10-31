import React from 'react';
import { Task } from '../../types/task';
import { Calendar, AlertCircle, Edit3, Trash2, Check } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !task.completed && task.status !== 'done' && !!task.dueDate && task.dueDate < today;

  const priorityStyles = {
    high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
  }[task.priority];

  const statusStyles = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60',
    done: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
  }[task.status];

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
        task.completed
          ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 opacity-80'
          : isOverdue
          ? 'border-rose-300 dark:border-rose-900/60 shadow-rose-500/5'
          : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Accessible Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-brand-500 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-white dark:bg-slate-800'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityStyles}`}
            >
              {task.priority}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${statusStyles}`}
            >
              {task.status.replace('-', ' ')}
            </span>

            {/* Due Date & Overdue Tag */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  isOverdue
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                )}
                {task.dueDate}
                {isOverdue && <span className="text-[10px] uppercase font-bold">(Overdue)</span>}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug break-words ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
