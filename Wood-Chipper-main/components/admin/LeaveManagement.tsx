
import React, { useState } from 'react';
import { Employee, HistoryEntry } from '../../types';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';
import NeonCard from '../NeonCard';

interface LeaveManagementProps {
  employees: Employee[];
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ employees }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'Leave' | 'C-Off Earned' | 'C-Off Taken'>('Leave');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !reason) return alert("Please select an employee and provide a reason.");
    
    setIsSubmitting(true);
    
    const updatedEmployees = [...employees];
    const empIdx = updatedEmployees.findIndex(e => e.id === selectedEmployeeId);
    
    if (empIdx === -1) return setIsSubmitting(false);
    
    const emp = { ...updatedEmployees[empIdx] };
    const history = [...(emp.history || [])];
    
    const newEntry: HistoryEntry = {
      date,
      type: leaveType,
      reason
    };
    
    history.unshift(newEntry);
    
    if (leaveType === 'Leave') {
      emp.totalLeaves = (emp.totalLeaves || 0) + 1;
    } else if (leaveType === 'C-Off Earned') {
      emp.cOffBalance = (emp.cOffBalance || 0) + 1;
    } else if (leaveType === 'C-Off Taken') {
      emp.cOffBalance = Math.max(0, (emp.cOffBalance || 0) - 1);
    }
    
    emp.history = history;
    updatedEmployees[empIdx] = emp;
    
    set(ref(db, 'employees'), updatedEmployees)
      .then(() => {
        alert(`Record Updated for ${emp.name}`);
        setReason('');
        setIsSubmitting(false);
      })
      .catch(err => {
        alert("Update Failed: " + err.message);
        setIsSubmitting(false);
      });
  };

  const deleteHistoryEntry = (empId: string, entryIdx: number) => {
    if (!window.confirm("Are you sure you want to delete this specific history record? Balances will be recalculated.")) return;

    const updatedEmployees = [...employees];
    const empIdx = updatedEmployees.findIndex(e => e.id === empId);
    if (empIdx === -1) return;

    const emp = { ...updatedEmployees[empIdx] };
    const history = [...(emp.history || [])];
    const entryToDelete = history[entryIdx];

    if (entryToDelete.type === 'Leave') {
      emp.totalLeaves = Math.max(0, (emp.totalLeaves || 0) - 1);
    } else if (entryToDelete.type === 'C-Off Earned') {
      emp.cOffBalance = Math.max(0, (emp.cOffBalance || 0) - 1);
    } else if (entryToDelete.type === 'C-Off Taken') {
      emp.cOffBalance = (emp.cOffBalance || 0) + 1;
    }

    history.splice(entryIdx, 1);
    emp.history = history;
    updatedEmployees[empIdx] = emp;

    set(ref(db, 'employees'), updatedEmployees)
      .then(() => alert("Entry deleted successfully."))
      .catch(err => alert("Delete Failed: " + err.message));
  };

  const selectedEmp = employees.find(e => e.id === selectedEmployeeId);

  return (
    <div className="space-y-6">
      <NeonCard>
        <h2 className="text-xl font-bold mb-6 orbitron text-slate-100 uppercase">Manual Leave Entry</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Target Employee</label>
            <select 
              value={selectedEmployeeId} 
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-slate-200 font-bold focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled>-- Select Employee to Update --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Log Type</label>
              <select 
                value={leaveType} 
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-slate-200 font-bold"
              >
                <option value="Leave">Record Annual Leave</option>
                <option value="C-Off Taken">Use C-Off Balance</option>
                <option value="C-Off Earned">Add C-Off Balance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Effect Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-slate-200 font-bold" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Official Remark / Reason</label>
            <input 
              type="text" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detailed reason for the log entry..."
              className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-slate-200 focus:ring-2 focus:ring-cyan-500" 
            />
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-black orbitron rounded-lg shadow-lg uppercase text-sm border transition-all ${
                isSubmitting ? 'bg-slate-700 text-slate-500 border-slate-600' : 'bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/40 active:scale-95'
              }`}
            >
              {isSubmitting ? 'PROCESSING...' : 'COMMIT TRANSACTION'}
            </button>
          </div>
        </form>
      </NeonCard>

      {selectedEmp && (
        <NeonCard>
          <h2 className="text-sm font-bold orbitron text-slate-400 mb-4 uppercase tracking-widest">Manage History: {selectedEmp.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-400 uppercase font-black tracking-tighter">
                  <th className="p-3 border-b border-slate-700">Date</th>
                  <th className="p-3 border-b border-slate-700">Type</th>
                  <th className="p-3 border-b border-slate-700">Reason</th>
                  <th className="p-3 border-b border-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmp.history?.map((h, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-cyan-500/5">
                    <td className="p-3 font-mono text-slate-400">{h.date}</td>
                    <td className={`p-3 font-bold ${h.type.includes('Taken') || h.type === 'Leave' ? 'text-red-400' : 'text-green-400'}`}>{h.type}</td>
                    <td className="p-3 text-slate-300 italic truncate max-w-[200px]">{h.reason}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => deleteHistoryEntry(selectedEmp.id, i)}
                        className="text-red-500 hover:text-red-300 font-bold orbitron text-[10px] uppercase border border-red-500/20 px-2 py-1 rounded bg-red-900/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!selectedEmp.history || selectedEmp.history.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-600 font-bold uppercase italic">No history records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </NeonCard>
      )}
    </div>
  );
};

export default LeaveManagement;
