import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse flex items-start gap-3.5"
        >
          <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 mt-0.5"></div>
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-14 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
