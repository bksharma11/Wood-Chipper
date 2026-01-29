import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import BunkerBar from './BunkerBar';
import GlassCard from '../ui/GlassCard';
import GlassInput from '../ui/GlassInput';
import GlassSelect from '../ui/GlassSelect';
import GlassButton from '../ui/GlassButton';
import { db } from '../../firebase';
import { ref, onValue, update } from 'firebase/database';

interface ProductionEntryProps {
    employees: Employee[];
}

const ProductionEntry: React.FC<ProductionEntryProps> = ({ employees }) => {
    interface ChipperLog {
        id: number;
        start: string;
        stop: string;
        reason: string;
    }

    // Initial State (fallback)
    const [c1Logs, setC1Logs] = useState<ChipperLog[]>([
        { id: 1, start: '08:00', stop: '12:00', reason: 'Running' }
    ]);
    const [c2Logs, setC2Logs] = useState<ChipperLog[]>([
        { id: 1, start: '08:00', stop: '13:00', reason: 'Running' }
    ]);

    const [avgWoodCut, setAvgWoodCut] = useState(2.5);
    const [bunker1, setBunker1] = useState(45);
    const [bunker2, setBunker2] = useState(15);
    const [weightScale, setWeightScale] = useState('1245.50');

    const authorizedStaff = (employees || []).filter(e => e.role === 'SUPERVISOR' || e.role === 'INCHARGE');
    const [supervisor, setSupervisor] = useState('');

    // --- Firebase Persistence ---
    useEffect(() => {
        const productionRef = ref(db, 'production');
        const unsub = onValue(productionRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.c1Logs) setC1Logs(data.c1Logs);
                if (data.c2Logs) setC2Logs(data.c2Logs);
                if (data.metrics?.avgWoodCut !== undefined) setAvgWoodCut(data.metrics.avgWoodCut);
                if (data.bunkers?.bunker1 !== undefined) setBunker1(data.bunkers.bunker1);
                if (data.bunkers?.bunker2 !== undefined) setBunker2(data.bunkers.bunker2);
                if (data.scale?.currentWeight !== undefined) setWeightScale(data.scale.currentWeight);
                if (data.shift?.supervisor !== undefined) setSupervisor(data.shift.supervisor);
            }
        });
        return () => unsub();
    }, []);

    const saveToFirebase = (path: string, value: any) => {
        update(ref(db), { [`production/${path}`]: value });
    };

    // --- Handlers ---

    const calculateDuration = (start: string, stop: string) => {
        if (!start || !stop) return 0;
        const s = new Date(`2000-01-01T${start}:00`);
        const e = new Date(`2000-01-01T${stop}:00`);
        let diff = (e.getTime() - s.getTime()) / 1000 / 3600;
        if (diff < 0) diff += 24;
        return diff;
    };

    const calculateTotalHours = (logs: ChipperLog[]) => {
        return logs.reduce((acc, log) => acc + calculateDuration(log.start, log.stop), 0);
    };

    const totalTime = calculateTotalHours(c1Logs) + calculateTotalHours(c2Logs);
    const productionAmount = (totalTime * avgWoodCut).toFixed(2);

    const addLog = (chipper: 1 | 2) => {
        const newLog = { id: Date.now(), start: '', stop: '', reason: '' };
        if (chipper === 1) {
            const newLogs = [...c1Logs, newLog];
            setC1Logs(newLogs); // Optimistic Update
            saveToFirebase('c1Logs', newLogs);
        } else {
            const newLogs = [...c2Logs, newLog];
            setC2Logs(newLogs);
            saveToFirebase('c2Logs', newLogs);
        }
    };

    const removeLog = (chipper: 1 | 2, id: number) => {
        if (chipper === 1) {
            const newLogs = c1Logs.filter(l => l.id !== id);
            setC1Logs(newLogs);
            saveToFirebase('c1Logs', newLogs);
        } else {
            const newLogs = c2Logs.filter(l => l.id !== id);
            setC2Logs(newLogs);
            saveToFirebase('c2Logs', newLogs);
        }
    };

    const updateLog = (chipper: 1 | 2, id: number, field: keyof ChipperLog, value: string) => {
        const updater = (logs: ChipperLog[]) => logs.map(log => log.id === id ? { ...log, [field]: value } : log);
        if (chipper === 1) {
            const newLogs = updater(c1Logs);
            setC1Logs(newLogs);
            saveToFirebase('c1Logs', newLogs);
        } else {
            const newLogs = updater(c2Logs);
            setC2Logs(newLogs);
            saveToFirebase('c2Logs', newLogs);
        }
    };

    const handleBunkerChange = (bunker: 1 | 2, val: number) => {
        const validated = Math.min(100, Math.max(0, val || 0));
        if (bunker === 1) {
            setBunker1(validated);
            saveToFirebase('bunkers/bunker1', validated);
        } else {
            setBunker2(validated);
            saveToFirebase('bunkers/bunker2', validated);
        }
    };

    // --- Constants ---

    const stopReasons = [
        "Running",
        "Shift Change",
        "No Material",
        "Electrical Failure",
        "Mechanical Failure",
        "Cleaning",
        "Blade Change",
        "Other"
    ];

    const reasonsOptions = stopReasons.map(r => ({ label: r, value: r }));

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Chipper Logs */}
                <GlassCard title="Chipper Log System" className="border-cyan-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Chipper 1 */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                <h3 className="font-bold text-cyan-300 orbitron text-sm">CHIPPER 01</h3>
                                <GlassButton size="sm" onClick={() => addLog(1)} icon={<span>+</span>}>Entry</GlassButton>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {c1Logs.map((log) => (
                                    <div key={log.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-3 relative group">
                                        <button
                                            onClick={() => removeLog(1, log.id)}
                                            className="absolute -top-2 -right-2 bg-red-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <GlassInput label="Start" type="time" value={log.start} onChange={(e) => updateLog(1, log.id, 'start', e.target.value)} />
                                            <GlassInput label="Stop" type="time" value={log.stop} onChange={(e) => updateLog(1, log.id, 'stop', e.target.value)} />
                                        </div>
                                        <GlassSelect
                                            label="Status / Reason"
                                            value={log.reason}
                                            onChange={(e) => updateLog(1, log.id, 'reason', e.target.value)}
                                            options={reasonsOptions}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-cyan-900/10 p-3 rounded border border-cyan-500/20 text-right">
                                <span className="text-[10px] text-cyan-400/70 font-bold uppercase mr-2">Run Time</span>
                                <span className="text-xl font-black orbitron text-cyan-300">{calculateTotalHours(c1Logs).toFixed(2)} <span className="text-xs">HRS</span></span>
                            </div>
                        </div>

                        {/* Chipper 2 */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                <h3 className="font-bold text-cyan-300 orbitron text-sm">CHIPPER 02</h3>
                                <GlassButton size="sm" onClick={() => addLog(2)} icon={<span>+</span>}>Entry</GlassButton>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {c2Logs.map((log) => (
                                    <div key={log.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-3 relative group">
                                        <button
                                            onClick={() => removeLog(2, log.id)}
                                            className="absolute -top-2 -right-2 bg-red-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <GlassInput label="Start" type="time" value={log.start} onChange={(e) => updateLog(2, log.id, 'start', e.target.value)} />
                                            <GlassInput label="Stop" type="time" value={log.stop} onChange={(e) => updateLog(2, log.id, 'stop', e.target.value)} />
                                        </div>
                                        <GlassSelect
                                            label="Status / Reason"
                                            value={log.reason}
                                            onChange={(e) => updateLog(2, log.id, 'reason', e.target.value)}
                                            options={reasonsOptions}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-cyan-900/10 p-3 rounded border border-cyan-500/20 text-right">
                                <span className="text-[10px] text-cyan-400/70 font-bold uppercase mr-2">Run Time</span>
                                <span className="text-xl font-black orbitron text-cyan-300">{calculateTotalHours(c2Logs).toFixed(2)} <span className="text-xs">HRS</span></span>
                            </div>
                        </div>

                    </div>
                </GlassCard>

                {/* Right Column: Production & Bunkers */}
                <div className="space-y-8">

                    {/* Calculated Production */}
                    <GlassCard className="from-cyan-900/10 to-transparent bg-gradient-to-br border-t border-cyan-500/30">
                        <h2 className="text-cyan-400 text-sm font-bold orbitron mb-6 uppercase tracking-widest flex items-center">
                            <span className="w-1.5 h-4 bg-cyan-400 mr-3 animate-pulse"></span>
                            Production Metrics
                        </h2>

                        <div className="flex flex-col gap-6">
                            <div>
                                <GlassInput
                                    label="Avg Cut (Ton/Hr)"
                                    type="number"
                                    step="0.1"
                                    value={avgWoodCut}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setAvgWoodCut(val);
                                        saveToFirebase('metrics/avgWoodCut', val);
                                    }}
                                    className="text-lg font-bold text-cyan-300"
                                />
                            </div>

                            <div className="bg-black/30 p-6 rounded-xl border border-white/5 flex justify-between items-center shadow-inner">
                                <span className="text-xs font-bold text-slate-500 orbitron">ESTIMATED TOTAL</span>
                                <div className="text-right">
                                    <span className="text-5xl font-black orbitron text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {productionAmount}
                                    </span>
                                    <span className="text-cyan-500 font-bold ml-2">TONS</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Bunkers */}
                    <GlassCard title="Storage Bunkers">
                        <div className="flex justify-around items-end h-64 pt-8">
                            <div className="flex flex-col items-center space-y-6">
                                <BunkerBar label="Bunker 01" percentage={bunker1} />
                                <div className="w-24">
                                    <GlassInput
                                        type="number"
                                        value={bunker1}
                                        onChange={(e) => handleBunkerChange(1, parseInt(e.target.value))}
                                        className="text-center font-bold"
                                    />
                                </div>
                            </div>
                            <div className="h-40 w-[1px] bg-slate-700/50"></div>
                            <div className="flex flex-col items-center space-y-6">
                                <BunkerBar label="Bunker 02" percentage={bunker2} />
                                <div className="w-24">
                                    <GlassInput
                                        type="number"
                                        value={bunker2}
                                        onChange={(e) => handleBunkerChange(2, parseInt(e.target.value))}
                                        className="text-center font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                </div>
            </div>

            {/* Weight Scale & Checklist */}
            <GlassCard title="Weight Bridge & Checks" icon={<span>⚖️</span>}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-black/40 p-4 rounded-xl border border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-center">
                        <label className="text-[10px] text-slate-500 font-bold orbitron mb-2 tracking-widest block text-center">LIVE FEED (TONS)</label>
                        <input
                            type="text"
                            value={weightScale}
                            onChange={(e) => {
                                setWeightScale(e.target.value);
                                saveToFirebase('scale/currentWeight', e.target.value);
                            }}
                            className="bg-transparent text-center text-4xl font-black text-green-400 orbitron outline-none w-full tracking-tighter"
                        />
                        <div className="text-center text-[10px] text-slate-600 mt-2 flex items-center justify-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                            CONNECTED
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center space-x-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:bg-cyan-900/10 hover:border-cyan-500/30 cursor-pointer transition-all group">
                                <input type="checkbox" className="w-5 h-5 accent-cyan-500 rounded bg-slate-800 border-slate-600" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Cleaning Completed</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:bg-cyan-900/10 hover:border-cyan-500/30 cursor-pointer transition-all group">
                                <input type="checkbox" className="w-5 h-5 accent-cyan-500 rounded bg-slate-800 border-slate-600" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Belt Tension Verified</span>
                            </label>
                        </div>
                        <textarea
                            placeholder="Log any issues, maintenance notes, or remarks here..."
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300 h-24 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all resize-none placeholder-slate-600"
                        ></textarea>
                    </div>
                </div>
            </GlassCard>

            {/* Footer Controls */}
            <GlassCard className="border-t-4 border-t-cyan-500/30 sticky bottom-4 z-50 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="w-full sm:w-auto">
                        <GlassSelect
                            label="Supervisor Authentication"
                            value={supervisor}
                            onChange={(e) => {
                                setSupervisor(e.target.value);
                                saveToFirebase('shift/supervisor', e.target.value);
                            }}
                            options={authorizedStaff.map(e => ({ label: e.name, value: e.name }))}
                            className="min-w-[300px]"
                        />
                    </div>
                    <div className="flex space-x-4 w-full sm:w-auto">
                        <GlassButton className="flex-1 sm:flex-none">Save Record</GlassButton>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default ProductionEntry;
