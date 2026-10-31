import React from 'react';
import { CheckSquare } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          TaskBuddy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Phase 1 scaffolding complete. Ready for Phase 2 UI implementation!
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Frontend Initialized
        </div>
      </div>
    </div>
  );
};

export default App;
