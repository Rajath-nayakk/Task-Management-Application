import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Tactical Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#0d0d17]/95 border cyber-clip-sm shadow-2xl backdrop-blur-md transition-all duration-200 animate-slide-up ${
              isSuccess
                ? 'border-[#39ff88]/60 shadow-[0_0_15px_rgba(57,255,136,0.2)] text-[#39ff88]'
                : isError
                ? 'border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)] text-rose-400'
                : 'border-[var(--neon-primary)]/60 shadow-[0_0_15px_var(--neon-glow-border)] text-[var(--neon-primary)]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#39ff88]" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[var(--neon-primary)]" />}
            </div>

            <p className="text-xs font-mono font-semibold leading-relaxed flex-1 text-slate-200">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-500 hover:text-white p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
