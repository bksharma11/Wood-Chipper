
import React from 'react';
import { Page } from '../types';

interface GlobalAdminNotifierProps {
  isAdmin: boolean;
  pendingRequestCount: number;
  setCurrentPage: (page: Page) => void;
}

const GlobalAdminNotifier: React.FC<GlobalAdminNotifierProps> = ({ isAdmin, pendingRequestCount, setCurrentPage }) => {
  // Only render the component if the user is an admin and there are pending requests.
  if (!isAdmin || pendingRequestCount === 0) {
    return null;
  }

  const handleNavigate = () => {
    setCurrentPage(Page.Admin);
  };

  const notifierStyle: React.CSSProperties = {
    position: 'fixed',
    top: '90px', // Positioned below the main header
    right: '20px',
    zIndex: 9999,
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(30, 41, 59, 0.7)', // Dark Glassmorphism
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    animation: 'pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '20px',
    height: '20px',
    background: '#ef4444', // Red-500
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    border: '2px solid rgba(30, 41, 59, 0.7)',
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>
      <div style={notifierStyle} onClick={handleNavigate} title={`${pendingRequestCount} pending requests`}>
        {/* Bell SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Notification Badge */}
        <span style={badgeStyle}>
          {pendingRequestCount}
        </span>
      </div>
    </>
  );
};

export default GlobalAdminNotifier;
