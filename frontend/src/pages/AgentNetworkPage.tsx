import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Users2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { adminApi, AdminUserRecord } from '../api/admin';

export const AgentNetworkPage: React.FC = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route protection: only admin can view Agent Network
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getUsers();
      setAgents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to establish link with agent database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <AppLayout title="AGENT NETWORK // SECURITY CLEARANCE REQUIRED">
      {/* Header */}
      <div className="pb-2 border-b border-[#1e1e38] flex items-center justify-between">
        <div>
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
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchAgents}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>SYNC TELEMETRY</span>
        </Button>
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

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 cyber-clip-sm">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>DATABASE ACCESS ERROR: {error}</span>
        </div>
      )}

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
                <th className="pb-3 font-bold">REGISTERED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141424]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-[var(--neon-primary)]" />
                      <span>DOWNLOADING OPERATOR MANIFEST...</span>
                    </div>
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    NO OPERATIVES FOUND IN CENTRAL REGISTRY.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => {
                  const percent = agent.taskCount > 0
                    ? Math.round((agent.completedCount / agent.taskCount) * 100)
                    : 0;

                  return (
                    <tr key={agent.id} className="hover:bg-[#101020] transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#121221] border border-[#1e1e38] flex items-center justify-center text-[var(--neon-primary)] cyber-clip-sm text-xs uppercase">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <div>{agent.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{agent.email}</div>
                        </div>
                      </td>

                      <td className="py-4">
                        <Badge variant={agent.role === 'admin' ? 'magenta' : 'cyan'}>
                          {agent.role.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-4 font-bold text-slate-200">
                        {agent.taskCount} {agent.taskCount === 1 ? 'TASK' : 'TASKS'}
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
                        {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
};
