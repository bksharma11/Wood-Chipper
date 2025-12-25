
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  isAdmin: boolean;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, setCurrentPage, handleLogout }) => {
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
          {isAdmin ? (
            <>
              <button 
                onClick={() => setCurrentPage(Page.Admin)}
                className="bg-slate-700/50 text-slate-300 border border-slate-600 px-3 py-1 rounded text-xs font-bold uppercase orbitron hover:bg-slate-700"
              >
                Admin Console
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-900/40 text-red-400 border border-red-700/50 px-3 py-1 rounded text-xs font-bold uppercase orbitron hover:bg-red-900/60"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setCurrentPage(Page.Login)}
              className="silver-gradient text-slate-900 px-4 py-1.5 rounded text-xs font-bold uppercase orbitron shadow-md hover:brightness-110"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
