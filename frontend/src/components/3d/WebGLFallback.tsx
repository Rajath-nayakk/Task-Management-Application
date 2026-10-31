import React from 'react';

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface WebGLFallbackProps {
  accentHex?: string;
  className?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  accentHex = '#6366f1',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* Cinematic radial aura */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentHex} 0%, transparent 70%)`,
        }}
      />

      {/* Futuristic grid overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Decorative procedural fallback monolith */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-48 h-14 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400 tracking-wider">
          DONE • SLAB 03
        </div>
        <div
          className="w-56 h-16 rounded-2xl bg-slate-900/95 border backdrop-blur-md shadow-xl flex items-center justify-center text-sm font-extrabold tracking-wider transition-colors"
          style={{
            borderColor: `${accentHex}60`,
            boxShadow: `0 10px 30px ${accentHex}20`,
            color: accentHex,
          }}
        >
          IN PROGRESS • SLAB 02
        </div>
        <div className="w-48 h-14 rounded-2xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md shadow-lg flex items-center justify-center text-xs font-bold text-slate-400 tracking-wider">
          TO DO • SLAB 01
        </div>
      </div>
    </div>
  );
};
