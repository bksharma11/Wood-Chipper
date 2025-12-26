
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
    { page: Page.Schedule, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h27" /> },
    { page: Page.Production, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /> },
    { page: Page.Labour, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.305c.395-.44-.094-1.141-.872-1.141h-1.723a1.125 1.125 0 01-1.125-1.125v-1.723c0-.813.693-1.488 1.488-1.488A5.25 5.25 0 0118 8.25c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75c0-4.5-3.694-8.25-8.25-8.25S3 3.75 3 8.25c0 4.556 3.694 8.25 8.25 8.25a9.06 9.06 0 003.75-.834" /> },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = currentPage === item.page;
    return (
      <button
        onClick={() => setCurrentPage(item.page)}
        className={`relative w-full flex items-center space-x-4 px-4 py-3 rounded-lg group transition-colors duration-200 ${isActive ? 'bg-cyan-500/10' : 'hover:bg-cyan-500/5'}`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_theme(colors.cyan.400)]"></div>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 stroke-2 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {item.icon}
        </svg>
        <span className={`font-bold orbitron text-sm ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {item.page}
        </span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#0a101f]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col p-4 border-r border-[rgba(6,182,212,0.3)] bg-[rgba(30,41,59,0.2)] backdrop-blur-lg">
        <div className="flex items-center space-x-2 p-2 mb-6">
          <span className="text-red-600 font-black text-2xl orbitron">CROSS</span>
          <span className="text-white font-black text-2xl orbitron">BOND</span>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map(item => <NavLink key={item.page} item={item} />)}
        </nav>
        <div className="mt-auto">
          {isAdmin ? (
            <button
              onClick={() => setCurrentPage(Page.Admin)}
              className="relative w-full flex items-center space-x-4 px-4 py-3 rounded-lg group transition-colors duration-200 hover:bg-cyan-500/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 group-hover:text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              <span className="font-bold orbitron text-sm text-slate-400 group-hover:text-slate-200">Admin Console</span>
            </button>
          ) : null}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-20 flex items-center justify-between px-8 border-b border-[rgba(6,182,212,0.3)] bg-[rgba(30,41,59,0.2)] backdrop-blur-lg">
          <div>
            <h1 className="text-2xl font-black orbitron text-slate-200 tracking-widest uppercase">{currentPage}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell isAdmin={isAdmin} pendingRequestCount={pendingRequestCount} setCurrentPage={setCurrentPage} />
            {isAdmin ? (
              <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold orbitron uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 transition-colors">Logout</button>
            ) : (
              <button onClick={() => setCurrentPage(Page.Login)} className="px-4 py-2 text-xs font-bold orbitron uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/40 transition-colors">Admin Login</button>
            )}
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
