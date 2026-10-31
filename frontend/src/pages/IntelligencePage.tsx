import React from 'react';
import { useTasks } from '../context/TaskContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const { tasks, stats } = useTasks();

  // Status metrics
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done' || t.completed).length;

  // Priority metrics
  const highCount = tasks.filter((t) => t.priority === 'high').length;
  const medCount = tasks.filter((t) => t.priority === 'medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'low').length;

  // Mock 7-day completion velocity (past 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyVelocity = [2, 4, 1, 5, 3, 6, doneCount || 4];
  const maxVelocity = Math.max(...dailyVelocity, 1);

  return (
    <AppLayout title="INTELLIGENCE // ANALYTICS & TELEMETRY">
      {/* Header */}
      <div className="pb-2 border-b border-[#1e1e38]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--neon-primary)]" />
          <h2 className="text-2xl font-extrabold font-display text-white tracking-wider uppercase">
            TACTICAL INTELLIGENCE METRICS
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          ANALYZING TASK DISTRIBUTION, COMPLETION VELOCITY, AND SYSTEM WORKLOAD.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="bracket" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">Success Rate</span>
            <Badge variant="green">{stats.percentComplete}%</Badge>
          </div>
          <div className="text-3xl font-extrabold font-display text-[#39ff88]">
            {stats.completed} / {stats.total}
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Accomplished milestones</p>
        </Card>

        <Card variant="bracket" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">Workload Intensity</span>
            <Badge variant={highCount > 2 ? 'magenta' : 'cyan'}>
              {highCount} CRITICAL
            </Badge>
          </div>
          <div className="text-3xl font-extrabold font-display text-[#ff2bd6]">
            {highCount + medCount} ACTIVE
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">High & medium priority queue</p>
        </Card>

        <Card variant="bracket" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase">Sector Health</span>
            <Badge variant={stats.overdue > 0 ? 'yellow' : 'green'}>
              {stats.overdue > 0 ? `${stats.overdue} OVERDUE` : 'NOMINAL'}
            </Badge>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">
            {stats.overdue === 0 ? '100% HEALTHY' : `${stats.overdue} DELAYED`}
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Overdue mission count</p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Completion Velocity Chart (SVG) */}
        <Card variant="bracket" className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e1e38] mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--neon-primary)]" />
              <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
                7-DAY MISSION COMPLETION VELOCITY
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">TELEMETRY / PAST 7 DAYS</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
            {dailyVelocity.map((val, idx) => {
              const heightPercent = Math.round((val / maxVelocity) * 100);
              return (
                <div key={days[idx]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400">{val}</span>
                  <div className="w-full bg-[#121221] h-36 flex items-end">
                    <div
                      className="w-full bg-[var(--neon-primary)] shadow-[0_0_8px_var(--neon-primary)] transition-all duration-500 cyber-clip-sm"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{days[idx]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Priority & Status Breakdown */}
        <Card variant="bracket" className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e1e38] mb-5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#ff2bd6]" />
              <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
                DISTRIBUTION BY STATUS & PRIORITY
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SECTOR BREAKDOWN</span>
          </div>

          <div className="space-y-4">
            {/* Status Breakdown Bars */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">ACCOMPLISHED [DONE]</span>
                <span className="text-[#39ff88] font-bold">{doneCount}</span>
              </div>
              <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                <div
                  className="h-full bg-[#39ff88]"
                  style={{ width: `${stats.total > 0 ? (doneCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">IN EXECUTION [ACTIVE]</span>
                <span className="text-[var(--neon-primary)] font-bold">{inProgressCount}</span>
              </div>
              <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                <div
                  className="h-full bg-[var(--neon-primary)]"
                  style={{ width: `${stats.total > 0 ? (inProgressCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">PENDING [TO DO]</span>
                <span className="text-[#f5e642] font-bold">{todoCount}</span>
              </div>
              <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                <div
                  className="h-full bg-[#f5e642]"
                  style={{ width: `${stats.total > 0 ? (todoCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Priority Meter */}
            <div className="pt-3 border-t border-[#1e1e38] space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">CRITICAL / HIGH PRIORITY</span>
                  <span className="text-[#ff2bd6] font-bold">{highCount} ({stats.total > 0 ? Math.round((highCount / stats.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                  <div
                    className="h-full bg-[#ff2bd6] shadow-[0_0_8px_#ff2bd6]"
                    style={{ width: `${stats.total > 0 ? (highCount / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">STANDARD / MEDIUM PRIORITY</span>
                  <span className="text-[#f5e642] font-bold">{medCount}</span>
                </div>
                <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                  <div
                    className="h-full bg-[#f5e642]"
                    style={{ width: `${stats.total > 0 ? (medCount / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">LOW PRIORITY</span>
                  <span className="text-slate-400 font-bold">{lowCount}</span>
                </div>
                <div className="w-full h-2 bg-[#090912] border border-[#1e1e38]">
                  <div
                    className="h-full bg-slate-500"
                    style={{ width: `${stats.total > 0 ? (lowCount / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
