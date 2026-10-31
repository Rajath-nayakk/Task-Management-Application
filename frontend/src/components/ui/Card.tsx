import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bracket' | 'glass';
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  glow = false,
  ...props
}) => {
  const baseClasses =
    'relative bg-[#0d0d17]/90 border border-[#1e1e38] transition-all duration-200';
  const bracketClasses = variant === 'bracket' ? 'hud-bracket' : '';
  const glowClasses = glow
    ? 'shadow-[0_0_20px_var(--neon-glow-border)] border-[var(--neon-primary)]'
    : 'hover:border-[#2a2a4d]';

  return (
    <div
      className={`${baseClasses} ${bracketClasses} ${glowClasses} cyber-clip-sm rounded-none p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
