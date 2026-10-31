import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users2, ShieldCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface AgentRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  taskCount: number;
  completedCount: number;
  lastActive: string;
}

export const AgentNetworkPage: React.FC = () => {
  const { user } = useAuth();

  // Route protection: only admin can view Agent Network
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Mock users list (will connect to GET /api/admin/users in Phase 5)
  const mockAgents: AgentRecord[] = [
    {
      id: 'usr-001',
      name: 'System Administrator',
      email: 'admin@taskbuddy.com',
      role: 'admin',
      taskCount: 14,
      completedCount: 11,
      lastActive: 'Just now',
    },
    {
      id: 'usr-101',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      role: 'user',
      taskCount: 6,
      completedCount: 2,
      lastActive: '2 mins ago',
    },
    {
      id: 'usr-102',
      name: 'Sarah Connor',
      email: 'sarah@resistance.net',
      role: 'user',
      taskCount: 8,
      completedCount: 7,
      lastActive: '18 mins ago',
    },
    {
      id: 'usr-103',
      name: 'David Lightman',
      email: 'david@wargames.io',
      role: 'user',
      taskCount: 3,
      completedCount: 1,
      lastActive: '1 hour ago',
    },
  ];

  return (
    <AppLayout title="AGENT NETWORK // SECURITY CLEARANCE REQUIRED">
      {/* Header */}
      <div className="pb-2 border-b border-[#1e1e38]">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-[#ff2bd6]" />
          <h2 className="text-2xl font-extrabold font-display text-white tracking-wider uppercase">
            OPERATOR DIRECTORY & CLEARANCE MATRIX
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          SECURE PROTOCOL // ADMIN ONLY ROSTER MONITORING ACROSS ALL SECTORS.
        </p>
      </div>

      {/* Admin Notice Banner */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 cyber-clip-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-xs font-mono">
            <span className="font-bold text-white uppercase">[ADMIN ACCESS GRANTED]</span> — You are viewing global multi-tenant task distribution telemetry.
          </div>
        </div>
        <Badge variant="cyan">RESTRICTED</Badge>
      </div>

      {/* Agents Roster Table */}
      <Card variant="bracket" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e1e38] text-slate-400 uppercase tracking-wider pb-3">
                <th className="pb-3 font-bold">OPERATOR / EMAIL</th>
                <th className="pb-3 font-bold">CLEARANCE</th>
                <th className="pb-3 font-bold">ASSIGNED MISSIONS</th>
                <th className="pb-3 font-bold">SUCCESS RATE</th>
                <th className="pb-3 font-bold">LAST TELEMETRY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141424]">
              {mockAgents.map((agent) => {
                const percent = Math.round((agent.completedCount / agent.taskCount) * 100);
                return (
                  <tr key={agent.id} className="hover:bg-[#101020] transition-colors">
                    <td className="py-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#121221] border border-[#1e1e38] flex items-center justify-center text-[var(--neon-primary)] cyber-clip-sm text-xs">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div>{agent.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{agent.email}</div>
                      </div>
                    </td>

                    <td className="py-4">
                      <Badge variant={agent.role === 'admin' ? 'magenta' : 'cyan'}>
                        {agent.role}
                      </Badge>
                    </td>

                    <td className="py-4 font-bold text-slate-200">
                      {agent.taskCount} TASKS
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-[#0a0a14] border border-[#1e1e38] overflow-hidden">
                          <div
                            className="h-full bg-[#39ff88]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[#39ff88] font-bold">{percent}%</span>
                      </div>
                    </td>

                    <td className="py-4 text-slate-400">
                      {agent.lastActive}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
};
