
import React, { useState } from 'react';
import { Shifts, Employee } from '../types';

interface ScheduleProps {
  shifts: Shifts;
  employees: Employee[];
  notification: string;
}

const SchedulePage: React.FC<ScheduleProps> = ({ shifts, employees, notification }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedEmployee = employees.find(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ShiftCard = ({ label, data }: { label: string, data: typeof shifts.A }) => (
    <div className="brushed-metal border border-slate-500/50 rounded-xl p-6 shadow-2xl relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 orbitron">SHFT_{label.toUpperCase()}</div>
      <h3 className="text-xl font-bold mb-4 text-slate-200 orbitron border-b border-slate-700 pb-2">Shift {label}</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500 uppercase">Supervisor</p>
          <p className="font-bold text-lg text-slate-100">{data.supervisor}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Chipper 1 Operator</p>
          <p className="text-slate-300">{data.chipper1}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase">Chipper 2 Operator</p>
          <p className="text-slate-300">{data.chipper2}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );

  return (
    <div className="space-y-8 py-4">
      {/* Shift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ShiftCard label="A" data={shifts.A} />
        <ShiftCard label="B" data={shifts.B} />
        <ShiftCard label="C" data={shifts.C} />
        <ShiftCard label="General" data={shifts.General} />
      </div>

      {/* Notification Bar */}
      <div className="bg-red-700/80 border-y border-red-500 p-2 overflow-hidden whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.3)]">
        <div className="animate-marquee inline-block text-white font-bold orbitron uppercase tracking-widest text-sm">
          {notification} • {notification} • {notification}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Employee Search */}
      <section className="brushed-metal p-6 rounded-xl border border-slate-600/50">
        <h2 className="text-2xl font-bold mb-6 orbitron text-slate-200">Employee Search & Records</h2>
        <div className="mb-6">
          <input 
            type="text"
            placeholder="Search by Name or Employee ID (e.g. MDUK...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {searchQuery && selectedEmployee ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-500 text-xs uppercase mb-1">Total Leaves Taken</p>
                <p className="text-3xl font-bold text-red-400">{selectedEmployee.totalLeaves}</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-500 text-xs uppercase mb-1">C-Off Balance</p>
                <p className={`text-3xl font-bold ${selectedEmployee.cOffBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedEmployee.cOffBalance}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-3 text-slate-400 text-xs uppercase font-bold">Date</th>
                    <th className="p-3 text-slate-400 text-xs uppercase font-bold">Type</th>
                    <th className="p-3 text-slate-400 text-xs uppercase font-bold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.history.length > 0 ? (
                    selectedEmployee.history.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                        <td className="p-3">{entry.date}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            entry.type === 'Leave' ? 'bg-red-900/40 text-red-300' : 
                            entry.type === 'C-Off Earned' ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{entry.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-600 italic">No history found for this employee.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : searchQuery && (
          <p className="text-slate-500 italic">No matching employee found.</p>
        )}
      </section>

      {/* Monthly Roster Preview */}
      <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6 orbitron text-slate-200">Monthly Roster (January 2026)</h2>
        <table className="w-full text-xs text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-700">
              <th className="p-2 border border-slate-700">Name</th>
              <th className="p-2 border border-slate-700">ID</th>
              <th className="p-2 border border-slate-700 text-center">01-Jan</th>
              <th className="p-2 border border-slate-700 text-center">02-Jan</th>
              <th className="p-2 border border-slate-700 text-center">03-Jan</th>
              <th className="p-2 border border-slate-700 text-center">04-Jan</th>
              <th className="p-2 border border-slate-700 text-center">05-Jan</th>
              <th className="p-2 border border-slate-700 text-center">...</th>
              <th className="p-2 border border-slate-700 text-center">31-Jan</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className={`${emp.id === 'MDUK0069' ? 'bg-amber-900/20 text-amber-200' : ''} border-b border-slate-800 hover:bg-white/5`}>
                <td className="p-2 font-bold border border-slate-800">{emp.name}</td>
                <td className="p-2 border border-slate-800">{emp.id}</td>
                <td className="p-2 text-center border border-slate-800">A</td>
                <td className="p-2 text-center border border-slate-800">A</td>
                <td className="p-2 text-center border border-slate-800">A</td>
                <td className="p-2 text-center border border-slate-800 bg-red-900/20">W/O</td>
                <td className="p-2 text-center border border-slate-800">B</td>
                <td className="p-2 text-center border border-slate-800">...</td>
                <td className="p-2 text-center border border-slate-800">C</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center space-x-2">
           <div className="w-4 h-4 bg-amber-900/20 border border-amber-600"></div>
           <span className="text-xs text-slate-400">Highlighted: Incharge (Bhupendra Kumar)</span>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;
