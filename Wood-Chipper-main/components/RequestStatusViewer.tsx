
import React, { useState } from 'react';
import { LeaveRequest, ShiftSwapRequest, Employee } from '../types';
import NeonCard from './NeonCard';

interface RequestStatusViewerProps {
    leaveRequests: LeaveRequest[];
    shiftSwapRequests: ShiftSwapRequest[];
    employees: Employee[];
}

const RequestStatusViewer: React.FC<RequestStatusViewerProps> = ({ leaveRequests, shiftSwapRequests, employees }) => {
    const [empId, setEmpId] = useState('');
    const [searched, setSearched] = useState(false);

    const employee = employees.find(e => e.id === empId);

    const myLeaves = leaveRequests
        .filter(r => r.empId === empId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // show last 5

    const mySwaps = shiftSwapRequests
        .filter(r => r.requestorId === empId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // show last 5

    return (
        <NeonCard>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🔎</span> Request Status Checker
            </h3>

            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    placeholder="Enter Employee ID (e.g. MDUK0001)"
                    value={empId}
                    onChange={(e) => { setEmpId(e.target.value.toUpperCase()); setSearched(false); }}
                    className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white font-bold tracking-widest outline-none focus:border-cyan-500"
                />
                <button
                    onClick={() => setSearched(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase px-4 rounded transition-all"
                >
                    Check
                </button>
            </div>

            {searched && (
                <div className="space-y-6 animate-fadeIn">

                    {/* Employee Identity Confirmation */}
                    <div className="bg-slate-800/80 p-3 rounded border border-cyan-500/30 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/50">
                            {employee ? employee.name.charAt(0) : '?'}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Employee Found</div>
                            <div className={`font-bold text-lg ${employee ? 'text-white' : 'text-red-400'}`}>
                                {employee ? employee.name : 'Unknown Employee ID'}
                            </div>
                        </div>
                    </div>

                    {employee && (
                        <>
                            {/* Leave Requests */}
                            <div>
                                <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2 border-b border-cyan-500/20 pb-1">Recent Leave Requests</h4>
                                {myLeaves.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No records found.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {myLeaves.map(req => (
                                            <div key={req.id} className="bg-slate-800/50 p-2 rounded flex justify-between items-center text-xs border border-white/5">
                                                <div>
                                                    <div className="text-slate-300 font-mono">{req.date}</div>
                                                    <div className="text-[10px] text-slate-500">{req.type}</div>
                                                </div>
                                                <div className={`font-bold px-2 py-1 rounded uppercase flex flex-col items-end ${req.status === 'approved' ? 'text-green-400' :
                                                        req.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                                    }`}>
                                                    <span>{req.status}</span>
                                                    {req.adminRemark && req.status !== 'pending' && <span className="text-[8px] text-slate-500 normal-case">{req.adminRemark}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Swap Requests */}
                            <div>
                                <h4 className="text-xs font-bold text-purple-400 uppercase mb-2 border-b border-purple-500/20 pb-1">Recent Swap Requests</h4>
                                {mySwaps.length === 0 ? (
                                    <p className="text-slate-500 text-xs italic">No records found.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {mySwaps.map(req => (
                                            <div key={req.id} className="bg-slate-800/50 p-2 rounded flex justify-between items-center text-xs border border-white/5">
                                                <div>
                                                    <div className="text-slate-300 font-mono">{req.targetDate}</div>
                                                    <div className="text-[10px] text-slate-500">{req.currentShift} → {req.desiredShift}</div>
                                                </div>
                                                <div className={`font-bold px-2 py-1 rounded uppercase flex flex-col items-end ${req.status === 'approved' ? 'text-green-400' :
                                                        req.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                                                    }`}>
                                                    <span>{req.status}</span>
                                                    {req.adminRemark && req.status !== 'pending' && <span className="text-[8px] text-slate-500 normal-case">{req.adminRemark}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </NeonCard>
    );
};

export default RequestStatusViewer;
