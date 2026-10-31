import React from 'react';
import { TaskStats } from '../../types/task';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface ProgressTrackerProps {
  stats: TaskStats;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats }) => {
  const { total, completed, inProgress, overdue, percentComplete } = stats;

  // Calculate SVG circular stroke
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  let motivation = 'Ready to conquer your goals today?';
  if (total === 0) {
    motivation = 'No tasks yet. Create one to get started!';
  } else if (percentComplete === 100) {
    motivation = 'Outstanding! All tasks are completed! 🎉';
  } else if (percentComplete >= 75) {
    motivation = 'Almost there! Just a final push! 🚀';
  } else if (percentComplete >= 50) {
    motivation = 'Halfway done! Keep up the momentum! 💪';
  } else if (percentComplete > 0) {
    motivation = 'Good progress underway! Keep going! ✨';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Ring + Headline */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-brand-600 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                {percentComplete}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                Done
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Task Progress Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {motivation}
            </p>
            {/* Linear Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentComplete}%` }}
                role="progressbar"
                aria-valuenow={percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task completion progress"
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          {/* Total */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {total}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">
                Total
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 leading-none">
                {completed}
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 uppercase">
                Done
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-blue-900 dark:text-blue-100 leading-none">
                {inProgress}
              </div>
              <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase">
                Active
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-rose-900 dark:text-rose-100 leading-none">
                {overdue}
              </div>
              <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mt-1 uppercase">
                Overdue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
