import React, { useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import { use3DStore } from '../store/use3DStore';
import { CustomizerPanel } from '../components/3d/CustomizerPanel';
import { WebGLFallback } from '../components/3d/WebGLFallback';
import {
  CheckSquare,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

// Lazy-load the 3D Canvas
const CinematicCanvas = React.lazy(
  () => import('../components/3d/CinematicCanvas')
);

export const LandingPage: React.FC = () => {
  const { setScrollProgress, accent } = use3DStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollProgress]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[420vh] bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white"
    >
      {/* 3D WebGL Background Canvas with Suspense */}
      <Suspense fallback={<WebGLFallback accentHex={accent.hex} />}>
        <CinematicCanvas />
      </Suspense>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/40 transition-colors">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: accent.hex,
              boxShadow: `0 0 20px ${accent.hex}40`,
            }}
          >
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white">
              TaskBuddy
            </span>
            <span
              className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
              style={{
                borderColor: `${accent.hex}50`,
                backgroundColor: `${accent.hex}15`,
                color: accent.hex,
              }}
            >
              3D Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{
              backgroundColor: accent.hex,
              boxShadow: `0 4px 20px ${accent.hex}40`,
            }}
          >
            <span>Launch Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Floating 3D Customizer Studio Panel */}
      <CustomizerPanel />

      {/* Scroll Sections Container (Overlays 3D Canvas) */}
      <div className="relative z-10 pointer-events-none">
        {/* SECTION 1: HERO (0vh - 100vh) */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto space-y-6"
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md"
              style={{
                borderColor: `${accent.hex}50`,
                backgroundColor: `${accent.hex}15`,
                color: accent.hex,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE FUTURE OF TASK EXECUTION • PROCEDURAL 3D</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-white leading-[1.1]">
              Focus in Every{' '}
              <span
                className="bg-clip-text text-transparent transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(to right, #ffffff, ${accent.hex}, #38bdf8)`,
                }}
              >
                Dimension.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              TaskBuddy elevates personal workflow into an interactive, spatial
              engine. Scroll to explore the exploded task monolith.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: accent.hex,
                  boxShadow: `0 6px 30px ${accent.hex}50`,
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-slate-200 backdrop-blur-md hover:scale-105 transition-all"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Open Dashboard</span>
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce pointer-events-none">
            <span className="text-[11px] font-bold tracking-widest uppercase">
              Scroll to Explode Core
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* SECTION 2: PLAN (100vh) */}
        <section className="h-screen flex items-center px-6 sm:px-16 max-w-6xl mx-auto">
          <div className="max-w-md pointer-events-auto bg-slate-950/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              01 • Structured Architecture
            </span>
            <h2 className="text-3xl font-bold font-display text-white mt-1 mb-3">
              Plan With Precision.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Organize priorities with zero friction. Low, Medium, and High
              tiers guide daily velocity while preventing burnout.
            </p>
          </div>
        </section>

        {/* SECTION 3: TRACK & EXPLODED VIEW (200vh) */}
        <section className="h-screen flex items-center justify-end px-6 sm:px-16 max-w-6xl mx-auto">
          <div className="max-w-md pointer-events-auto bg-slate-950/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl text-right">
            <div
              className="w-12 h-12 ml-auto rounded-2xl border flex items-center justify-center mb-5"
              style={{
                backgroundColor: `${accent.hex}15`,
                borderColor: `${accent.hex}40`,
                color: accent.hex,
              }}
            >
              <Zap className="w-6 h-6" />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: accent.hex }}
            >
              02 • Interactive Exploded Telemetry
            </span>
            <h2 className="text-3xl font-bold font-display text-white mt-1 mb-3">
              Track In Real-Time.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Watch your task monolith separate dynamically into To Do, In
              Progress, and Done layers with floating telemetry cards.
            </p>
          </div>
        </section>

        {/* SECTION 4: COMPLETE (300vh) */}
        <section className="h-screen flex items-center px-6 sm:px-16 max-w-6xl mx-auto">
          <div className="max-w-md pointer-events-auto bg-slate-950/70 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              03 • Dopamine-Driven Velocity
            </span>
            <h2 className="text-3xl font-bold font-display text-white mt-1 mb-3">
              Complete & Ascend.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every completed item lights up the procedural progress torus. Live
              completion stats, overdue alerts, and celebratory particle bursts.
            </p>
          </div>
        </section>

        {/* SECTION 5: COLLABORATE & ENTER (400vh) */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
          <div className="pointer-events-auto bg-slate-950/80 border border-slate-800/80 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Instant Synchronicity.
            </h2>

            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Powered by Socket.IO room-based isolation and PostgreSQL
              durability. Changes in one tab synchronize across all devices
              instantly.
            </p>

            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: accent.hex,
                  boxShadow: `0 6px 30px ${accent.hex}50`,
                }}
              >
                <span>Enter TaskBuddy Board</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
