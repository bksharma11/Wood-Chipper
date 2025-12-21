
import React from 'react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const tabs = [Page.Schedule, Page.Production, Page.Labour, Page.Admin];

  return (
    <nav className="p-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex space-x-2 sm:space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentPage(tab)}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg transition-all duration-300 font-bold orbitron text-sm border-2 ${
              currentPage === tab
                ? 'silver-gradient text-slate-900 border-white scale-105 z-10'
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            {tab === Page.Admin ? 'Admin Console' : tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
