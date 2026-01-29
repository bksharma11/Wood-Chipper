
import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
}

const NeonCard: React.FC<NeonCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-[rgba(30,41,59,0.4)] border border-[rgba(6,182,212,0.3)] rounded-2xl shadow-[0_0_10px_rgba(6,182,212,0.1)] backdrop-blur-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default NeonCard;
