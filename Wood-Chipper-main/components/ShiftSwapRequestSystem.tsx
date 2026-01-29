
import React, { useState } from 'react';
import { Employee, ShiftSwapRequest } from '../types';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import NeonCard from './NeonCard';

interface ShiftSwapRequestSystemProps {
    employees: Employee[];
}

const ShiftSwapRequestSystem: React.FC<ShiftSwapRequestSystemProps> = ({ employees }) => {
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [enteredId, setEnteredId] = useState('');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentShift, setCurrentShift] = useState<'A' | 'B' | 'C' | 'G'>('A');
    const [desiredShift, setDesiredShift] = useState<'A' | 'B' | 'C' | 'G'>('B');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Fields
    const [requestType, setRequestType] = useState<'Mutual Swap' | 'unilateral'>('unilateral');
    const [targetEmpId, setTargetEmpId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const emp = employees.find(e => e.id === selectedEmpId);
        if (!emp) return alert("Select your name first.");
        if (enteredId.trim().toUpperCase() !== emp.id) {
            return alert("Authentication Failed: Entered Employee ID does not match the selected name.");
        }
        if (currentShift === desiredShift) return alert("Current and Desired shift cannot be the same.");
        if (requestType === 'Mutual Swap' && !targetEmpId) return alert("Please select the employee you want to swap with.");
        if (!reason) return alert("Please provide a reason.");

        setIsSubmitting(true);

        const targetEmpName = requestType === 'Mutual Swap'
            ? employees.find(e => e.id === targetEmpId)?.name
            : undefined;

        const requestData: Omit<ShiftSwapRequest, 'id'> = {
            requestorId: emp.id,
            requestorName: emp.name,
            requestType,
            targetEmpId: requestType === 'Mutual Swap' ? targetEmpId : undefined,
            targetEmpName,
            targetDate,
            currentShift,
            desiredShift,
            reason,
            status: 'pending',
            timestamp: Date.now()
        };

        const newReqRef = push(ref(db, 'shiftSwapRequests'));
        set(newReqRef, requestData)
            .then(() => {
                alert("Shift Swap Request Submitted! Admin will review it.");
                setEnteredId('');
                setReason('');
                setTargetEmpId('');
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
                <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center text-purple-300 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold orbitron text-slate-100 uppercase tracking-tighter">Shift Swap Portal</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Request a shift change or mutual swap</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Identity Section */}
                <div className="space-y-4">
                    <h3 className="text-xs text-purple-400 font-bold uppercase border-b border-purple-500/20 pb-1">1. Your Identity</h3>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Name</label>
                        <select
                            value={selectedEmpId}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none focus:border-purple-500 text-xs"
                        >
                            <option value="">-- WHO ARE YOU? --</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Emp ID (Auth)</label>
                        <input
                            type="text"
                            placeholder="e.g. MDUK0000"
                            value={enteredId}
                            onChange={(e) => setEnteredId(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold focus:border-purple-500 outline-none text-xs"
                        />
                    </div>
                </div>

                {/* Request Details Section */}
                <div className="space-y-4">
                    <h3 className="text-xs text-purple-400 font-bold uppercase border-b border-purple-500/20 pb-1">2. Request Details</h3>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Request Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRequestType('unilateral')}
                                className={`p-2 rounded text-[10px] font-bold uppercase border transition-all ${requestType === 'unilateral' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-800 text-slate-500 border-transparent hover:bg-slate-700'}`}
                            >
                                Single Shift Change
                            </button>
                            <button
                                type="button"
                                onClick={() => setRequestType('Mutual Swap')}
                                className={`p-2 rounded text-[10px] font-bold uppercase border transition-all ${requestType === 'Mutual Swap' ? 'bg-purple-500/20 text-purple-300 border-purple-500' : 'bg-slate-800 text-slate-500 border-transparent hover:bg-slate-700'}`}
                            >
                                Mutual Swap
                            </button>
                        </div>
                    </div>

                    {requestType === 'Mutual Swap' && (
                        <div className="animate-fadeIn">
                            <label className="block text-[10px] font-bold text-purple-400 uppercase mb-1">Swap With Whom?</label>
                            <select
                                value={targetEmpId}
                                onChange={(e) => setTargetEmpId(e.target.value)}
                                className="w-full bg-slate-900/50 border border-purple-500/50 p-2 rounded text-slate-200 font-bold outline-none focus:border-purple-500 text-xs"
                            >
                                <option value="">-- SELECT PARTNER --</option>
                                {employees.filter(e => e.id !== selectedEmpId).map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Shift</label>
                            <select
                                value={currentShift}
                                onChange={(e) => setCurrentShift(e.target.value as any)}
                                className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none text-xs"
                            >
                                <option value="A">Shift A</option>
                                <option value="B">Shift B</option>
                                <option value="C">Shift C</option>
                                <option value="G">General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Desired Shift</label>
                            <select
                                value={desiredShift}
                                onChange={(e) => setDesiredShift(e.target.value as any)}
                                className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none text-xs"
                            >
                                <option value="A">Shift A</option>
                                <option value="B">Shift B</option>
                                <option value="C">Shift C</option>
                                <option value="G">General</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Date</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 font-bold outline-none text-xs"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reason for Swap/Change</label>
                    <textarea
                        placeholder="Why do you need to change? e.g. Personal issue, transport problem..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-slate-200 outline-none focus:border-purple-500 min-h-[60px] text-xs"
                    />
                </div>

                <div className="md:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 orbitron font-bold uppercase rounded shadow-lg transition-all border ${isSubmitting ? 'bg-slate-700 text-slate-500 border-slate-600' : 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/40'
                            }`}
                    >
                        {isSubmitting ? 'SENDING TO ADMIN...' : 'SUBMIT REQUEST'}
                    </button>
                </div>
            </form>
        </NeonCard>
    );
};

export default ShiftSwapRequestSystem;
