
import React, { useState } from 'react';
import { Employee, DailyShifts, NotificationConfig } from '../types';
import ShiftCard from '../components/schedule/ShiftCard';
import LeaveCheck from '../components/schedule/LeaveCheck';
import LeaveRequestSystem from '../components/LeaveRequestSystem';
import NeonCard from '../components/NeonCard';

interface ScheduleProps {
  employees: Employee[];
  notifications: NotificationConfig[];
  rosterMonth: number;
  rosterYear: number;
  dailyShiftHistory: DailyShifts;
}

const SchedulePage: React.FC<ScheduleProps> = ({ employees, notifications, rosterMonth, rosterYear, dailyShiftHistory }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const scheduleKey = `${rosterYear}-${rosterMonth}`;
  
  const activeShifts = dailyShiftHistory?.[selectedDate];
  const isDatePublished = !!activeShifts;

  const renderRosterRows = (startIndex: number, count: number) => {
    return (employees || []).slice(startIndex, startIndex + count).map((emp, idx) => {
      const schedule = emp.schedules?.[scheduleKey] || Array(31).fill('-');
      return (
        <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-cyan-500/5 transition-colors">
          <td className="p-2 border border-slate-800 text-center font-bold text-slate-500">{startIndex + idx + 1}</td>
          <td className="p-2 border border-slate-800 font-bold text-slate-200 whitespace-nowrap min-w-[180px]">{emp.name}</td>
          <td className="p-2 border border-slate-800 font-mono text-xs text-slate-500">{emp.id}</td>
          {dayArray.map((day) => {
            const shift = schedule[day - 1] || '-';
            const isRest = shift === 'R';
            return (
              <td key={day} className={`p-1 border border-slate-800 text-center text-xs font-black min-w-[32px] ${isRest ? 'bg-red-700 text-white shadow-inner' : 'text-slate-400'}`}>
                {shift}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Daily Shift Section */}
      <NeonCard>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-3 border-b-2 border-slate-700/50">
          <h2 className="text-2xl font-black orbitron text-slate-100 tracking-widest uppercase">Daily Deployment</h2>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 orbitron font-bold text-xs" />
        </div>
        
        {!isDatePublished ? (
          <div className="p-10 text-center border border-dashed border-slate-800 rounded-xl bg-black/20">
             <p className="orbitron text-slate-600 text-xs uppercase font-bold tracking-widest">Awaiting Daily Assignment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ShiftCard label="A" data={activeShifts.A} />
            <ShiftCard label="B" data={activeShifts.B} />
            <ShiftCard label="C" data={activeShifts.C} />
            <ShiftCard label="General" data={activeShifts.General} />
          </div>
        )}
      </NeonCard>

      {/* Leave & C-Off Status Viewer */}
      <LeaveCheck employees={employees} />

      {/* Leave Request Form */}
      <LeaveRequestSystem employees={employees} />

      {/* Notification Banners */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-cyan-900/30 border-y border-cyan-700/30 p-2 overflow-hidden whitespace-nowrap shadow-lg">
            <div 
              className="animate-marquee inline-block text-cyan-200 uppercase tracking-widest font-bold"
              style={{ animationDuration: `${notification.duration}s`, animationDelay: `${notification.pause}s` }}
            >
              <span className={`${notification.font} ${notification.size}`}>{notification.text} • {notification.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Master Shift Table */}
      <NeonCard>
        <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 text-center mb-4 rounded-t-lg -m-6">
          <h2 className="text-xl font-black orbitron tracking-[0.3em] text-slate-100 uppercase">
            Master Roster: {months[rosterMonth]} {rosterYear}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-300 font-bold uppercase tracking-tighter">
                <th className="p-2 border border-slate-700/50">S.N</th>
                <th className="p-2 border border-slate-700/50 text-left">Emp. Name</th>
                <th className="p-2 border border-slate-700/50">Emp. ID</th>
                {dayArray.map(d => <th key={d} className="p-1 border border-slate-700/50 min-w-[32px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {renderRosterRows(0, employees.length)}
            </tbody>
          </table>
        </div>
      </NeonCard>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;
