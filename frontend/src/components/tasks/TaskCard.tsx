import React, { useState, useRef } from 'react';
import { Task } from '../../types/task';
import { Calendar, AlertCircle, Edit3, Trash2, Check, Sparkles } from 'lucide-react';
import { use3DStore } from '../../store/use3DStore';

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
  const { isReducedMotion } = use3DStore();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt calculation
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showBurst, setShowBurst] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6; // max 6 deg

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleToggleClick = () => {
    if (!task.completed) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 900);
    }
    onToggle(task.id);
  };

  const today = new Date().toISOString().split('T')[0];
  const isOverdue =
    !task.completed && task.status !== 'done' && !!task.dueDate && task.dueDate < today;

  const priorityStyles = {
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  }[task.priority];

  const statusStyles = {
    todo: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    'in-progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    done: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  }[task.status];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className={`group relative rounded-2xl p-5 border backdrop-blur-md shadow-sm transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
          : isOverdue
          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 shadow-lg shadow-rose-500/5'
          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl'
      }`}
    >
      {/* Completion celebratory burst animation */}
      {showBurst && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rounded-2xl z-30">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/90 text-white font-bold text-xs shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>Task Completed! 🎉</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3.5">
        {/* Checkbox with Depth and Glow */}
        <button
          type="button"
          onClick={handleToggleClick}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-xl border-2 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-850 hover:scale-105'
          }`}
          style={!task.completed ? { borderColor: undefined } : {}}
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
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80'
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
            className={`text-base font-semibold leading-snug break-words transition-colors ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white group-hover:text-indigo-400'
            }`}
            style={!task.completed ? { color: undefined } : {}}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-400'
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
            className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
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
