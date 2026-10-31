import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCyberTheme, CYBER_ACCENTS, CyberAccent } from '../../context/CyberThemeContext';
import { Menu, LogOut, Terminal, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onOpenMobile: () => void;
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobile, title }) => {
  const { logout } = useAuth();
  const { accent, setAccent } = useCyberTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accents: CyberAccent[] = ['cyan', 'magenta', 'green'];

  return (
    <header className="h-16 bg-[#090912]/80 backdrop-blur-md border-b border-[#1e1e38] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-slate-300 hover:text-white bg-[#121221] border border-[#1e1e38] cyber-clip-sm"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--neon-primary)] hidden sm:block" />
          <h1 className="font-display font-extrabold text-base sm:text-lg tracking-wider text-white">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Accent Switcher, Status Telemetry, & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Accent Color Swatches */}
        <div className="flex items-center gap-1.5 p-1 bg-[#10101c] border border-[#1e1e38] cyber-clip-sm">
          <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 hidden md:block">
            HUD ACCENT:
          </span>
          {accents.map((acc) => {
            const isSelected = accent === acc;
            const config = CYBER_ACCENTS[acc];
            return (
              <button
                key={acc}
                onClick={() => setAccent(acc)}
                className={`w-5 h-5 rounded-none cyber-clip-sm transition-all ${
                  isSelected
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-50 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  backgroundColor: config.primary,
                  boxShadow: isSelected ? `0 0 10px ${config.primary}` : 'none',
                }}
                title={config.name}
                aria-label={`Switch HUD accent to ${config.name}`}
              />
            );
          })}
        </div>

        {/* Live System Telemetry Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#10101c] border border-[#1e1e38] cyber-clip-sm text-[10px] font-mono font-bold text-[#39ff88]">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>LINK: READY</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 cyber-clip-sm transition-colors"
          title="Disconnect Operator Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TERMINATE</span>
        </button>
      </div>
    </header>
  );
};
