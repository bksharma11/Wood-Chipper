
import React, { useState } from 'react';
import { Employee, DailyShifts, NotificationConfig } from '../types';
import ShiftCard from '../components/schedule/ShiftCard';
import LeaveCheck from '../components/schedule/LeaveCheck';
import LeaveRequestSystem from '../components/LeaveRequestSystem';

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
        <tr key={emp.id} className="border-b border-slate-300 hover:bg-white/40 transition-colors">
          <td className="p-2 border border-slate-300 text-center font-bold text-slate-500">{startIndex + idx + 1}</td>
          <td className="p-2 border border-slate-300 font-bold text-slate-800 whitespace-nowrap min-w-[180px]">{emp.name}</td>
          <td className="p-2 border border-slate-300 font-mono text-xs text-slate-500">{emp.id}</td>
          {dayArray.map((day) => {
            const shift = schedule[day - 1] || '-';
            const isRest = shift === 'R';
            return (
              <td key={day} className={`p-1 border border-slate-300 text-center text-xs font-black min-w-[32px] ${isRest ? 'bg-red-500 text-white' : 'text-slate-700'}`}>
                {shift}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Daily Shift Section */}
      <section className="brushed-metal p-6 rounded-2xl border border-slate-300 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-3 border-b-2 border-slate-300">
          <h2 className="text-2xl font-black orbitron text-slate-800 tracking-widest uppercase">Daily Deployment</h2>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 orbitron font-bold text-xs" />
        </div>
        
        {!isDatePublished ? (
          <div className="p-10 text-center border border-dashed border-slate-300 rounded-xl bg-white/30">
             <p className="orbitron text-slate-400 text-xs uppercase font-bold tracking-widest">Awaiting Management Publication</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ShiftCard label="A" data={activeShifts.A} />
            <ShiftCard label="B" data={activeShifts.B} />
            <ShiftCard label="C" data={activeShifts.C} />
            <ShiftCard label="General" data={activeShifts.General} />
          </div>
        )}
      </section>

      {/* Leave & C-Off Status Viewer */}
      <LeaveCheck employees={employees} />

      {/* Leave Request Form (New) */}
      <LeaveRequestSystem employees={employees} />

      {/* Notification Banners */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-blue-600 border-y border-blue-400 p-2 overflow-hidden whitespace-nowrap shadow-lg">
            <div 
              className="animate-marquee inline-block text-white uppercase tracking-widest font-bold"
              style={{ animationDuration: `${notification.duration}s`, animationDelay: `${notification.pause}s` }}
            >
              <span className={`${notification.font} ${notification.size}`}>{notification.text} • {notification.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Master Shift Table */}
      <section className="brushed-metal p-1 rounded-xl border border-slate-300 shadow-xl overflow-hidden">
        <div className="bg-slate-100 p-4 border-b border-slate-300 text-center">
          <h2 className="text-xl font-black orbitron tracking-[0.3em] text-slate-800 uppercase">
            Master Roster: {months[rosterMonth]} {rosterYear}
          </h2>
        </div>
        <div className="overflow-x-auto roster-scrollbar bg-white/50">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-bold">
                <th className="p-2 border border-slate-300">S.N</th>
                <th className="p-2 border border-slate-300 text-left">Emp. Name</th>
                <th className="p-2 border border-slate-300">Emp. ID</th>
                {dayArray.map(d => <th key={d} className="p-1 border border-slate-300 min-w-[32px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {renderRosterRows(0, employees.length)}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .roster-scrollbar::-webkit-scrollbar { height: 8px; }
        .roster-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default SchedulePage;
