
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="brushed-metal border-b border-slate-500/50 p-4 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="text-red-600 font-bold text-3xl orbitron tracking-wider">CROSS</span>
            <span className="text-white font-bold text-3xl orbitron tracking-wider">BOND</span>
          </div>
          <span className="text-slate-400 text-xs font-semibold tracking-widest mt-1">
            METRO DECORATIVE PVT. LTD.
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.8)]'}`}></span>
          <span className="text-xs text-slate-400 font-medium">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
