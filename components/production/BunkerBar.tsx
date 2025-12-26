
import React from 'react';

interface BunkerBarProps {
  label: string;
  percentage: number;
}

const BunkerBar: React.FC<BunkerBarProps> = ({ label, percentage }) => {
  let color = 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]';
  if (percentage >= 50) color = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
  else if (percentage >= 30) color = 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs orbitron">
        <span className="text-slate-400">{label} Status</span>
        <span className="text-white">{percentage}%</span>
      </div>
      <div className="h-4 w-full bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BunkerBar;
