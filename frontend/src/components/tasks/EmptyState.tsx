import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldX, Plus, RefreshCw, Terminal } from 'lucide-react';

interface EmptyStateProps {
  isFiltering: boolean;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFiltering, onAction }) => {
  return (
    <Card variant="bracket" className="p-8 sm:p-12 text-center">
      <div className="w-16 h-16 mx-auto bg-[#0a0a14] border border-[#1e1e38] flex items-center justify-center text-[var(--neon-primary)] mb-4 cyber-clip-sm shadow-[0_0_20px_var(--neon-glow-border)]">
        {isFiltering ? (
          <ShieldX className="w-8 h-8 stroke-[1.8]" />
        ) : (
          <Terminal className="w-8 h-8 stroke-[1.8]" />
        )}
      </div>

      <h3 className="font-display font-extrabold text-lg text-white mb-2 uppercase tracking-wider">
        {isFiltering ? '// ZERO MATCHING OBJECTIVES' : '// OPERATIONAL QUEUE EMPTY'}
      </h3>

      <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto mb-6">
        {isFiltering
          ? 'No active missions found matching the current telemetry parameters. Adjust status or priority filters.'
          : 'All tactical sectors cleared. Initialize a new mission deployment to maintain operational momentum.'}
      </p>

      <Button variant="primary" onClick={onAction}>
        {isFiltering ? (
          <>
            <RefreshCw className="w-4 h-4" />
            RESET TELEMETRY
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            DEPLOY NEW MISSION
          </>
        )}
      </Button>
    </Card>
  );
};
