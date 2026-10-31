import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskFormData } from '../types/schema';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Flame,
  ArrowRight,
  Zap,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommandCenterPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, stats, addTask, toggleComplete } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateTask = (data: TaskFormData) => {
    addTask(data);
  };

  // High priority incomplete tasks (Priority Queue)
  const priorityQueue = tasks
    .filter((t) => !t.completed && t.status !== 'done')
    .sort((a, b) => {
      const pWeight = { high: 3, medium: 2, low: 1 };
      return pWeight[b.priority] - pWeight[a.priority];
    })
    .slice(0, 4);

  // Recent activity log from tasks
  const recentMissions = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <AppLayout title="COMMAND CENTER // OPERATIONAL OVERVIEW">
      {/* Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1e1e38]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39ff88] animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wider">
              OPERATOR: {user?.name?.toUpperCase() || 'ALEX MORGAN'}
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            SECTOR: PRIMARY // TACTICAL PRIORITY DISPATCH ACTIVE
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/tasks" className="flex-1 sm:flex-initial">
            <Button variant="secondary" className="w-full">
              Operations List
            </Button>
          </Link>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial"
          >
            Deploy Mission
          </Button>
        </div>
      </div>

      {/* Main Telemetry & Progress Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Tracker Card */}
        <Card variant="bracket" className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase text-[var(--neon-primary)] tracking-widest flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              VELOCITY TELEMETRY
            </span>
            <Badge variant={stats.percentComplete === 100 ? 'green' : 'cyan'}>
              {stats.completed}/{stats.total} TARGETS
            </Badge>
          </div>

          <div className="flex flex-col items-center justify-center my-3">
            <ProgressRing percent={stats.percentComplete} size={130} />
          </div>

          <div className="mt-4 pt-4 border-t border-[#1e1e38]">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 uppercase">Operational Quota</span>
              <span className="text-white font-bold">{stats.percentComplete}% COMPLETE</span>
            </div>
            <div className="w-full h-2 bg-[#07070d] border border-[#1e1e38] overflow-hidden cyber-clip-sm">
              <div
                className="h-full bg-[var(--neon-primary)] shadow-[0_0_12px_var(--neon-glow)] transition-all duration-700 ease-out"
                style={{ width: `${stats.percentComplete}%` }}
              />
            </div>
          </div>
        </Card>

        {/* 4 Stat Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            label="Total Missions"
            value={stats.total}
            subValue="All deployed tasks"
            icon={<ListTodo className="w-5 h-5" />}
            color="cyan"
          />
          <StatCard
            label="Accomplished"
            value={stats.completed}
            subValue={`${stats.percentComplete}% mission success`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            label="In Execution"
            value={stats.inProgress}
            subValue="Active operations"
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            label="Critical Overdue"
            value={stats.overdue}
            subValue="Immediate attention"
            icon={<AlertCircle className="w-5 h-5" />}
            color="magenta"
          />
        </div>
      </div>

      {/* Two Column Grid: Priority Queue & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Queue Panel */}
        <Card variant="bracket" className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e1e38] mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff2bd6]" />
              <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
                PRIORITY QUEUE // CRITICAL OBJECTIVES
              </h3>
            </div>
            <Link
              to="/tasks"
              className="text-[11px] font-mono text-[var(--neon-primary)] hover:underline flex items-center gap-1 uppercase"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {priorityQueue.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              // NO URGENT MISSIONS CURRENTLY IN QUEUE
            </div>
          ) : (
            <div className="space-y-3">
              {priorityQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm flex items-center justify-between gap-3 hover:border-[var(--neon-primary)] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={item.priority === 'high' ? 'magenta' : 'yellow'}
                        size="sm"
                      >
                        {item.priority}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-500">
                        DUE: {item.dueDate || 'ASAP'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white uppercase truncate font-display">
                      {item.title}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="p-1.5 bg-[#121221] hover:bg-[#39ff88] hover:text-black border border-slate-700 hover:border-[#39ff88] text-slate-400 cyber-clip-sm transition-colors text-[10px] font-mono font-bold"
                    title="Mark mission complete"
                  >
                    COMPLETE
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity Log */}
        <Card variant="bracket" className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e1e38] mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#39ff88]" />
              <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
                ACTIVITY TELEMETRY LOG
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#39ff88] animate-pulse">
              STREAMING
            </span>
          </div>

          <div className="space-y-3">
            {recentMissions.map((task, i) => (
              <div
                key={task.id}
                className="flex items-start gap-3 text-xs font-mono pb-2.5 border-b border-[#141424] last:border-0"
              >
                <div className="text-slate-500 shrink-0 text-[10px] mt-0.5">
                  [{i + 1 < 10 ? `0${i + 1}` : i + 1}]
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold truncate font-sans text-xs">
                      {task.title}
                    </span>
                    <Badge
                      variant={
                        task.completed
                          ? 'green'
                          : task.status === 'in-progress'
                          ? 'yellow'
                          : 'cyan'
                      }
                      size="sm"
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Updated: {new Date(task.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </AppLayout>
  );
};
