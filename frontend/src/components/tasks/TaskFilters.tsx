import React, { useState } from 'react';
import { TaskFilterState, TaskStatus, Priority, SortOption } from '../../types/task';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/Button';

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
    { label: 'ALL', value: 'all' },
    { label: 'PENDING', value: 'todo' },
    { label: 'EXECUTING', value: 'in-progress' },
    { label: 'ACCOMPLISHED', value: 'done' },
  ];

  const priorities: { label: string; value: Priority | 'all' }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'CRITICAL [HIGH]', value: 'high' },
    { label: 'ELEVATED [MED]', value: 'medium' },
    { label: 'STANDARD [LOW]', value: 'low' },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'DEADLINE: EARLIEST FIRST', value: 'dueDate-asc' },
    { label: 'DEADLINE: LATEST FIRST', value: 'dueDate-desc' },
    { label: 'PRIORITY: CRITICAL TO LOW', value: 'priority-desc' },
    { label: 'PRIORITY: LOW TO CRITICAL', value: 'priority-asc' },
    { label: 'DEPLOYED: NEWEST FIRST', value: 'created-desc' },
    { label: 'DEPLOYED: OLDEST FIRST', value: 'created-asc' },
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
    <div className="bg-[#0d0d17] border border-[#1e1e38] cyber-clip-sm p-4 sm:p-5">
      {/* Top Search & Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="FILTER MISSIONS BY KEYWORD OR INTEL..."
            className="w-full pl-10 pr-4 py-2 bg-[#080811] border border-[#1e1e38] text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[var(--neon-primary)] focus:shadow-[0_0_12px_var(--neon-glow-border)] cyber-clip-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#121221] border border-[#1e1e38] text-xs font-mono font-bold text-slate-200 cyber-clip-sm"
          aria-label="Open filter settings"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--neon-primary)]" />
          <span>FILTERS</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[var(--neon-primary)] animate-pulse" />
          )}
        </button>

        {/* Desktop Sort Dropdown */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filters.sort}
            onChange={handleSortChange}
            aria-label="Sort missions by"
            className="px-3 py-2 bg-[#080811] border border-[#1e1e38] text-xs font-mono font-semibold text-slate-300 focus:outline-none focus:border-[var(--neon-primary)] cyber-clip-sm uppercase"
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
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[#1e1e38]">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mr-1">
            STATUS:
          </span>
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`px-3 py-1 text-xs font-mono font-bold cyber-clip-sm border transition-all ${
                filters.status === s.value
                  ? 'bg-[var(--neon-primary)] text-black border-[var(--neon-primary)] shadow-[0_0_10px_var(--neon-glow)]'
                  : 'bg-[#090912] text-slate-400 border-[#1e1e38] hover:border-slate-600 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Priority Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mr-1">
            PRIORITY:
          </span>
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePriorityChange(p.value)}
              className={`px-3 py-1 text-xs font-mono font-bold cyber-clip-sm border transition-all ${
                filters.priority === p.value
                  ? 'bg-[#ff2bd6] text-black border-[#ff2bd6] shadow-[0_0_10px_rgba(255,43,214,0.4)]'
                  : 'bg-[#090912] text-slate-400 border-[#1e1e38] hover:border-slate-600 hover:text-white'
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
            className="text-xs font-mono font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 uppercase"
          >
            RESET TELEMETRY
          </button>
        )}
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-[#0d0d17] border-t-2 sm:border-2 border-[var(--neon-primary)]/70 cyber-clip hud-bracket p-6 z-10 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e1e38]">
              <h3 className="font-display font-bold text-base text-white tracking-widest uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--neon-primary)]" />
                TACTICAL FILTERS
              </h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">
                  SORT ORDER
                </label>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 bg-[#080811] border border-[#1e1e38] text-xs font-mono text-slate-200"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">
                  STATUS
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(s.value)}
                      className={`px-3 py-2 text-xs font-mono font-bold cyber-clip-sm border ${
                        filters.status === s.value
                          ? 'bg-[var(--neon-primary)] text-black border-[var(--neon-primary)]'
                          : 'bg-[#0a0a14] text-slate-400 border-[#1e1e38]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">
                  PRIORITY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handlePriorityChange(p.value)}
                      className={`px-3 py-2 text-xs font-mono font-bold cyber-clip-sm border ${
                        filters.priority === p.value
                          ? 'bg-[#ff2bd6] text-black border-[#ff2bd6]'
                          : 'bg-[#0a0a14] text-slate-400 border-[#1e1e38]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#1e1e38]">
              <Button
                variant="secondary"
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1"
              >
                Apply ({activeCount})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
