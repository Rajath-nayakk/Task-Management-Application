import React from 'react';
import { Task } from '../../types/task';
import { Badge } from '../ui/Badge';
import { Calendar, AlertCircle, Edit3, Trash2, Check, Target } from 'lucide-react';

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
  const isOverdue =
    !task.completed && task.status !== 'done' && !!task.dueDate && task.dueDate < today;

  const priorityBadgeVariant = {
    high: 'magenta' as const,
    medium: 'yellow' as const,
    low: 'green' as const,
  }[task.priority];

  const statusBadgeVariant = {
    todo: 'cyan' as const,
    'in-progress': 'yellow' as const,
    done: 'green' as const,
  }[task.status];

  // Per-task mini progress percentage
  const progressPercent = task.completed
    ? 100
    : task.status === 'in-progress'
    ? 50
    : 10;

  return (
    <div
      className={`group relative p-5 bg-[#0e0e1a] border transition-all duration-200 cyber-clip-sm hud-bracket ${
        task.completed
          ? 'border-[#1e1e38] opacity-75'
          : isOverdue
          ? 'border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-rose-950/10'
          : 'border-[#1e1e38] hover:border-[var(--neon-primary)] hover:shadow-[0_0_20px_var(--neon-glow-border)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Tactical Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-none cyber-clip-sm border-2 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[var(--neon-primary)] ${
            task.completed
              ? 'bg-[#39ff88] border-[#39ff88] text-black shadow-[0_0_10px_rgba(57,255,136,0.5)]'
              : 'border-slate-600 hover:border-[var(--neon-primary)] bg-[#07070d]'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Mission ID */}
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Target className="w-3 h-3 text-[var(--neon-primary)]" />
              {task.id.slice(0, 8)}
            </span>

            {/* Priority Badge */}
            <Badge variant={priorityBadgeVariant} dot>
              {task.priority}
            </Badge>

            {/* Status Badge */}
            <Badge variant={statusBadgeVariant}>
              {task.status.replace('-', ' ')}
            </Badge>

            {/* Due Date & Overdue Tag */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 cyber-clip-sm border ${
                  isOverdue
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
                    : 'text-slate-400 bg-[#07070d] border-[#1e1e38]'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                )}
                {task.dueDate}
                {isOverdue && <span className="text-[9px] uppercase font-bold text-rose-400">[OVERDUE]</span>}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-bold font-display uppercase tracking-wider leading-snug break-words transition-colors ${
              task.completed
                ? 'line-through text-slate-500'
                : 'text-white group-hover:text-[var(--neon-primary)]'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`text-xs mt-1.5 leading-relaxed font-sans line-clamp-2 ${
                task.completed ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Per-task Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-[#07070d] border border-[#1e1e38] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  task.completed
                    ? 'bg-[#39ff88] shadow-[0_0_8px_#39ff88]'
                    : task.status === 'in-progress'
                    ? 'bg-[var(--neon-primary)] shadow-[0_0_8px_var(--neon-primary)]'
                    : 'bg-slate-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-[var(--neon-primary)] hover:bg-[#151528] cyber-clip-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--neon-primary)]"
            aria-label={`Edit task "${task.title}"`}
            title="Edit mission"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cyber-clip-sm transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label={`Delete task "${task.title}"`}
            title="Abort mission"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
