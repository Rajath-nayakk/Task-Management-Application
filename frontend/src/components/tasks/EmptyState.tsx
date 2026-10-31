import React from 'react';
import { ClipboardList, SearchX, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  isFiltering: boolean;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFiltering, onAction }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
        {isFiltering ? (
          <SearchX className="w-8 h-8 stroke-[1.8]" />
        ) : (
          <ClipboardList className="w-8 h-8 stroke-[1.8]" />
        )}
      </div>

      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1.5">
        {isFiltering ? 'No matching tasks found' : 'No tasks on your board'}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
        {isFiltering
          ? 'Try adjusting your search keywords, priority levels, or status filters.'
          : 'You are all caught up! Create a new task to organize your work and stay on track.'}
      </p>

      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {isFiltering ? (
          <>
            <RefreshCw className="w-4 h-4" />
            Reset All Filters
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Create Your First Task
          </>
        )}
      </button>
    </div>
  );
};
