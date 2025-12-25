
import React, { useState } from 'react';
import { LeaveRequest, Employee, HistoryEntry } from '../../types';
import { db } from '../../firebase';
import { ref, set, remove } from 'firebase/database';

interface LeaveRequestsAdminProps {
  requests: LeaveRequest[];
  employees: Employee[];
}

const LeaveRequestsAdmin: React.FC<LeaveRequestsAdminProps> = ({ requests, employees }) => {
  const [adminRemark, setAdminRemark] = useState<Record<string, string>>({});

  const handleAction = async (request: LeaveRequest, status: 'approved' | 'rejected') => {
    const remark = adminRemark[request.id] || "No remarks";
    
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
        
        // Save updated employee data
        await set(ref(db, 'employees'), updatedEmployees);
      }
    }

    // Mark as handled or remove from list (here we remove for cleanliness)
    await remove(ref(db, `leaveRequests/${request.id}`));
    alert(`Request ${status.toUpperCase()} successfully.`);
  };

  const pending = requests.filter(r => r.status === 'pending');

  return (
    <section className="brushed-metal p-6 rounded-xl border border-slate-300 shadow-xl">
      <h2 className="text-xl font-bold mb-6 orbitron text-slate-700 uppercase">Incoming Leave Requests</h2>
      
      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="py-10 text-center text-slate-400 font-bold uppercase orbitron text-xs bg-white/50 rounded border border-dashed border-slate-300">
            No pending requests at this time.
          </div>
        ) : (
          pending.map(req => (
            <div key={req.id} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-blue-700 orbitron text-sm">{req.empName}</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-bold">{req.empId}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Requesting: <span className="text-red-600">{req.type}</span> on <span className="text-slate-900">{req.date}</span></p>
                  <p className="text-xs text-slate-500 italic mt-2 bg-blue-50 p-2 rounded border border-blue-100">" {req.reason} "</p>
                </div>
                
                <div className="w-full md:w-64 space-y-2">
                  <input 
                    type="text" 
                    placeholder="Admin remark..." 
                    value={adminRemark[req.id] || ''}
                    onChange={(e) => setAdminRemark({...adminRemark, [req.id]: e.target.value})}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 outline-none"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(req, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 rounded text-[10px] font-bold orbitron hover:bg-green-700"
                    >
                      APPROVE
                    </button>
                    <button 
                      onClick={() => handleAction(req, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 rounded text-[10px] font-bold orbitron hover:bg-red-700"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LeaveRequestsAdmin;
