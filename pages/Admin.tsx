
import React, { useState, useEffect, useRef } from 'react';
import { Employee, DailyShifts, AdminPageType, NotificationConfig, LeaveRequest } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import DailyRoster from '../components/admin/DailyRoster';
import SystemNotification from '../components/admin/SystemNotification';
import LeaveManagement from '../components/admin/LeaveManagement';
import LeaveRequestsAdmin from '../components/admin/LeaveRequestsAdmin';

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
  // Smartly select the default view: if pending requests exist, show them first.
  const getInitialView = () => {
    const hasPending = props.leaveRequests.some(r => r.status === 'pending');
    return hasPending ? AdminPageType.Requests : AdminPageType.Notification;
  };

  const [activeView, setActiveView] = useState<AdminPageType>(getInitialView());
  const [showPopup, setShowPopup] = useState(false);
  const prevRequestCount = useRef(props.leaveRequests.length);

  // This effect handles the popup notification within the admin page itself
  useEffect(() => {
    const pendingCount = props.leaveRequests.filter(r => r.status === 'pending').length;
    if (pendingCount > prevRequestCount.current) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
    prevRequestCount.current = pendingCount;
  }, [props.leaveRequests]);

  const adminTabs = [
    AdminPageType.Schedule, 
    AdminPageType.Roster, 
    AdminPageType.Notification, 
    AdminPageType.Leave,
    AdminPageType.Requests
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
        return <MasterSchedule employees={props.employees} rosterMonth={props.rosterMonth} rosterYear={props.rosterYear} />;
    }
  };

  const pendingCount = props.leaveRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 py-4 animate-fadeIn relative">
      {/* Local popup for when admin is already on the page */}
      {showPopup && (
        <div className="fixed top-20 right-6 z-[100] animate-bounce">
          <div 
            onClick={() => { setActiveView(AdminPageType.Requests); setShowPopup(false); }}
            className="bg-yellow-500 text-black p-4 rounded-xl shadow-2xl border-2 border-white flex items-center gap-3 cursor-pointer hover:bg-yellow-400 transition-all"
          >
            <div className="bg-black text-yellow-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">!</div>
            <div>
              <p className="font-bold orbitron text-xs">NEW LEAVE REQUEST!</p>
              <p className="text-[10px] font-bold">A team member is waiting for approval.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black orbitron text-slate-100 tracking-tighter uppercase">Admin Console</h1>
        <button onClick={props.onLogout} className="bg-red-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase orbitron hover:bg-red-700 shadow-lg border-2 border-red-400">
          LOCK SYSTEM
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation */}
        <aside className="lg:w-1/4">
          <div className="brushed-metal p-4 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-sm font-bold orbitron text-slate-400 border-b border-slate-700 pb-3 mb-3 uppercase tracking-widest">Modules</h2>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {adminTabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`whitespace-nowrap w-full text-left p-3 rounded-md text-[10px] font-black transition-all duration-200 orbitron uppercase relative ${
                    activeView === tab 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {tab}
                  {tab === AdminPageType.Requests && pendingCount > 0 && (
                     <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
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
