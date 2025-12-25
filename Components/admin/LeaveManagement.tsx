
import React, { useState } from 'react';
import { Employee } from '../../types';

interface LeaveManagementProps {
  employees: Employee[];
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'Leave' | 'C-Off Earned' | 'C-Off Taken'>('Leave');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Leave management logic not yet implemented.\n\nData:\nEmployee: ${selectedEmployee}\nType: ${leaveType}\nDate: ${date}\nReason: ${reason}`);
  };

  return (
    <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
      <h2 className="text-xl font-bold mb-6 orbitron text-slate-200">Leave & C-Off Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Select Employee</label>
          <select 
            value={selectedEmployee} 
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
          >
            <option value="" disabled>-- Choose an employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Transaction Type</label>
            <select 
              value={leaveType} 
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
            >
              <option value="Leave">Record Leave</option>
              <option value="C-Off Taken">Record C-Off Taken</option>
              <option value="C-Off Earned">Record C-Off Earned</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Reason / Remarks</label>
          <input 
            type="text" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Personal reason, Compensatory off against Sunday work"
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white" 
          />
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <button 
            type="submit"
            className="w-full py-3 bg-green-700 text-white font-bold orbitron rounded shadow-xl hover:bg-green-600 border border-green-500 uppercase text-sm"
          >
            Submit Entry
          </button>
        </div>
      </form>
    </section>
  );
};

export default LeaveManagement;
