import React, { useState } from 'react';
import { TaskFilterState, TaskStatus, Priority, SortOption } from '../../types/task';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilterState;
  onFilterChange: (filters: TaskFilterState) => void;
  onReset: () => void;
  activeCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  activeCount,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const statuses: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
  ];

  const priorities: { label: string; value: Priority | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Due Date: Earliest first', value: 'dueDate-asc' },
    { label: 'Due Date: Latest first', value: 'dueDate-desc' },
    { label: 'Priority: High to Low', value: 'priority-desc' },
    { label: 'Priority: Low to High', value: 'priority-asc' },
    { label: 'Newest first', value: 'created-desc' },
    { label: 'Oldest first', value: 'created-asc' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: TaskStatus | 'all') => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: Priority | 'all') => {
    onFilterChange({ ...filters, priority });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sort: e.target.value as SortOption });
  };

  const hasActiveFilters =
    filters.search !== '' || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Search & Mobile Filter Toggle */}
      <div className="flex items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200"
          aria-label="Open filter settings"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
          )}
        </button>

        {/* Desktop Sort Dropdown */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filters.sort}
            onChange={handleSortChange}
            aria-label="Sort tasks by"
            className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-medium bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Filter Pills */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                filters.status === s.value
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Priority Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Priority:
          </span>
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePriorityChange(p.value)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                filters.priority === p.value
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                Filter & Sort Tasks
              </h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Sort selector in mobile drawer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sort Order
                </label>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(s.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium ${
                        filters.status === s.value
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handlePriorityChange(p.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium ${
                        filters.priority === p.value
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl bg-brand-600 text-white"
              >
                Apply ({activeCount} Tasks)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
