import React from 'react';
import { TaskStats } from '../../types/task';
import { ProgressWidget3D } from '../3d/ProgressWidget3D';
import { use3DStore } from '../../store/use3DStore';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Flame } from 'lucide-react';

interface ProgressTrackerProps {
  stats: TaskStats;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats }) => {
  const { total, completed, inProgress, overdue, percentComplete } = stats;
  const { accent } = use3DStore();

  let motivation = 'Ready to conquer your goals today?';
  if (total === 0) {
    motivation = 'No tasks on board. Create one to begin your streak!';
  } else if (percentComplete === 100) {
    motivation = 'Sensational! 100% of tasks completed! 🎉';
  } else if (percentComplete >= 75) {
    motivation = 'Final sprint! You are almost at the finish line! 🚀';
  } else if (percentComplete >= 50) {
    motivation = 'Over halfway done! Momentum is surging! 💪';
  } else if (percentComplete > 0) {
    motivation = 'Solid momentum! Keep clearing the board! ✨';
  }

  return (
    <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800/80 transition-all">
      {/* Dynamic ambient background aura matching customizer accent */}
      <div
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[90px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accent.hex }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: 3D Procedural Torus Widget + Headline */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* 3D Progress Torus */}
          <ProgressWidget3D percentComplete={percentComplete} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                Productivity Telemetry
              </h2>
              {percentComplete >= 50 && (
                <span
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${accent.hex}15`,
                    borderColor: `${accent.hex}40`,
                    color: accent.hex,
                  }}
                >
                  <Flame className="w-3 h-3" />
                  Streak On
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {motivation}
            </p>

            {/* Glowing Linear Progress Bar */}
            <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percentComplete}%`,
                  backgroundColor: accent.hex,
                  boxShadow: `0 0 12px ${accent.hex}`,
                }}
                role="progressbar"
                aria-valuenow={percentComplete}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task completion progress"
              />
            </div>
          </div>
        </div>

        {/* Right: Glass Stat Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          {/* Total */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white leading-none font-display">
                {total}
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Total
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 leading-none font-display">
                {completed}
              </div>
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
                Done
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-blue-900 dark:text-blue-200 leading-none font-display">
                {inProgress}
              </div>
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
                Active
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-rose-900 dark:text-rose-200 leading-none font-display">
                {overdue}
              </div>
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 uppercase tracking-wider">
                Overdue
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
