import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400"
          >
            {label}
          </label>
          {hint && <span className="text-[10px] font-mono text-slate-500">{hint}</span>}
        </div>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0a0a14] border text-sm text-slate-100 placeholder-slate-600 font-mono transition-colors focus:outline-none ${
            icon ? 'pl-10 pr-3.5 py-2' : 'px-3.5 py-2'
          } ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
              : 'border-[#1e1e38] focus:border-[var(--neon-primary)] focus:shadow-[0_0_12px_var(--neon-glow-border)]'
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[11px] font-mono text-rose-400 tracking-wide mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {error}
        </p>
      )}
    </div>
  );
};
