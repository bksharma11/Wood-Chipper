
import React, { useState } from 'react';
import { Employee, DailyShifts, AdminPageType, NotificationConfig } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import DailyRoster from '../components/admin/DailyRoster';
import SystemNotification from '../components/admin/SystemNotification';
import LeaveManagement from '../components/admin/LeaveManagement';

interface AdminPageProps {
  employees: Employee[];
  dailyShiftHistory: DailyShifts;
  notifications: NotificationConfig[];
  rosterMonth: number;
  rosterYear: number;
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const [activeView, setActiveView] = useState<AdminPageType>(AdminPageType.Notification);

  const adminTabs = [
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
      default:
        return <MasterSchedule employees={props.employees} rosterMonth={props.rosterMonth} rosterYear={props.rosterYear} />;
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black orbitron silver-gradient bg-clip-text text-transparent">ADMIN CONSOLE</h1>
        <button onClick={props.onLogout} className="bg-red-900/40 text-red-400 border border-red-700/50 px-4 py-1 rounded text-xs font-bold uppercase orbitron hover:bg-red-800/60">
          LOCK SYSTEM
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation */}
        <aside className="lg:w-1/4">
          <div className="brushed-metal p-4 rounded-xl border border-slate-600/50 shadow-lg">
            <h2 className="text-sm font-bold orbitron text-slate-400 border-b border-slate-700 pb-3 mb-3 uppercase">Console Sections</h2>
            <nav className="flex flex-row lg:flex-col gap-2">
              {adminTabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`w-full text-left p-3 rounded-md text-xs font-bold transition-all duration-200 ${
                    activeView === tab 
                      ? 'bg-blue-600/80 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {tab}
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
