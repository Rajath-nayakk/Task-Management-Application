import React from 'react';
import { Modal } from './Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'CONFIRM',
  confirmVariant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-3 mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 cyber-clip-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
        <p className="text-xs font-mono leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
