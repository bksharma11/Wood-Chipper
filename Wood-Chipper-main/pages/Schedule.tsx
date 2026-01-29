import React from 'react';
import { Employee } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import GlassCard from '../components/ui/GlassCard';

interface ScheduleProps {
  employees: Employee[];
  rosterMonth: number;
  rosterYear: number;
  isAdmin: boolean;
}

const SchedulePage: React.FC<ScheduleProps> = ({ employees, rosterMonth, rosterYear, isAdmin }) => {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const scheduleKey = `${rosterYear}-${rosterMonth}`;

  const renderRosterRows = (startIndex: number, count: number) => {
    return (employees || []).slice(startIndex, startIndex + count).map((emp, idx) => {
      const schedule = emp.schedules?.[scheduleKey] || Array(31).fill('-');
      return (
        <tr key={emp.id} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
          <td className="p-2 border border-slate-700/30 text-center font-bold text-slate-500">{startIndex + idx + 1}</td>
          <td className="p-2 border border-slate-700/30 font-bold text-slate-200 whitespace-nowrap min-w-[180px]">{emp.name}</td>
          <td className="p-2 border border-slate-700/30 font-mono text-xs text-slate-500">{emp.id}</td>
          {dayArray.map((day) => {
            const shift = schedule[day - 1] || '-';
            const isRest = shift === 'R';
            return (
              <td key={day} className={`p-1 border border-slate-700/30 text-center text-xs font-black min-w-[32px] ${isRest ? 'bg-red-900/40 text-red-200 shadow-inner' : 'text-slate-400'}`}>
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

      {/* Admin Editor (Only visible if Admin) */}
      {isAdmin && (
        <MasterSchedule
          employees={employees}
          rosterMonth={rosterMonth}
          rosterYear={rosterYear}
        />
      )}

      {/* Public Read-Only Master Table */}
      {!isAdmin && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
            <h2 className="text-xl font-black orbitron tracking-[0.3em] text-white uppercase flex items-center">
              <span className="mr-3 text-cyan-400">#</span>
              Master Roster
            </h2>
            <span className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded text-cyan-300 text-xs font-bold orbitron">
              {months[rosterMonth]} {rosterYear}
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3 border border-slate-700/50 text-center">S.N</th>
                  <th className="p-3 border border-slate-700/50 text-left">Worker Name</th>
                  <th className="p-3 border border-slate-700/50 text-left">ID</th>
                  {dayArray.map(d => <th key={d} className="p-2 border border-slate-700/50 min-w-[32px] text-center">{d}</th>)}
                </tr>
              </thead>
              <tbody className="bg-slate-900/20">
                {renderRosterRows(0, employees.length)}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default SchedulePage;
