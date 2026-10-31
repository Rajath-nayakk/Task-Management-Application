import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: React.ReactNode;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: {
      text: 'text-[#00f0ff]',
      border: 'border-[#00f0ff]/30',
      bg: 'bg-[#00f0ff]/10',
      glow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    },
    magenta: {
      text: 'text-[#ff2bd6]',
      border: 'border-[#ff2bd6]/30',
      bg: 'bg-[#ff2bd6]/10',
      glow: 'shadow-[0_0_15px_rgba(255,43,214,0.15)]',
    },
    yellow: {
      text: 'text-[#f5e642]',
      border: 'border-[#f5e642]/30',
      bg: 'bg-[#f5e642]/10',
      glow: 'shadow-[0_0_15px_rgba(245,230,66,0.15)]',
    },
    green: {
      text: 'text-[#39ff88]',
      border: 'border-[#39ff88]/30',
      bg: 'bg-[#39ff88]/10',
      glow: 'shadow-[0_0_15px_rgba(57,255,136,0.15)]',
    },
  }[color];

  return (
    <Card variant="bracket" className={`hover:${colorMap.glow} transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-extrabold font-display text-white mt-1 leading-none">
            {value}
          </div>
          {subValue && (
            <div className="text-[10px] font-mono text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              {subValue}
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-none border ${colorMap.border} ${colorMap.bg} ${colorMap.text}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
