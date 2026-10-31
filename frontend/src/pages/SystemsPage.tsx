import React from 'react';
import { useCyberTheme, CYBER_ACCENTS, CyberAccent } from '../context/CyberThemeContext';
import { useSocket } from '../context/SocketContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Cpu, Server, Palette } from 'lucide-react';

export const SystemsPage: React.FC = () => {
  const { accent, setAccent, scanlinesEnabled, setScanlinesEnabled } = useCyberTheme();
  const { isConnected, statusText } = useSocket();

  const accents: CyberAccent[] = ['cyan', 'magenta', 'green'];

  return (
    <AppLayout title="SYSTEMS // CONFIGURATION & TELEMETRY">
      {/* Header */}
      <div className="pb-2 border-b border-[#1e1e38]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[var(--neon-primary)]" />
          <h2 className="text-2xl font-extrabold font-display text-white tracking-wider uppercase">
            SYSTEM TELEMETRY & WORKSPACE MATRIX
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          CORE CONFIGURATION, HUD ACCENT CALIBRATION, AND CONNECTION STATUS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HUD Visual Matrix Panel */}
        <Card variant="bracket" className="p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1e1e38] mb-5">
            <Palette className="w-4 h-4 text-[var(--neon-primary)]" />
            <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
              HUD COLOR CHROMATICS
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <span className="block text-xs font-mono font-bold text-slate-400 uppercase mb-3">
                SELECT PRIMARY NEON ACCENT
              </span>
              <div className="grid grid-cols-3 gap-3">
                {accents.map((acc) => {
                  const isSelected = accent === acc;
                  const config = CYBER_ACCENTS[acc];
                  return (
                    <button
                      key={acc}
                      onClick={() => setAccent(acc)}
                      className={`p-3.5 bg-[#080811] border cyber-clip-sm flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-white shadow-[0_0_15px_var(--neon-glow)]'
                          : 'border-[#1e1e38] opacity-60 hover:opacity-100 hover:border-slate-500'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-none cyber-clip-sm"
                        style={{ backgroundColor: config.primary }}
                      />
                      <span className="text-[11px] font-mono font-bold uppercase text-slate-200">
                        {config.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scanlines Toggle */}
            <div className="pt-4 border-t border-[#1e1e38] flex items-center justify-between">
              <div>
                <span className="block text-xs font-mono font-bold text-white uppercase">
                  CRT SCANLINE OVERLAY
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Tactical optical grid filter
                </span>
              </div>

              <button
                onClick={() => setScanlinesEnabled(!scanlinesEnabled)}
                className={`px-3 py-1.5 text-xs font-mono font-bold cyber-clip-sm border transition-colors ${
                  scanlinesEnabled
                    ? 'bg-[var(--neon-primary)] text-black border-[var(--neon-primary)]'
                    : 'bg-[#121221] text-slate-400 border-slate-700'
                }`}
              >
                {scanlinesEnabled ? 'ACTIVE [ON]' : 'STANDBY [OFF]'}
              </button>
            </div>
          </div>
        </Card>

        {/* Server & API Connectivity Telemetry */}
        <Card variant="bracket" className="p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1e1e38] mb-5">
            <Server className="w-4 h-4 text-[#39ff88]" />
            <h3 className="font-display font-bold text-base text-white tracking-wider uppercase">
              NETWORK LINK STATUS
            </h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
              <span className="text-slate-400">REST API BACKEND</span>
              <div className="flex items-center gap-2">
                <Badge variant="green" dot>
                  http://localhost:5000
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
              <span className="text-slate-400">REAL-TIME SOCKET.IO LINK</span>
              <Badge variant={isConnected ? 'green' : 'yellow'} dot>
                {statusText}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
              <span className="text-slate-400">DATABASE ORCHESTRATOR</span>
              <Badge variant="green">
                SUPABASE POSTGRESQL
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
              <span className="text-slate-400">SECURITY PROTOCOL</span>
              <span className="text-slate-200">HELMET + CORS + RATE-LIMIT</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a0a14] border border-[#1e1e38] cyber-clip-sm">
              <span className="text-slate-400">SYSTEM BUILD VERSION</span>
              <span className="text-[var(--neon-primary)] font-bold">TASKBUDDY v1.0.0-CYBER</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
