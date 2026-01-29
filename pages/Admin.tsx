
import React, { useState, useEffect, useRef } from 'react';
import { Employee, DailyShifts, AdminPageType, NotificationConfig, LeaveRequest } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import DailyRoster from '../components/admin/DailyRoster';
import SystemNotification from '../components/admin/SystemNotification';
import LeaveManagement from '../components/admin/LeaveManagement';
import LeaveRequestsAdmin from '../components/admin/LeaveRequestsAdmin';
import NeonCard from '../components/NeonCard';

interface AdminPageProps {
  employees: Employee[];
  dailyShiftHistory: DailyShifts;
  notifications: NotificationConfig[];
  leaveRequests: LeaveRequest[];
  rosterMonth: number;
  rosterYear: number;
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const getInitialView = () => {
    const hasPending = props.leaveRequests.some(r => r.status === 'pending');
    return hasPending ? AdminPageType.Requests : AdminPageType.Notification;
  };

  const [activeView, setActiveView] = useState<AdminPageType>(getInitialView());
  
  const adminTabs = [
    AdminPageType.Requests,
    AdminPageType.Schedule, 
    AdminPageType.Roster, 
    AdminPageType.Notification, 
    AdminPageType.Leave
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case AdminPageType.Schedule:
        return <MasterSchedule employees={props.employees} rosterMonth={props.rosterMonth} rosterYear={props.rosterYear} />;
      case AdminPageType.Roster:
        return <DailyRoster employees={props.employees} dailyShiftHistory={props.dailyShiftHistory} />;
      case AdminPageType.Notification:
        return <SystemNotification notifications={props.notifications} />;
      case AdminPageType.Leave:
        return <LeaveManagement employees={props.employees} />;
      case AdminPageType.Requests:
        return <LeaveRequestsAdmin requests={props.leaveRequests} employees={props.employees} />;
      default:
        return <LeaveRequestsAdmin requests={props.leaveRequests} employees={props.employees} />;
    }
  };

  const pendingCount = props.leaveRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation */}
        <aside className="lg:w-1/4">
          <NeonCard className="p-4">
            <h2 className="text-sm font-bold orbitron text-slate-400 border-b border-slate-700 pb-3 mb-3 uppercase tracking-widest">Modules</h2>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {adminTabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`whitespace-nowrap w-full text-left p-3 rounded-md text-xs font-black transition-all duration-200 orbitron uppercase relative ${
                    activeView === tab 
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-md' 
                      : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  {tab}
                  {tab === AdminPageType.Requests && pendingCount > 0 && (
                     <span className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </NeonCard>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
