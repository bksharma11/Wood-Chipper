
import React, { useState } from 'react';
import { Shifts, Employee } from '../types';
import { NotificationConfig } from '../App';

interface ScheduleProps {
  shifts: Shifts;
  employees: Employee[];
  notification: NotificationConfig;
  rosterMonth: number;
  rosterYear: number;
}

const SchedulePage: React.FC<ScheduleProps> = ({ shifts, employees, notification, rosterMonth, rosterYear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Logic for week days (simplified for 2026 start pattern)
  const weekDays = ["THU", "FRI", "SAT", "SUN", "MON", "TUE", "WED"];
  const getDayLabel = (day: number) => {
    // This is a relative calculation for visual consistency
    return weekDays[(day - 1) % 7];
  };

  const selectedEmployee = employees.find(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ShiftCard = ({ label, data }: { label: string, data: typeof shifts.A }) => {
    const labels = label === 'General' 
      ? { s: 'Supervisor', c1: 'Incharge', c2: 'Operator' }
      : { s: 'Supervisor', c1: 'Chipper 1 Operator', c2: 'Chipper 2 Operator' };

    return (
      <div className="brushed-metal border border-slate-500/50 rounded-xl p-6 shadow-2xl relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 orbitron uppercase font-bold tracking-tighter">SHFT_{label}</div>
        <h3 className="text-xl font-bold mb-4 text-slate-200 orbitron border-b border-slate-700 pb-2">Shift {label}</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{labels.s}</p>
            <p className="font-bold text-lg text-slate-100">{data.supervisor || 'None'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{labels.c1}</p>
            <p className="text-slate-300 text-sm">{data.chipper1 || 'None'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{labels.c2}</p>
            <p className="text-slate-300 text-sm">{data.chipper2 || 'None'}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    );
  };

  const renderRosterGroup = (startIndex: number, endIndex: number) => {
    return employees.slice(startIndex, endIndex).map((emp, idx) => (
      <tr key={emp.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors group">
        <td className="p-2 border border-slate-700 text-center font-bold text-slate-400">{startIndex + idx + 1}</td>
        <td className="p-2 border border-slate-700 font-bold text-slate-100 whitespace-nowrap min-w-[180px]">{emp.name}</td>
        <td className="p-2 border border-slate-700 font-mono text-xs text-slate-400">{emp.id}</td>
        <td className="p-2 border border-slate-700 text-center text-[10px] font-bold text-slate-500">
           {emp.schedule?.includes('R') ? getDayLabel(emp.schedule.indexOf('R') + 1) : '-'}
        </td>
        {dayArray.map((day) => {
          const shift = emp.schedule?.[day - 1] || '-';
          const isRest = shift === 'R';
          return (
            <td 
              key={day} 
              className={`p-1 border border-slate-700 text-center text-xs font-black min-w-[32px] ${
                isRest ? 'bg-red-600 text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' : 'text-slate-300'
              }`}
            >
              {shift}
            </td>
          );
        })}
        <td className="p-2 border border-slate-700 text-xs font-bold text-slate-200 tracking-tighter whitespace-nowrap">{emp.phone}</td>
      </tr>
    ));
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ShiftCard label="A" data={shifts.A} />
        <ShiftCard label="B" data={shifts.B} />
        <ShiftCard label="C" data={shifts.C} />
        <ShiftCard label="General" data={shifts.General} />
      </div>

      <div className="bg-red-700/80 border-y border-red-500 p-2 overflow-hidden whitespace-nowrap shadow-[0_0_20px_rgba(239,68,68,0.4)] relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-700 to-transparent z-10"></div>
        <div className="animate-marquee inline-block text-white uppercase tracking-widest">
          <span className={`${notification.font} ${notification.size}`}>
            {notification.text} • {notification.text} • {notification.text}
          </span>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-700 to-transparent z-10"></div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(5%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .roster-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .roster-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .roster-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
          border: 2px solid #1a1a1a;
        }
      `}</style>

      <section className="brushed-metal p-1 rounded-xl border border-slate-600/50 shadow-2xl overflow-hidden">
        <div className="bg-slate-900/80 p-4 border-b border-slate-700 text-center">
          <h2 className="text-xl font-black orbitron tracking-[0.3em] text-white">
            CHIPPER SHIFT SCHEDULE : -- {months[rosterMonth]} - {rosterYear}
          </h2>
        </div>
        
        <div className="overflow-x-auto roster-scrollbar">
          <table className="w-full text-xs border-collapse bg-black/30">
            <thead>
              <tr className="bg-slate-800/80 text-white font-bold">
                <th rowSpan={2} className="p-2 border border-slate-700 min-w-[40px]">S.N</th>
                <th rowSpan={2} className="p-2 border border-slate-700 text-left min-w-[180px]">Emp. Name</th>
                <th rowSpan={2} className="p-2 border border-slate-700 min-w-[100px]">Emp. ID</th>
                <th className="p-1 border border-slate-700 text-[9px] uppercase">Date</th>
                {dayArray.map(d => (
                  <th key={d} className="p-1 border border-slate-700 min-w-[32px] text-[10px]">{d}</th>
                ))}
                <th rowSpan={2} className="p-2 border border-slate-700 min-w-[120px]">Phone No</th>
              </tr>
              <tr className="bg-slate-800/40 text-slate-400 font-bold">
                <th className="p-1 border border-slate-700 text-[8px] uppercase tracking-tighter">Rest</th>
                {dayArray.map(d => (
                  <th key={d} className="p-1 border border-slate-700 text-[8px]">{getDayLabel(d)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRosterGroup(0, 7)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterGroup(7, 9)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterGroup(9, 13)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterGroup(13, 14)}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-900/80 p-2 border-t border-slate-700 text-center">
          <p className="text-white font-black orbitron text-sm tracking-[0.2em] animate-pulse">
            NOBODY CHANGE SHIFT AND REST WITHOUT PERMISSION
          </p>
        </div>
      </section>

      <section className="brushed-metal p-6 rounded-xl border border-slate-600/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold orbitron text-slate-200">Employee Quick-Look</h2>
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Enter Name or MDUK ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono text-sm"
            />
          </div>
        </div>

        {searchQuery && selectedEmployee ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-1 space-y-4">
               <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-xl">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Employee Detail</p>
                  <h3 className="text-2xl font-black text-white">{selectedEmployee.name}</h3>
                  <p className="text-blue-400 font-mono">{selectedEmployee.id}</p>
                  <p className="text-slate-400 mt-2">📞 {selectedEmployee.phone}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Leaves</p>
                    <p className="text-2xl font-black text-red-500">{selectedEmployee.totalLeaves}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">C-Off</p>
                    <p className="text-2xl font-black text-green-500">{selectedEmployee.cOffBalance}</p>
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-2 bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                <h4 className="text-sm font-bold orbitron text-slate-300">Transaction History</h4>
              </div>
              <div className="max-h-[250px] overflow-y-auto roster-scrollbar">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-900 text-[10px] uppercase text-slate-500 font-bold">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {selectedEmployee.history.length > 0 ? (
                      selectedEmployee.history.map((entry, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50">
                          <td className="p-3 text-slate-300">{entry.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                              entry.type === 'Leave' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                            }`}>{entry.type}</span>
                          </td>
                          <td className="p-3 text-slate-400 italic">{entry.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3} className="p-10 text-center text-slate-600 italic">No record history found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : searchQuery && (
          <div className="p-10 text-center text-slate-600 bg-black/20 rounded-xl border border-dashed border-slate-800">
            Scanning Database... No match found for "{searchQuery}"
          </div>
        )}
      </section>
    </div>
  );
};

export default SchedulePage;
