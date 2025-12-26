
import React, { useState } from 'react';
import { Employee } from '../../types';
import NeonCard from '../NeonCard';

interface LeaveCheckProps {
  employees: Employee[];
}

const LeaveCheck: React.FC<LeaveCheckProps> = ({ employees }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  
  const selectedEmployee = employees.find(e => e.id === selectedId);

  return (
    <NeonCard>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-2 border-b-2 border-slate-700/50">
        <h2 className="text-xl font-bold orbitron text-slate-100 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-6 bg-cyan-400 mr-3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
          Quick Balance Check
        </h2>
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-200 orbitron font-bold focus:border-cyan-500 outline-none"
          >
            <option value="">-- VERIFY YOUR BALANCE --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedEmployee ? (
        <div className="py-10 text-center text-slate-500 font-bold text-[10px] uppercase orbitron tracking-widest italic">
          Select employee name to view real-time records
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Total Leaves Used</p>
                <p className="text-3xl font-black text-red-500 orbitron">{selectedEmployee.totalLeaves || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">C-Off Balance</p>
                <p className="text-3xl font-black text-green-500 orbitron">{selectedEmployee.cOffBalance || 0}</p>
              </div>
            </div>
            <div className="bg-black/20 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-inner">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Role</p>
                  <p className="text-sm font-bold text-slate-300 orbitron tracking-wider">{selectedEmployee.role || 'WORKER'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Official ID</p>
                  <p className="text-sm font-mono text-slate-400 font-bold uppercase">{selectedEmployee.id}</p>
               </div>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-800 rounded-lg bg-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/70 text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-slate-800">
                  <th className="p-3">Date</th>
                  <th className="p-3">Transaction</th>
                  <th className="p-3">Remark</th>
                </tr>
              </thead>
              <tbody>
                {(!selectedEmployee.history || selectedEmployee.history.length === 0) ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-[10px] text-slate-600 font-bold orbitron uppercase italic">No history records found</td>
                  </tr>
                ) : (
                  selectedEmployee.history.map((h, i) => (
                    <tr key={i} className="hover:bg-cyan-500/5 text-xs border-b border-slate-800/50">
                      <td className="p-3 font-mono text-slate-500 font-bold">{h.date}</td>
                      <td className={`p-3 font-bold ${h.type.includes('Taken') || h.type === 'Leave' ? 'text-red-400' : 'text-green-500'}`}>
                        {h.type}
                      </td>
                      <td className="p-3 text-slate-400 font-medium italic">"{h.reason}"</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </NeonCard>
  );
};

export default LeaveCheck;
