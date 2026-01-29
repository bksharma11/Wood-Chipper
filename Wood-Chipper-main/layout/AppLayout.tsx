

import React from 'react';
import { Page } from '../types';
import NotificationBell from '../components/NotificationBell';

interface AppLayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
  pendingRequestCount: number;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, isAdmin, pendingRequestCount, currentPage, setCurrentPage, handleLogout }) => {
  const navItems = [
    { page: Page.Dashboard, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
    { page: Page.Schedule, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h27" /> },
    { page: Page.Production, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /> },
    { page: Page.Labour, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.305c.395-.44-.094-1.141-.872-1.141h-1.723a1.125 1.125 0 01-1.125-1.125v-1.723c0-.813.693-1.488 1.488-1.488A5.25 5.25 0 0118 8.25c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75c0-4.5-3.694-8.25-8.25-8.25S3 3.75 3 8.25c0 4.556 3.694 8.25 8.25 8.25a9.06 9.06 0 003.75-.834" /> },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = currentPage === item.page;
    return (
      <button
        onClick={() => setCurrentPage(item.page)}
        className={`relative flex items-center space-x-2 px-4 py-2 rounded-full group transition-all duration-300 ${isActive
          ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/50'
          : 'hover:bg-cyan-500/5 text-slate-400 hover:text-slate-200'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 stroke-2 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {item.icon}
        </svg>
        <span className="font-bold orbitron text-xs tracking-wider">
          {item.page}
        </span>
        {isActive && (
          <div className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-cyan-400/50 blur-sm"></div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a101f] overflow-hidden">
      {/* Top Header Navigation */}
      <header className="flex-shrink-0 h-20 flex items-center justify-between px-8 border-b border-[rgba(6,182,212,0.3)] bg-[rgba(30,41,59,0.4)] backdrop-blur-md z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 w-64">
          <div className="flex flex-col leading-none">
            <span className="text-red-500 font-black text-lg orbitron tracking-widest">CROSS</span>
            <span className="text-white font-black text-lg orbitron tracking-widest">BOND</span>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
          {navItems.map(item => <NavLink key={item.page} item={item} />)}
          {isAdmin && (
            <div className="pl-4 ml-4 border-l border-slate-700 flex items-center">
              <button
                onClick={() => setCurrentPage(Page.Admin)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-full group transition-all duration-300 ${currentPage === Page.Admin ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/50' : 'hover:bg-cyan-500/5 text-slate-400 hover:text-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="font-bold orbitron text-xs tracking-wider">Admin</span>
              </button>
            </div>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 w-64 justify-end">
          <NotificationBell isAdmin={isAdmin} pendingRequestCount={pendingRequestCount} setCurrentPage={setCurrentPage} />

          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold orbitron uppercase bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/20 hover:border-red-500/50 transition-all duration-200"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage(Page.Login)}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold orbitron uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
            >
              <span>Admin</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        <div className="max-w-[1920px] mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
