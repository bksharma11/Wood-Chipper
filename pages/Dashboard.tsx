import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

import { Employee, NotificationConfig, LeaveRequest, ShiftSwapRequest } from '../types';
import ShiftCard from '../components/schedule/ShiftCard';
import LeaveCheck from '../components/schedule/LeaveCheck';
import LeaveRequestSystem from '../components/LeaveRequestSystem';
import ShiftSwapRequestSystem from '../components/ShiftSwapRequestSystem';
import RequestStatusViewer from '../components/RequestStatusViewer';
import GlassCard from '../components/ui/GlassCard';

import WoodMixingCalculator from '../components/WoodMixingCalculator';

interface DashboardProps {
    employees: Employee[];
    notifications: NotificationConfig[];
    leaveRequests: LeaveRequest[];
    shiftSwapRequests: ShiftSwapRequest[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees, notifications, leaveRequests, shiftSwapRequests }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedEmpId, setSelectedEmpId] = useState<string>('');
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    // Environment State
    const [weather, setWeather] = useState<{ temp: string, humidity: string, condition: string, location?: string }>({ temp: '--', humidity: '--', condition: 'Sunny', location: 'Loading...' });

    // Real Data Fetching
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        const envRef = ref(db, 'environment');

        const unsubEnv = onValue(envRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setWeather(data);
        });

        if (!selectedEmpId && employees.length > 0) {
            setSelectedEmpId(employees[0].id);
        }

        return () => {
            clearInterval(timer);
            unsubEnv();
        };
    }, [employees, selectedEmpId]);

    const currentUser = employees.find(e => e.id === selectedEmpId);
    const todaysDateObj = new Date();
    const currentDay = todaysDateObj.getDate();
    const scheduleKey = `${todaysDateObj.getFullYear()}-${todaysDateObj.getMonth()}`;

    // --- Calculate Daily Deployment For TODAY ---
    const getDailyDeployment = () => {
        const deployment = { A: [] as string[], B: [] as string[], C: [] as string[], General: [] as string[] };
        employees.forEach(emp => {
            const code = emp.schedules?.[scheduleKey]?.[currentDay - 1];
            if (code === 'A') deployment.A.push(emp.name);
            else if (code === 'B') deployment.B.push(emp.name);
            else if (code === 'C') deployment.C.push(emp.name);
            else if (code === 'G') deployment.General.push(emp.name);
        });
        return deployment;
    };

    const todayShifts = getDailyDeployment();

    // --- Shift Timer Logic ---
    const getShiftStatus = () => {
        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const totalMins = currentH * 60 + currentM;

        let shift = 'C';
        let startMins = 22 * 60;
        let endMins = 6 * 60;

        if (totalMins >= 360 && totalMins < 840) {
            shift = 'A';
            startMins = 360;
            endMins = 840;
        }
        else if (totalMins >= 840 && totalMins < 1320) {
            shift = 'B';
            startMins = 840;
            endMins = 1320;
        }
        else {
            shift = 'C';
            if (totalMins >= 1320) {
                startMins = 1320;
                endMins = 1440 + 360;
            } else {
                startMins = -120;
                endMins = 360;
            }
        }

        const currentProgressMins = (totalMins < startMins ? totalMins + 1440 : totalMins) - startMins;
        const totalDuration = 480;
        const percent = Math.min(100, Math.max(0, (currentProgressMins / totalDuration) * 100));

        const remainingMins = totalDuration - currentProgressMins;
        const hrs = Math.floor(remainingMins / 60);
        const mins = remainingMins % 60;
        const timeLeft = `${hrs}h ${mins}m`;

        return { shift, percent, timeLeft };
    };

    const { shift, percent, timeLeft } = getShiftStatus();
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const getWeatherIcon = (cond: string) => {
        if (cond === 'Rainy') return '🌧️';
        if (cond === 'Stormy') return '⛈️';
        if (cond === 'Cloudy') return '☁️';
        return '☀️';
    };

    return (
        <div className="space-y-8 animate-slideUp pb-12 relative min-h-screen">
            {/* 1. Header: Clock & Weather */}
            <div className="relative z-10 flex flex-col items-center space-y-8 pt-6 pb-12 border-b border-white/5">

                {/* Top Bar: Weather Widget */}
                <div className="flex justify-center w-full relative">
                    <div className="flex items-center space-x-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all">
                        <div className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{getWeatherIcon(weather.condition)}</div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white orbitron leading-none">{weather.temp}°C</span>
                            <div className="flex items-center space-x-3 text-[10px] uppercase font-bold text-slate-400 mt-1">
                                <span className="flex items-center gap-1">💧 {weather.humidity}%</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span className="text-cyan-400 flex items-center gap-1">📍 {weather.location || 'Factory'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Clock & Timer Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                    <div className="text-center">
                        <div className="text-7xl md:text-9xl font-black font-mono-tech text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] tracking-tighter leading-none">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-lg md:text-xl text-slate-400 font-bold orbitron tracking-[0.5em] uppercase mt-4">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
                        <svg className="transform -rotate-90 w-48 h-48 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 - (percent / 100) * 2 * Math.PI * 80} className={`text-cyan-400 transition-all duration-1000 ease-linear ${percent > 90 ? 'text-red-500 animate-pulse' : ''}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Shift {shift}</span>
                            <span className="text-3xl font-black text-white orbitron">{timeLeft}</span>
                            <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">Remaining</span>
                        </div>
                    </div>
                </div>

                {/* Notifications Marquee */}
                {notifications.length > 0 && (
                    <div className="w-full max-w-5xl mx-auto px-4">
                        <div className="relative overflow-hidden rounded-full border border-cyan-500/20 bg-cyan-950/20 py-2">
                            <div className="animate-marquee whitespace-nowrap text-cyan-300 text-xs font-black uppercase tracking-[0.2em] flex gap-12">
                                {notifications.map(n => (
                                    <span key={n.id}>📢 {n.text}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Main Content: Deployment & Tools */}
            <div className="px-4 md:px-12 space-y-12 mb-12">

                {/* Section A: Factory Deployment */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black orbitron text-white uppercase tracking-widest flex items-center">
                            <span className="w-1 h-6 bg-cyan-400 mr-3 shadow-[0_0_10px_theme(colors.cyan.400)]"></span>
                            Factory Deployment Today
                        </h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold uppercase tracking-widest px-4 py-2 rounded shadow transition-all orbitron text-xs ml-4"
                            >
                                🔎 Status
                            </button>
                            <button
                                onClick={() => setShowLeaveModal(true)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest px-4 py-2 rounded shadow-[0_0_15px_theme(colors.cyan.600)] transition-all orbitron text-xs"
                            >
                                + Apply Leave
                            </button>
                            <button
                                onClick={() => setShowSwapModal(true)}
                                className="bg-purple-600 hover:bg-purple-500 text-black font-bold uppercase tracking-widest px-4 py-2 rounded shadow-[0_0_15px_theme(colors.purple.600)] transition-all orbitron text-xs"
                            >
                                ⇄ Swap Shift
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ShiftCard label="A" data={{ supervisor: todayShifts.A[0], chipper1: todayShifts.A[1], chipper2: todayShifts.A[2] }} />
                        <ShiftCard label="B" data={{ supervisor: todayShifts.B[0], chipper1: todayShifts.B[1], chipper2: todayShifts.B[2] }} />
                        <ShiftCard label="C" data={{ supervisor: todayShifts.C[0], chipper1: todayShifts.C[1], chipper2: todayShifts.C[2] }} />
                        <ShiftCard label="General" data={{ supervisor: todayShifts.General[0], chipper1: todayShifts.General[1], chipper2: todayShifts.General[2] }} />
                    </div>
                </div>

                {/* Section B: Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <WoodMixingCalculator />
                    <LeaveCheck employees={employees} isAdmin={false} />
                </div>
            </div>

            {/* Modal: Leave Application */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-4xl relative">
                        <button
                            onClick={() => setShowLeaveModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-red-400 font-bold uppercase tracking-widest orbitron"
                        >
                            [ Close X ]
                        </button>
                        <LeaveRequestSystem employees={employees} />
                    </div>
                </div>
            )}

            {/* Modal: Shift Swap Request */}
            {showSwapModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-4xl relative">
                        <button
                            onClick={() => setShowSwapModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-red-400 font-bold uppercase tracking-widest orbitron"
                        >
                            [ Close X ]
                        </button>
                        <ShiftSwapRequestSystem employees={employees} />
                    </div>
                </div>
            )}

            {/* Modal: Status Checker */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-2xl relative">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-red-400 font-bold uppercase tracking-widest orbitron"
                        >
                            [ Close X ]
                        </button>
                        <RequestStatusViewer leaveRequests={leaveRequests} shiftSwapRequests={shiftSwapRequests} employees={employees} />
                    </div>
                </div>
            )}

            {/* Styles */}
            <style>{`
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .font-mono-tech { font-family: 'Share Tech Mono', monospace; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      `}</style>
            <div className="fixed inset-0 cyber-grid z-[-1] opacity-30 pointer-events-none"></div>
            <div className="fixed inset-0 scanlines z-[-1] opacity-50 pointer-events-none"></div>
        </div>
    );
};

export default Dashboard;
