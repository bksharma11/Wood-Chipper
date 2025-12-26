
import React, { useState } from 'react';
import { Employee, LeaveRequest } from '../types';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import NeonCard from './NeonCard';

interface LeaveRequestSystemProps {
  employees: Employee[];
}

const LeaveRequestSystem: React.FC<LeaveRequestSystemProps> = ({ employees }) => {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [enteredId, setEnteredId] = useState('');
  const [type, setType] = useState<'Leave' | 'C-Off'>('Leave');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return alert("Select your name first.");
    if (enteredId.trim().toUpperCase() !== emp.id) {
      return alert("Authentication Failed: Entered Employee ID does not match the selected name.");
    }
    if (!reason) return alert("Please provide a reason.");

    setIsSubmitting(true);
    
    const requestData: Omit<LeaveRequest, 'id'> = {
      empId: emp.id,
      empName: emp.name,
      type,
      date,
      reason,
      status: 'pending',
      timestamp: Date.now()
    };

    const newReqRef = push(ref(db, 'leaveRequests'));
    set(newReqRef, requestData)
      .then(() => {
        alert("Request Submitted Successfully! Please wait for Admin approval.");
        setEnteredId('');
        setReason('');
        setIsSubmitting(false);
      })
      .catch(err => {
        alert("Error: " + err.message);
        setIsSubmitting(false);
      });
  };

  return (
    <NeonCard>
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-3">
        <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold orbitron text-slate-100 uppercase tracking-tighter">Self-Service Leave Request</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Apply for Leave or Compensatory Off</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Step 1: Select Your Name</label>
            <select 
              value={selectedEmpId} 
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none focus:border-cyan-500"
            >
              <option value="">-- WHO ARE YOU? --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Step 2: Verify Your Emp ID</label>
            <input 
              type="text" 
              placeholder="e.g. MDUK0000"
              value={enteredId}
              onChange={(e) => setEnteredId(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Request Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none"
              >
                <option value="Leave">Annual Leave</option>
                <option value="C-Off">C-Off Application</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reason for Absence (Detailed)</label>
            <textarea 
              placeholder="Please explain why you need this leave or c-off..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 outline-none focus:border-cyan-500 min-h-[80px]"
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 orbitron font-bold uppercase rounded shadow-lg transition-all border ${
              isSubmitting ? 'bg-slate-700 text-slate-500 border-slate-600' : 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-600/40'
            }`}
          >
            {isSubmitting ? 'PROCESSING...' : 'SUBMIT REQUEST'}
          </button>
        </div>
      </form>
    </NeonCard>
  );
};

export default LeaveRequestSystem;
