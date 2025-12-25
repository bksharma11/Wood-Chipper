
import React, { useState } from 'react';
import { Employee } from '../../types';

interface LeaveCheckProps {
  employees: Employee[];
}

const LeaveCheck: React.FC<LeaveCheckProps> = ({ employees }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  
  const selectedEmployee = employees.find(e => e.id === selectedId);

  return (
    <section className="brushed-metal p-6 rounded-2xl border border-slate-300 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-2 border-b-2 border-slate-200">
        <h2 className="text-xl font-bold orbitron text-slate-700 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-6 bg-blue-500 mr-3 shadow-sm"></span>
          Quick Balance Check
        </h2>
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-white border border-slate-300 p-2 rounded text-xs text-slate-800 orbitron font-bold focus:border-blue-500 outline-none"
          >
            <option value="">-- VERIFY YOUR BALANCE --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedEmployee ? (
        <div className="py-10 text-center text-slate-400 font-bold text-xs uppercase orbitron tracking-widest">
          Select employee name to view real-time balance records
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total Leaves Used</p>
                <p className="text-3xl font-black text-red-600 orbitron">{selectedEmployee.totalLeaves || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">C-Off Balance</p>
                <p className="text-3xl font-black text-green-600 orbitron">{selectedEmployee.cOffBalance || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-inner">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Role</p>
                  <p className="text-sm font-bold text-slate-700 orbitron">{selectedEmployee.role || 'WORKER'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Official ID</p>
                  <p className="text-sm font-mono text-slate-600 font-bold">{selectedEmployee.id}</p>
               </div>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <th className="p-3 border-b border-slate-200">Date</th>
                  <th className="p-3 border-b border-slate-200">Transaction</th>
                  <th className="p-3 border-b border-slate-200">Remark</th>
                </tr>
              </thead>
              <tbody>
                {(!selectedEmployee.history || selectedEmployee.history.length === 0) ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-xs text-slate-300 font-bold orbitron">NO RECORDED TRANSACTIONS</td>
                  </tr>
                ) : (
                  selectedEmployee.history.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50 text-xs border-b border-slate-100">
                      <td className="p-3 font-mono text-slate-500 font-bold">{h.date}</td>
                      <td className={`p-3 font-bold ${h.type.includes('Taken') || h.type === 'Leave' ? 'text-red-500' : 'text-green-600'}`}>
                        {h.type}
                      </td>
                      <td className="p-3 text-slate-700 font-semibold">{h.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeaveCheck;
