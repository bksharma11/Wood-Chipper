import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const ProductionReport: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock Data for Charts
    const hourlyProduction = [
        { time: '08:00', tons: 12.5 },
        { time: '09:00', tons: 14.2 },
        { time: '10:00', tons: 11.8 },
        { time: '11:00', tons: 15.0 },
        { time: '12:00', tons: 8.5 }, // Lunch?
        { time: '13:00', tons: 13.2 },
        { time: '14:00', tons: 14.8 },
        { time: '15:00', tons: 12.0 },
    ];

    const downtimeReasons = [
        { name: 'Running', value: 75, color: '#22d3ee' }, // Cyan-400
        { name: 'Mechanical', value: 10, color: '#ef4444' }, // Red-500
        { name: 'Electrical', value: 5, color: '#eab308' }, // Yellow-500
        { name: 'No Material', value: 10, color: '#64748b' }, // Slate-500
    ];

    const logs = [
        { id: 1, chipper: 'C1', start: '08:00', stop: '12:00', duration: '4h', reason: 'Running' },
        { id: 2, chipper: 'C2', start: '08:15', stop: '09:00', duration: '45m', reason: 'Mechanical' },
        { id: 3, chipper: 'C1', start: '13:00', stop: '17:00', duration: '4h', reason: 'Running' },
        { id: 4, chipper: 'C2', start: '09:30', stop: '17:00', duration: '7.5h', reason: 'Running' },
    ];

    return (
        <div className="space-y-8 animate-fadeIn pb-12">

            {/* Filters */}
            <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest orbitron">Select Date:</label>
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex gap-2">
                    <GlassButton variant="secondary" size="sm" icon={<span>📥</span>}>Export CSV</GlassButton>
                    <GlassButton variant="secondary" size="sm" icon={<span>🖨️</span>} onClick={() => window.print()}>Print PDF</GlassButton>
                </div>
            </GlassCard>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Production</span>
                    <span className="text-4xl font-black text-white orbitron">102.0 <span className="text-base text-cyan-400">Tons</span></span>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Runtime Efficiency</span>
                    <span className="text-4xl font-black text-green-400 orbitron">88%</span>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Downtime Losses</span>
                    <span className="text-4xl font-black text-red-400 orbitron">1.5 <span className="text-base">Hrs</span></span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hourly Production Graph */}
                <GlassCard title="Hourly Production Output">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyProduction}>
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#22d3ee' }}
                                />
                                <Bar dataKey="tons" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Stoppage Reason Pie Chart */}
                <GlassCard title="Shift Activity Distribution">
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={downtimeReasons}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {downtimeReasons.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* Detailed Table */}
            <GlassCard title="Detailed Shift Logs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-3">Chipper</th>
                                <th className="p-3">Start Time</th>
                                <th className="p-3">Stop Time</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Activity / Reason</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-800 text-slate-300">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-cyan-500/5 transition-colors">
                                    <td className="p-3 font-bold text-cyan-300">{log.chipper}</td>
                                    <td className="p-3 font-mono">{log.start}</td>
                                    <td className="p-3 font-mono">{log.stop}</td>
                                    <td className="p-3">{log.duration}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                                            ${log.reason === 'Running' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                log.reason === 'Mechanical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-slate-700/50 text-slate-400'}`}>
                                            {log.reason}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

        </div>
    );
};

export default ProductionReport;
