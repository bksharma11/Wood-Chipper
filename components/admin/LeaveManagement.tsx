
import React, { useState } from 'react';
import { Employee, HistoryEntry } from '../../types';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';

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
    
    // Logic to update local copy then push to Firebase
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
    
    // Update balances
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

  return (
    <section className="brushed-metal p-6 rounded-xl border border-slate-300 shadow-lg">
      <h2 className="text-xl font-bold mb-6 orbitron text-slate-700 uppercase">Manual Leave Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Target Employee</label>
          <select 
            value={selectedEmployeeId} 
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full bg-white border border-slate-300 p-3 rounded text-slate-800 font-bold focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Select Employee to Update --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Log Type</label>
            <select 
              value={leaveType} 
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full bg-white border border-slate-300 p-3 rounded text-slate-800 font-bold"
            >
              <option value="Leave">Record Annual Leave</option>
              <option value="C-Off Taken">Use C-Off Balance</option>
              <option value="C-Off Earned">Add C-Off Balance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Effect Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-white border border-slate-300 p-3 rounded text-slate-800 font-bold" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Official Remark / Reason</label>
          <input 
            type="text" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            placeholder="Detailed reason for the log entry..."
            className="w-full bg-white border border-slate-300 p-3 rounded text-slate-800 focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 font-black orbitron rounded shadow-lg uppercase text-sm border-2 transition-all ${
              isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-green-600 text-white border-green-400 hover:bg-green-700 active:scale-95'
            }`}
          >
            {isSubmitting ? 'UPDATING...' : 'COMMIT TRANSACTION'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LeaveManagement;
