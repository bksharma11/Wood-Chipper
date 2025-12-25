
import React, { useState } from 'react';
import { Employee, DailyShifts, NotificationConfig } from '../types';
import ShiftCard from '../components/schedule/ShiftCard';

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
        <tr key={emp.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
          <td className="p-2 border border-slate-700 text-center font-bold text-slate-400">{startIndex + idx + 1}</td>
          <td className="p-2 border border-slate-700 font-bold text-slate-100 whitespace-nowrap min-w-[180px]">{emp.name}</td>
          <td className="p-2 border border-slate-700 font-mono text-xs text-slate-400">{emp.id}</td>
          {dayArray.map((day) => {
            const shift = schedule[day - 1] || '-';
            const isRest = shift === 'R';
            return (
              <td key={day} className={`p-1 border border-slate-700 text-center text-xs font-black min-w-[32px] ${isRest ? 'bg-red-600 text-white shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]' : 'text-slate-300'}`}>
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
      {/* Daily Shift Section - Hides if not published in Admin */}
      <section className="brushed-metal p-6 rounded-2xl border border-slate-600/50 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-3 border-b-4 border-slate-500/50">
          <h2 className="text-2xl font-black orbitron text-white tracking-widest">DAILY SHIFT SCHEDULE</h2>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white orbitron font-bold text-xs" />
        </div>
        
        {!isDatePublished ? (
          <div className="p-10 text-center border border-dashed border-slate-700 rounded-xl bg-black/20">
             <p className="orbitron text-slate-600 text-xs uppercase font-bold">Schedule Not Published for this Date</p>
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

      {/* Notification Banners */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-red-700/80 border-y border-red-500 p-2 overflow-hidden whitespace-nowrap shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <div 
              className="animate-marquee inline-block text-white uppercase tracking-widest font-bold"
              style={{ animationDuration: `${notification.duration}s`, animationDelay: `${notification.pause}s` }}
            >
              <span className={`${notification.font} ${notification.size}`}>{notification.text} • {notification.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Master Shift Table with Original Gaps */}
      <section className="brushed-metal p-1 rounded-xl border border-slate-600/50 shadow-2xl overflow-hidden">
        <div className="bg-slate-900/80 p-4 border-b border-slate-700 text-center">
          <h2 className="text-xl font-black orbitron tracking-[0.3em] text-white uppercase">
            Chipper Shift Schedule: {months[rosterMonth]} {rosterYear}
          </h2>
        </div>
        <div className="overflow-x-auto roster-scrollbar">
          <table className="w-full text-xs border-collapse bg-black/30">
            <thead>
              <tr className="bg-slate-800 text-white font-bold">
                <th className="p-2 border border-slate-700">S.N</th>
                <th className="p-2 border border-slate-700 text-left">Emp. Name</th>
                <th className="p-2 border border-slate-700">Emp. ID</th>
                {dayArray.map(d => <th key={d} className="p-1 border border-slate-700 min-w-[32px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {renderRosterRows(0, 7)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterRows(7, 2)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterRows(9, 4)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterRows(13, 1)}
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
        .roster-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default SchedulePage;
