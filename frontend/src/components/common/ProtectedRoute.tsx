import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Terminal } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center p-4 cyber-grid">
        <div className="w-12 h-12 bg-[#0d0d17] border border-[var(--neon-primary)] cyber-clip-sm flex items-center justify-center text-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-glow-border)] animate-pulse mb-4">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-slate-300">
          INITIALIZING OPERATIVE CLEARANCE...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
