import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCyberTheme } from '../context/CyberThemeContext';
import { loginSchema, LoginFormData } from '../types/schema';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Terminal, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { accent, setAccent } = useCyberTheme();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent flash of login form while initial session is verifying from cookie
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center p-4 cyber-grid">
        <div className="w-12 h-12 bg-[#0d0d17] border border-[var(--neon-primary)] cyber-clip-sm flex items-center justify-center text-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-glow-border)] animate-pulse mb-4">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-slate-300">
          INITIALIZING OPERATIVE CLEARANCE...
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-2">
          ESTABLISHING ENCRYPTED SEC_LINK
        </div>
      </div>
    );
  }

  // If already authenticated, redirect straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData;
        if (field) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      showToast('Tactical clearance verified. Welcome back.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Authentication failed. Access denied.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070d] flex flex-col justify-between p-4 sm:p-6 text-slate-100 cyber-grid overflow-hidden">
      {/* Top HUD bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between border-b border-[#1e1e38] pb-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#0d0d17] border border-[var(--neon-primary)] cyber-clip-sm flex items-center justify-center text-[var(--neon-primary)] shadow-[0_0_10px_var(--neon-glow-border)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-widest uppercase text-white">
              TaskBuddy <span className="text-[var(--neon-primary)] text-xs font-mono">//HUD</span>
            </span>
          </div>
        </Link>

        {/* Accent switcher */}
        <div className="flex items-center gap-1.5 bg-[#0d0d17] border border-[#1e1e38] px-2.5 py-1 cyber-clip-sm">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">ACCENT</span>
          {(['cyan', 'magenta', 'green'] as const).map((acc) => (
            <button
              key={acc}
              type="button"
              onClick={() => setAccent(acc)}
              className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                accent === acc
                  ? 'border-white scale-125 shadow-[0_0_8px_currentColor]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor:
                  acc === 'cyan' ? '#00f0ff' : acc === 'magenta' ? '#ff2bd6' : '#39ff88',
              }}
              title={`Switch to ${acc} accent`}
            />
          ))}
        </div>
      </header>

      {/* Main Terminal Login Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-8">
        <Card variant="bracket" glow className="p-6 sm:p-8">
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b border-[#1e1e38] pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--neon-primary)]">
              <Shield className="w-4 h-4" />
              <span>TERMINAL_AUTH // SEC_CLEARANCE</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">PORT: 443</span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
              Operator Sign-In
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Initialize encrypted tactical link to access Command Center.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              name="email"
              type="email"
              label="Operator Email"
              hint="REQUIRED"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={handleChange}
              placeholder="operator@taskbuddy.corp"
              error={errors.email}
              required
            />

            <Input
              id="login-password"
              name="password"
              type="password"
              label="Access Cipher"
              hint="MIN 6 CHARS"
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-4"
            >
              {isSubmitting ? 'Verifying Cipher...' : 'Authorize Link'}
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-4 border-t border-[#1e1e38] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>New Operative?</span>
            <Link
              to="/register"
              className="text-[var(--neon-primary)] hover:underline font-semibold uppercase"
            >
              Enlist Clearance &rarr;
            </Link>
          </div>
        </Card>
      </main>

      {/* Terminal Footer */}
      <footer className="relative z-10 text-center text-xs font-mono text-slate-600 pb-2 flex items-center justify-center gap-3">
        <span>SYS.V2.5.0 // TACTICAL DASHBOARD</span>
        <span>•</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          CIPHER_ONLINE
        </span>
      </footer>
    </div>
  );
};
