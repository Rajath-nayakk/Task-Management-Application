import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantStyles = {
    cyan: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
    magenta: 'bg-[#ff2bd6]/10 text-[#ff2bd6] border-[#ff2bd6]/30',
    yellow: 'bg-[#f5e642]/10 text-[#f5e642] border-[#f5e642]/30',
    green: 'bg-[#39ff88]/10 text-[#39ff88] border-[#39ff88]/30',
    muted: 'bg-slate-800 text-slate-400 border-slate-700',
  }[variant];

  const dotColors = {
    cyan: 'bg-[#00f0ff]',
    magenta: 'bg-[#ff2bd6]',
    yellow: 'bg-[#f5e642]',
    green: 'bg-[#39ff88]',
    muted: 'bg-slate-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider border cyber-clip-sm ${sizeClasses} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} animate-pulse`} />}
      {children}
    </span>
  );
};
