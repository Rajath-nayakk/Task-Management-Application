import React, { createContext, useContext, useState, useEffect } from 'react';

export type CyberAccent = 'cyan' | 'magenta' | 'green';

interface CyberAccentConfig {
  id: CyberAccent;
  name: string;
  primary: string;
  glow: string;
  glowBorder: string;
}

export const CYBER_ACCENTS: Record<CyberAccent, CyberAccentConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cyan Neon',
    primary: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.4)',
    glowBorder: 'rgba(0, 240, 255, 0.3)',
  },
  magenta: {
    id: 'magenta',
    name: 'Magenta Hyper',
    primary: '#ff2bd6',
    glow: 'rgba(255, 43, 214, 0.4)',
    glowBorder: 'rgba(255, 43, 214, 0.3)',
  },
  green: {
    id: 'green',
    name: 'Matrix Emerald',
    primary: '#39ff88',
    glow: 'rgba(57, 255, 136, 0.4)',
    glowBorder: 'rgba(57, 255, 136, 0.3)',
  },
};

interface CyberThemeContextType {
  accent: CyberAccent;
  accentConfig: CyberAccentConfig;
  setAccent: (accent: CyberAccent) => void;
  scanlinesEnabled: boolean;
  setScanlinesEnabled: (enabled: boolean) => void;
}

const CyberThemeContext = createContext<CyberThemeContextType | undefined>(undefined);

export const CyberThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<CyberAccent>(() => {
    return (localStorage.getItem('taskbuddy_cyber_accent') as CyberAccent) || 'cyan';
  });

  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskbuddy_scanlines');
    return saved !== null ? saved === 'true' : true;
  });

  const applyAccent = (acc: CyberAccent) => {
    const config = CYBER_ACCENTS[acc] || CYBER_ACCENTS.cyan;
    document.documentElement.style.setProperty('--neon-primary', config.primary);
    document.documentElement.style.setProperty('--neon-glow', config.glow);
    document.documentElement.style.setProperty('--neon-glow-border', config.glowBorder);
    localStorage.setItem('taskbuddy_cyber_accent', acc);
    setAccentState(acc);
  };

  useEffect(() => {
    applyAccent(accent);
  }, []);

  const handleSetScanlines = (enabled: boolean) => {
    setScanlinesEnabled(enabled);
    localStorage.setItem('taskbuddy_scanlines', String(enabled));
  };

  return (
    <CyberThemeContext.Provider
      value={{
        accent,
        accentConfig: CYBER_ACCENTS[accent],
        setAccent: applyAccent,
        scanlinesEnabled,
        setScanlinesEnabled: handleSetScanlines,
      }}
    >
      {scanlinesEnabled && <div className="cyber-scanlines" aria-hidden="true" />}
      {children}
    </CyberThemeContext.Provider>
  );
};

export const useCyberTheme = (): CyberThemeContextType => {
  const ctx = useContext(CyberThemeContext);
  if (!ctx) {
    throw new Error('useCyberTheme must be used within CyberThemeProvider');
  }
  return ctx;
};
