import React, { useState, useEffect } from 'react';
import { ServerStatusDetail } from '../../api/client';
import { Loader2, AlertTriangle, Radio } from 'lucide-react';

export const ServerWakeBanner: React.FC = () => {
  const [status, setStatus] = useState<ServerStatusDetail | null>(null);

  useEffect(() => {
    const handleStatus = (e: Event) => {
      const customEvent = e as CustomEvent<ServerStatusDetail>;
      if (customEvent.detail) {
        if (!customEvent.detail.isWaking && !customEvent.detail.isFailed) {
          // Cleared / connected successfully
          setStatus(null);
        } else {
          setStatus(customEvent.detail);
        }
      }
    };

    window.addEventListener('api:server-status', handleStatus);
    return () => {
      window.removeEventListener('api:server-status', handleStatus);
    };
  }, []);

  if (!status) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2.5 bg-[#0d0d17]/95 border-b border-amber-500/60 shadow-[0_4px_20px_rgba(245,158,11,0.25)] backdrop-blur-md transition-all duration-300"
    >
      <div className="max-w-4xl w-full flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          {status.isFailed ? (
            <div className="w-6 h-6 rounded bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-bold uppercase tracking-wider text-amber-300">
              {status.isFailed ? 'LINK TIMEOUT' : 'SERVER COLD-START DETECTED'}
            </span>
            <span className="text-slate-300">
              {status.message}
            </span>
            {status.attempt && status.maxAttempts && !status.isFailed && (
              <span className="text-amber-400 font-semibold">
                [Retrying {status.attempt}/{status.maxAttempts}]
              </span>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 uppercase">
          <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Render Free Tier Awakening</span>
        </div>
      </div>
    </div>
  );
};
