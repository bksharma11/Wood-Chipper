
import React from 'react';
import { ShiftSwapRequest, Employee } from '../../types';
import { db } from '../../firebase';
import { ref, update } from 'firebase/database';
import GlassCard from '../ui/GlassCard';

interface ShiftSwapAdminProps {
    requests: ShiftSwapRequest[];
    employees: Employee[];
}

const ShiftSwapAdmin: React.FC<ShiftSwapAdminProps> = ({ requests, employees }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const historyRequests = requests.filter(r => r.status !== 'pending').sort((a, b) => b.timestamp - a.timestamp);

    const handleAction = async (req: ShiftSwapRequest, status: 'approved' | 'rejected') => {
        const reason = prompt(status === 'approved' ? "Enter Approval Note (Optional):" : "Enter Rejection Reason:");
        if (status === 'rejected' && !reason) return;

        try {
            await update(ref(db, `shiftSwapRequests/${req.id}`), {
                status,
                adminRemark: reason || (status === 'approved' ? 'Approved by Admin' : 'Rejected'),
            });
            alert(`Request ${status.toUpperCase()} Successfully`);
        } catch (err) {
            console.error(err);
            alert("Failed to update request");
        }
    };

    return (
        <div className="space-y-8">
            {/* PENDING REQUESTS */}
            <GlassCard title="Pending Swap Requests" icon={<span>⏳</span>}>
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 italic">No pending shift swap requests.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] text-slate-500 font-mono">{new Date(req.timestamp).toLocaleDateString()}</div>

                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                                            {req.requestorName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{req.requestorName}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">ID: {req.requestorId}</p>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] px-2 py-1 rounded border ${req.requestType === 'Mutual Swap' ? 'border-purple-500 text-purple-400' : 'border-cyan-500 text-cyan-400'}`}>
                                        {req.requestType === 'Mutual Swap' ? 'MUTUAL SWAP' : 'ONE-WAY CHANGE'}
                                    </div>
                                </div>

                                <div className="bg-black/30 p-2 rounded border border-white/5 mb-3">
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
                                        <div>
                                            <div className="text-[10px] text-slate-500 uppercase">Target Date</div>
                                            <div className="font-mono text-white">{req.targetDate}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500 uppercase">Current</div>
                                            <div className="text-red-400 font-bold">{req.currentShift}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-500 uppercase">Desired</div>
                                            <div className="text-green-400 font-bold">{req.desiredShift}</div>
                                        </div>
                                    </div>

                                    {req.requestType === 'Mutual Swap' && (
                                        <div className="text-center border-t border-white/5 pt-2 mt-2">
                                            <div className="text-[10px] text-purple-400 uppercase tracking-widest mb-1">Swapping With</div>
                                            <div className="text-sm font-bold text-purple-200">{req.targetEmpName || 'Unknown'} <span className="text-[10px] text-slate-500">({req.targetEmpId})</span></div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-800/50 p-2 rounded mb-4 text-xs text-slate-300 italic min-h-[40px]">
                                    "{req.reason}"
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleAction(req, 'approved')}
                                        className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 py-2 rounded font-bold uppercase text-[10px] transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req, 'rejected')}
                                        className="bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-500/30 py-2 rounded font-bold uppercase text-[10px] transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>

            {/* HISTORY */}
            <GlassCard title="Swap Request History" icon={<span>📜</span>}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-slate-500 uppercase border-b border-white/10">
                                <th className="p-3">Date</th>
                                <th className="p-3">Requestor</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Details</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs text-slate-300">
                            {historyRequests.map(req => (
                                <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3 font-mono">{req.targetDate}</td>
                                    <td className="p-3 font-bold">{req.requestorName}</td>
                                    <td className="p-3">
                                        {req.requestType === 'Mutual Swap' ? (
                                            <span className="text-purple-400">Mutual ({req.targetEmpName})</span>
                                        ) : (
                                            <span className="text-cyan-400">One-Way</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className="text-red-400">{req.currentShift}</span> ➔ <span className="text-green-400">{req.desiredShift}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {historyRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-6 text-slate-500 italic">No history available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default ShiftSwapAdmin;
