import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-5 w-full' }) => {
  return (
    <div
      className={`bg-[#121221] border border-[#1e1e38] animate-pulse cyber-clip-sm ${className}`}
    />
  );
};
