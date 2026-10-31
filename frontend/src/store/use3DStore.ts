import { create } from 'zustand';

export interface AccentPreset {
  id: string;
  name: string;
  hex: string;
  glow: string;
  ringClass: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: 'violet',
    name: 'Cyber Violet',
    hex: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    ringClass: 'ring-indigo-500',
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    hex: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    ringClass: 'ring-cyan-500',
  },
  {
    id: 'emerald',
    name: 'Emerald Flux',
    hex: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    ringClass: 'ring-emerald-500',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    hex: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    ringClass: 'ring-amber-500',
  },
  {
    id: 'rose',
    name: 'Hyper Rose',
    hex: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    ringClass: 'ring-pink-500',
  },
];

interface ThreeDState {
  scrollProgress: number;
  activeSection: number;
  accent: AccentPreset;
  customizerOpen: boolean;
  isReducedMotion: boolean;
  isLowPower: boolean;
  hoveredSlab: string | null;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: number) => void;
  setAccent: (preset: AccentPreset) => void;
  setCustomizerOpen: (open: boolean) => void;
  setHoveredSlab: (slab: string | null) => void;
}

export const use3DStore = create<ThreeDState>((set) => ({
  scrollProgress: 0,
  activeSection: 0,
  accent: ACCENT_PRESETS[0],
  customizerOpen: false,
  isReducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  isLowPower:
    typeof window !== 'undefined'
      ? window.innerWidth < 480 || (navigator.hardwareConcurrency || 4) <= 2
      : false,
  hoveredSlab: null,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setAccent: (accent) => {
    // Update CSS custom property so 2D UI accents synchronize seamlessly
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent-color', accent.hex);
      document.documentElement.style.setProperty('--accent-glow', accent.glow);
    }
    set({ accent });
  },
  setCustomizerOpen: (customizerOpen) => set({ customizerOpen }),
  setHoveredSlab: (hoveredSlab) => set({ hoveredSlab }),
}));
