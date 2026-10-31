import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--neon-primary)] text-black font-bold hover:shadow-[0_0_20px_var(--neon-glow)] active:scale-95 border border-[var(--neon-primary)]',
    secondary:
      'bg-[#121221] text-slate-200 border border-[#2a2a4d] hover:border-[var(--neon-primary)] hover:text-white',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-[#121221] border border-transparent',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider font-semibold transition-all duration-150 cyber-clip-sm disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[var(--neon-primary)] ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
