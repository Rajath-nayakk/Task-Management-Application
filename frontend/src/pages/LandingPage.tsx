import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCyberTheme } from '../context/CyberThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  ArrowRight,
  Shield,
  Target,
  BarChart3,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { accentConfig } = useCyberTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 cyber-bg flex flex-col justify-between selection:bg-[var(--neon-primary)] selection:text-black">
      {/* Top Navigation */}
      <header className="h-20 border-b border-[#1e1e38] px-6 sm:px-12 flex items-center justify-between bg-[#07070d]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center text-black font-extrabold cyber-clip-sm"
            style={{
              backgroundColor: accentConfig.primary,
              boxShadow: `0 0 15px ${accentConfig.glow}`,
            }}
          >
            <Radio className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-display font-extrabold text-lg tracking-widest text-white">
              TASKBUDDY
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--neon-primary)]">
              TACTICAL DASHBOARD // HUD v1.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Command Center
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                Access Terminal
              </Link>
              <Link to="/register">
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Deploy Unit
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center space-y-12">
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121221] border border-[var(--neon-primary)]/40 cyber-clip-sm text-xs font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-primary)] animate-pulse" />
            <span className="text-[var(--neon-primary)] font-bold">OPERATIONAL PROTOCOL 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-wider text-white leading-tight">
            TACTICAL MISSION DISPATCH & TELEMETRY
          </h1>

          <p className="text-sm sm:text-base font-mono text-slate-400 max-w-2xl mx-auto leading-relaxed">
            High-velocity task orchestration designed for demanding workflows. Plan missions, monitor priority queues, and sync telemetry in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" variant="primary" icon={<Target className="w-4 h-4" />}>
                Enter Command Center
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/tasks">
                <Button size="lg" variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                  Active Missions
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                  Operator Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
          <Card variant="bracket" className="p-6">
            <div className="w-10 h-10 mb-4 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center cyber-clip-sm">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white tracking-wider uppercase mb-2">
              Command & Operations
            </h3>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Full-spectrum mission tracking with priority queues, instant status toggles, and overdue risk detection.
            </p>
          </Card>

          <Card variant="bracket" className="p-6">
            <div className="w-10 h-10 mb-4 bg-[#ff2bd6]/10 border border-[#ff2bd6]/30 text-[#ff2bd6] flex items-center justify-center cyber-clip-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white tracking-wider uppercase mb-2">
              Tactical Intelligence
            </h3>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Real-time SVG velocity telemetry, 7-day completion curves, and sector workload distribution matrices.
            </p>
          </Card>

          <Card variant="bracket" className="p-6">
            <div className="w-10 h-10 mb-4 bg-[#39ff88]/10 border border-[#39ff88]/30 text-[#39ff88] flex items-center justify-center cyber-clip-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white tracking-wider uppercase mb-2">
              Agent Clearances
            </h3>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Role-based authorization protecting sensitive operations. Multi-tenant data isolation enforced by PostgreSQL.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e38] py-6 px-6 sm:px-12 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>TASKBUDDY // CYBERPUNK TACTICAL SUITE</div>
        <div className="text-[10px] text-slate-600">SECURE PROTOCOL • ALL SYSTEMS NOMINAL</div>
      </footer>
    </div>
  );
};
