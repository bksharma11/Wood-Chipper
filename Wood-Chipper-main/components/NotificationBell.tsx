
import React from 'react';
import { Page } from '../types';

interface NotificationBellProps {
  isAdmin: boolean;
  pendingRequestCount: number;
  setCurrentPage: (page: Page) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ isAdmin, pendingRequestCount, setCurrentPage }) => {
  if (!isAdmin) {
    return null;
  }

  const hasPending = pendingRequestCount > 0;

  const handleNavigate = () => {
    setCurrentPage(Page.Admin);
  };

  return (
    <button
      onClick={handleNavigate}
      title={hasPending ? `${pendingRequestCount} pending requests` : "Admin Console"}
      className="relative w-12 h-12 flex items-center justify-center bg-[rgba(30,41,59,0.4)] border border-[rgba(6,182,212,0.3)] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.1)] backdrop-blur-lg cursor-pointer transition-all hover:border-[rgba(6,182,212,0.7)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
    >
      {/* Bell Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>

      {/* Red Dot Badge with Breathe Animation */}
      {hasPending && (
        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#162137] animate-breathe"></span>
      )}
    </button>
  );
};

export default NotificationBell;
