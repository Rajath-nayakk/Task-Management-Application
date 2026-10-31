import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { use3DStore } from '../store/use3DStore';
import { registerSchema, RegisterFormData } from '../types/schema';
import { AuthBackground3D } from '../components/3d/AuthBackground3D';
import { CustomizerPanel } from '../components/3d/CustomizerPanel';
import { CheckSquare, ArrowRight, Sun, Moon, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { accent } = use3DStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await register(formData.name, formData.email);
      showToast('Account created successfully! Welcome to TaskBuddy.', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 overflow-hidden">
      {/* 3D Slow-moving particle/slab background */}
      <AuthBackground3D />

      {/* Top Navbar */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
            style={{
              backgroundColor: accent.hex,
              boxShadow: `0 0 16px ${accent.hex}40`,
            }}
          >
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-base text-white">
            TaskBuddy
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-8">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl animate-slide-up">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white font-display">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Start orchestrating tasks in an interactive 3D dimension.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-950/70 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                backgroundColor: accent.hex,
                boxShadow: `0 4px 20px ${accent.hex}40`,
              }}
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer link to Login */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: accent.hex }}
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      <CustomizerPanel />

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 pb-2">
        TaskBuddy • Real-Time Spatial Workspace
      </footer>
    </div>
  );
};
