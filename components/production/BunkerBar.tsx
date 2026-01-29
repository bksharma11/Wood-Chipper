
import React from 'react';

interface BunkerBarProps {
  label: string;
  percentage: number;
}

const BunkerBar: React.FC<BunkerBarProps> = ({ label, percentage }) => {
  let colorClass = 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600';
  let fluidColor = 'bg-yellow-500';

  if (percentage > 70) {
    colorClass = 'bg-gradient-to-r from-green-600 via-green-400 to-green-600';
    fluidColor = 'bg-green-500';
  } else if (percentage < 30) {
    colorClass = 'bg-gradient-to-r from-red-600 via-red-400 to-red-600';
    fluidColor = 'bg-red-500';
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between w-full text-xs orbitron font-bold">
        <span className="text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-white">{percentage}%</span>
      </div>

      {/* 3D Cylinder Container */}
      <div className="relative w-16 h-40 bg-slate-800/50 rounded-full border border-slate-700 shadow-2xl overflow-hidden perspective-500 group">
        {/* Glass Glare */}
        <div className="absolute inset-y-0 left-1/4 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none"></div>

        {/* Liquid Level */}
        <div
          className={`absolute bottom-0 w-full transition-all duration-1000 ease-in-out ${colorClass} shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)]`}
          style={{ height: `${percentage}%` }}
        >
          {/* Liquid Top Surface (Meniscus effect) */}
          <div className={`absolute top-0 w-full h-4 -mt-2 rounded-[100%] ${fluidColor} opacity-50 blur-[1px]`}></div>

          {/* Bubbles Animation */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30">
            <div className="bubble w-2 h-2 bg-white rounded-full absolute bottom-0 left-[20%] animate-rise delay-100"></div>
            <div className="bubble w-1 h-1 bg-white rounded-full absolute bottom-0 left-[50%] animate-rise delay-300"></div>
            <div className="bubble w-3 h-3 bg-white rounded-full absolute bottom-0 left-[70%] animate-rise delay-700"></div>
          </div>
        </div>

        {/* Tick Marks */}
        <div className="absolute right-0 inset-y-0 w-full flex flex-col justify-between py-4 px-2 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full border-t border-slate-500/30 text-[8px] text-right pr-1 text-slate-500/50"></div>
          ))}
        </div>
      </div>

      <style>{`
         @keyframes rise {
            0% { transform: translateY(100%) scale(1); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
         }
         .animate-rise {
            animation: rise 4s infinite ease-in;
         }
      `}</style>
    </div>
  );
};

export default BunkerBar;
