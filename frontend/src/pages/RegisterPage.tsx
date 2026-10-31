import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCyberTheme } from '../context/CyberThemeContext';
import { registerSchema, RegisterFormData } from '../types/schema';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Terminal, ShieldCheck, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { accent, setAccent } = useCyberTheme();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent flash of register form while initial session is verifying from cookie
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
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof RegisterFormData;
        if (field) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      showToast('Operative profile created. Clearance granted.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Enlistment protocol failed. Please re-check input.', 'error');
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

      {/* Main Terminal Register Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-8">
        <Card variant="bracket" glow className="p-6 sm:p-8">
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b border-[#1e1e38] pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--neon-primary)]">
              <ShieldCheck className="w-4 h-4" />
              <span>ENLIST_OPERATIVE // SEC_REGISTER</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">LEVEL: ALPHA</span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
              Operative Enlistment
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Create your tactical operator handle to deploy tasks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="register-name"
              name="name"
              type="text"
              label="Operative Call-Sign"
              hint="FULL NAME"
              icon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex 'Ghost' Vance"
              error={errors.name}
              required
            />

            <Input
              id="register-email"
              name="email"
              type="email"
              label="Comm Link (Email)"
              hint="REQUIRED"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={handleChange}
              placeholder="operative@taskbuddy.corp"
              error={errors.email}
              required
            />

            <Input
              id="register-password"
              name="password"
              type="password"
              label="Pass-Cipher"
              hint="MIN 6 CHARS"
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <Input
              id="register-confirmPassword"
              name="confirmPassword"
              type="password"
              label="Verify Pass-Cipher"
              hint="CONFIRM"
              icon={<Lock className="w-4 h-4" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
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
              {isSubmitting ? 'Enlisting Operative...' : 'Deploy Profile'}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-4 border-t border-[#1e1e38] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Already Enlisted?</span>
            <Link
              to="/login"
              className="text-[var(--neon-primary)] hover:underline font-semibold uppercase"
            >
              Authorize Link &rarr;
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
          REGISTRY_READY
        </span>
      </footer>
    </div>
  );
};
