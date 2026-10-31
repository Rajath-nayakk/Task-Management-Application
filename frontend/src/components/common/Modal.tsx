import React, { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cyberpunk Modal Card */}
      <div
        className={`relative w-full ${maxWidthClass} bg-[#0c0c17] border-2 border-[var(--neon-primary)]/70 cyber-clip hud-bracket p-6 sm:p-7 z-10 shadow-[0_0_35px_var(--neon-glow-border)] animate-slide-up`}
      >
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#1e1e38]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--neon-primary)]" />
              <h2
                id="modal-title"
                className="text-lg sm:text-xl font-bold font-display tracking-widest text-white uppercase"
              >
                {title}
              </h2>
            </div>
            {description && (
              <p className="text-xs font-mono text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-[#151528] cyber-clip-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
