
import React, { useState } from 'react';
import { Employee } from '../../types';
import NeonCard from '../NeonCard';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';

interface LeaveCheckProps {
  employees: Employee[];
  isAdmin?: boolean;
}

const LeaveCheck: React.FC<LeaveCheckProps> = ({ employees, isAdmin }) => {
  const [selectedId, setSelectedId] = useState<string>('');

  const selectedEmployee = employees.find(e => e.id === selectedId);

  // Hardcode override for Bhupendra Kumar to hide/reset balances locally for display
  if (selectedEmployee && selectedEmployee.name.trim() === "Bhupendra Kumar") {
    selectedEmployee.totalLeaves = 0;
    selectedEmployee.cOffBalance = 0;
    // We can also hide history if needed, but user specifically asked to remove "leave or c-off dikhata hai"
    // likely referring to the balance numbers.
  }

  const handleReset = async () => {
    if (!selectedEmployee) return;
    if (!window.confirm(`Are you sure you want to RESET ALL leave data for ${selectedEmployee.name}? This cannot be undone.`)) return;

    const updatedEmployees = [...employees];
    const index = updatedEmployees.findIndex(e => e.id === selectedId);
    if (index === -1) return;

    updatedEmployees[index] = {
      ...updatedEmployees[index],
      totalLeaves: 0,
      cOffBalance: 0,
      history: []
    };

    try {
      await set(ref(db, 'employees'), updatedEmployees);
      alert('Balance reset successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to reset');
    }
  };

  const handleDeleteEntry = async (index: number) => {
    if (!selectedEmployee) return;
    if (!window.confirm("Are you sure you want to delete this specific history record? Balances will be recalculated.")) return;

    const updatedEmployees = [...employees];
    const empIdx = updatedEmployees.findIndex(e => e.id === selectedId);
    if (empIdx === -1) return;

    const emp = { ...updatedEmployees[empIdx] };
    const history = [...(emp.history || [])];
    const entry = history[index];

    // Recalculate balances by reversing the effect of the entry
    if (entry.type === 'Leave') {
      emp.totalLeaves = Math.max(0, (emp.totalLeaves || 0) - 1);
    } else if (entry.type === 'C-Off Earned') {
      emp.cOffBalance = Math.max(0, (emp.cOffBalance || 0) - 1);
    } else if (entry.type === 'C-Off Taken' || entry.type.includes('Taken')) {
      emp.cOffBalance = (emp.cOffBalance || 0) + 1;
    }

    history.splice(index, 1);
    emp.history = history;
    updatedEmployees[empIdx] = emp;

    try {
      await set(ref(db, 'employees'), updatedEmployees);
      alert('Entry deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete entry');
    }
  }

  return (
    <NeonCard>
      <div className="flex flex-col gap-4 mb-6 pb-2 border-b-2 border-slate-700/50">
        <h2 className="text-xl font-bold orbitron text-slate-100 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-6 bg-cyan-400 mr-3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
          Quick Balance Check
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-200 orbitron font-bold focus:border-cyan-500 outline-none"
          >
            <option value="" className="bg-slate-800 text-slate-200">-- VERIFY YOUR BALANCE --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id} className="bg-slate-800 text-slate-200">{emp.name}</option>
            ))}
          </select>
          {selectedEmployee && isAdmin && (
            <button
              onClick={handleReset}
              className="w-full px-3 py-2 bg-red-600/20 text-red-500 border border-red-500/30 rounded hover:bg-red-600/40 font-bold orbitron text-xs uppercase transition-colors"
              title="Reset All Leave Data"
            >
              Reset
            </button>
          )}
        </div>
      </div>


      {!selectedEmployee ? (
        <div className="py-10 text-center text-slate-500 font-bold text-[10px] uppercase orbitron tracking-widest italic">
          Select employee name to view real-time records
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <div className="flex flex-col gap-4">
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
                  {isAdmin && <th className="p-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {(!selectedEmployee.history || selectedEmployee.history.length === 0) ? (
                  <tr>
                    <td colSpan={isAdmin ? 4 : 3} className="p-10 text-center text-[10px] text-slate-600 font-bold orbitron uppercase italic">No history records found</td>
                  </tr>
                ) : (
                  selectedEmployee.history.map((h, i) => (
                    <tr key={i} className="hover:bg-cyan-500/5 text-xs border-b border-slate-800/50">
                      <td className="p-3 font-mono text-slate-500 font-bold">{h.date}</td>
                      <td className={`p-3 font-bold ${h.type.includes('Taken') || h.type === 'Leave' ? 'text-red-400' : 'text-green-500'}`}>
                        {h.type}
                      </td>
                      <td className="p-3 text-slate-400 font-medium italic">"{h.reason}"</td>
                      {isAdmin && (
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteEntry(i)}
                            className="text-red-500 hover:text-red-300 font-bold orbitron text-[10px] uppercase border border-red-500/20 px-2 py-1 rounded bg-red-900/10 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      )}
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
