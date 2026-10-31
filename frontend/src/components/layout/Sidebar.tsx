import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCyberTheme } from '../../context/CyberThemeContext';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Users2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Shield,
  Radio,
  X,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const { accentConfig } = useCyberTheme();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: 'LIVE',
    },
    {
      to: '/tasks',
      label: 'Operations',
      icon: <CheckSquare className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/analytics',
      label: 'Intelligence',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    ...(user?.role === 'admin'
      ? [
          {
            to: '/agents',
            label: 'Agent Network',
            icon: <Users2 className="w-5 h-5 shrink-0" />,
            badge: 'ADMIN',
          },
        ]
      : []),
    {
      to: '/systems',
      label: 'Systems',
      icon: <Cpu className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0a0a14] border-r border-[#1e1e38] transition-all duration-300 lg:static ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e1e38]">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={onCloseMobile}
          >
            <div
              className="w-9 h-9 rounded-none flex items-center justify-center text-black font-extrabold cyber-clip-sm shrink-0"
              style={{
                backgroundColor: accentConfig.primary,
                boxShadow: `0 0 12px ${accentConfig.glow}`,
              }}
            >
              <Radio className="w-5 h-5 stroke-[2.5]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-display font-extrabold text-base tracking-widest text-white truncate">
                  TASKBUDDY
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--neon-primary)] truncate">
                  TACTICAL // HUD
                </div>
              </div>
            )}
          </NavLink>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 cyber-clip-sm transition-all group font-display font-bold uppercase tracking-wider text-xs sm:text-sm ${
                  isActive
                    ? 'bg-[#151528] text-white border-l-2 border-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-glow-border)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#101020]'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="text-[var(--neon-primary)] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--neon-primary)]/15 text-[var(--neon-primary)] border border-[var(--neon-primary)]/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-[#1e1e38]">
          <div className="flex items-center gap-3 p-2 bg-[#0e0e1a] border border-[#1e1e38] cyber-clip-sm">
            <div
              className="w-8 h-8 flex items-center justify-center font-mono font-bold text-xs text-black cyber-clip-sm shrink-0"
              style={{ backgroundColor: accentConfig.primary }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate font-display">
                  {user?.name || 'Operator'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[var(--neon-primary)]" />
                  <span className="uppercase">{user?.role || 'user'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-end p-3 border-t border-[#1e1e38]">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center py-1.5 text-slate-500 hover:text-white hover:bg-[#121221] transition-colors font-mono text-[11px]"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
