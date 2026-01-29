
import React, { useState } from 'react';
import { LeaveRequest, Employee, HistoryEntry } from '../../types';
import { db } from '../../firebase';
import { ref, set, remove } from 'firebase/database';
import NeonCard from '../NeonCard';
import { handleFirebaseError } from '../../utils';

interface LeaveRequestsAdminProps {
  requests: LeaveRequest[];
  employees: Employee[];
}

const LeaveRequestsAdmin: React.FC<LeaveRequestsAdminProps> = ({ requests, employees }) => {
  const [adminRemark, setAdminRemark] = useState<Record<string, string>>({});

  const handleAction = async (request: LeaveRequest, status: 'approved' | 'rejected') => {
    const remark = adminRemark[request.id] || "No remarks";

    try {
      if (status === 'approved') {
        const updatedEmployees = [...employees];
        const empIdx = updatedEmployees.findIndex(e => e.id === request.empId);

        if (empIdx !== -1) {
          const emp = { ...updatedEmployees[empIdx] };
          const history = [...(emp.history || [])];

          const newEntry: HistoryEntry = {
            date: request.date,
            type: request.type === 'Leave' ? 'Leave' : 'C-Off Taken',
            reason: `[APPROVED REQ] ${request.reason} | Remark: ${remark}`
          };

          history.unshift(newEntry);

          if (request.type === 'Leave') {
            emp.totalLeaves = (emp.totalLeaves || 0) + 1;
          } else {
            emp.cOffBalance = Math.max(0, (emp.cOffBalance || 0) - 1);
          }

          emp.history = history;
          updatedEmployees[empIdx] = emp;

          await set(ref(db, 'employees'), updatedEmployees);
        }
      }

      await remove(ref(db, `leaveRequests/${request.id}`));
      alert(`Request ${status.toUpperCase()} successfully.`);
    } catch (err: any) {
      handleFirebaseError(err);
    }
  };

  const pending = requests.filter(r => r.status === 'pending');

  return (
    <NeonCard>
      <h2 className="text-xl font-bold mb-6 orbitron text-slate-100 uppercase">Incoming Leave Requests</h2>

      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="py-10 text-center text-slate-500 font-bold uppercase orbitron text-xs bg-black/20 rounded-lg border border-dashed border-slate-700">
            No pending requests at this time.
          </div>
        ) : (
          pending.map(req => (
            <NeonCard key={req.id} className="bg-slate-900/50 border-slate-700/50 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-cyan-400 orbitron text-sm">{req.empName}</span>
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 text-slate-300 font-bold">{req.empId}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300">Requesting: <span className="text-red-400">{req.type}</span> on <span className="text-slate-100">{req.date}</span></p>
                  <p className="text-xs text-slate-400 italic mt-2 bg-black/20 p-2 rounded border border-slate-800">" {req.reason} "</p>
                </div>

                <div className="w-full md:w-64 space-y-2">
                  <input
                    type="text"
                    placeholder="Admin remark (optional)..."
                    value={adminRemark[req.id] || ''}
                    onChange={(e) => setAdminRemark({ ...adminRemark, [req.id]: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-800/70 border border-slate-700 rounded focus:ring-1 focus:ring-cyan-400 outline-none text-slate-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req, 'approved')}
                      className="flex-1 bg-green-600/20 text-green-300 border border-green-500/30 py-2 rounded text-[10px] font-bold orbitron hover:bg-green-600/40"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => handleAction(req, 'rejected')}
                      className="flex-1 bg-red-600/20 text-red-400 border border-red-500/30 py-2 rounded text-[10px] font-bold orbitron hover:bg-red-600/40"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </NeonCard>
  );
};

export default LeaveRequestsAdmin;
