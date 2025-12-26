
import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import BunkerBar from '../components/production/BunkerBar';
import NeonCard from '../components/NeonCard';

interface ProductionPageProps {
  employees: Employee[];
}

const ProductionPage: React.FC<ProductionPageProps> = ({ employees }) => {
  const [c1Start, setC1Start] = useState('08:00');
  const [c1Stop, setC1Stop] = useState('16:00');
  const [c2Start, setC2Start] = useState('08:00');
  const [c2Stop, setC2Stop] = useState('17:30');
  const [avgWoodCut, setAvgWoodCut] = useState(2.5);
  const [bunker1, setBunker1] = useState(45);
  const [bunker2, setBunker2] = useState(15);
  const [weightScale, setWeightScale] = useState('1245.50');
  
  const authorizedStaff = (employees || []).filter(e => e.role === 'SUPERVISOR' || e.role === 'INCHARGE');
  const [supervisor, setSupervisor] = useState(authorizedStaff[0]?.name || '');

  const calculateHours = (start: string, stop: string) => {
    const s = new Date(`2000-01-01T${start}:00`);
    const e = new Date(`2000-01-01T${stop}:00`);
    let diff = (e.getTime() - s.getTime()) / 1000 / 3600;
    if (diff < 0) diff += 24;
    return diff;
  };

  const totalTime = calculateHours(c1Start, c1Stop) + calculateHours(c2Start, c2Stop);
  const productionAmount = (totalTime * avgWoodCut).toFixed(2);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chipper Logs */}
        <NeonCard>
          <h2 className="text-2xl font-bold mb-6 orbitron text-slate-200 flex items-center">
            <span className="w-2 h-8 bg-cyan-400 mr-3 shadow-[0_0_8px_theme(colors.cyan.400)]"></span>
            Chipper Logs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <h3 className="font-bold text-slate-300 uppercase text-sm mb-4">Chipper 1</h3>
              <div>
                <label className="block text-xs text-slate-500 mb-1">START TIME</label>
                <input type="time" value={c1Start} onChange={(e) => setC1Start(e.target.value)} className="w-full bg-slate-800/70 border border-slate-700 p-2 rounded text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">STOP TIME</label>
                <input type="time" value={c1Stop} onChange={(e) => setC1Stop(e.target.value)} className="w-full bg-slate-800/70 border border-slate-700 p-2 rounded text-white" />
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-[10px] text-slate-500">RUNNING TIME</p>
                <p className="text-xl font-bold orbitron text-cyan-400">{calculateHours(c1Start, c1Stop).toFixed(2)} hrs</p>
              </div>
            </div>
            
            <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <h3 className="font-bold text-slate-300 uppercase text-sm mb-4">Chipper 2</h3>
              <div>
                <label className="block text-xs text-slate-500 mb-1">START TIME</label>
                <input type="time" value={c2Start} onChange={(e) => setC2Start(e.target.value)} className="w-full bg-slate-800/70 border border-slate-700 p-2 rounded text-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">STOP TIME</label>
                <input type="time" value={c2Stop} onChange={(e) => setC2Stop(e.target.value)} className="w-full bg-slate-800/70 border border-slate-700 p-2 rounded text-white" />
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-[10px] text-slate-500">RUNNING TIME</p>
                <p className="text-xl font-bold orbitron text-cyan-400">{calculateHours(c2Start, c2Stop).toFixed(2)} hrs</p>
              </div>
            </div>
          </div>
        </NeonCard>

        {/* Wood Production & Bunkers */}
        <div className="space-y-8">
          <NeonCard className="bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <h2 className="text-cyan-300 text-sm font-bold orbitron mb-4 uppercase">Calculated Wood Production</h2>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <label className="block text-[10px] text-cyan-400/70 font-bold mb-1 uppercase tracking-wider">Avg Wood Cut (Ton/Hour)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={avgWoodCut} 
                    onChange={(e) => setAvgWoodCut(parseFloat(e.target.value) || 0)} 
                    className="bg-slate-900/50 border border-cyan-500/30 rounded p-2 text-white font-bold w-32 focus:outline-none focus:ring-2 focus:ring-cyan-400" 
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-cyan-400/70 font-bold uppercase">Total Production</p>
                  <p className="text-6xl font-black text-white orbitron">
                    {productionAmount} <span className="text-2xl text-cyan-400">TONS</span>
                  </p>
                </div>
              </div>
          </NeonCard>

          <NeonCard>
            <h2 className="text-xl font-bold mb-6 orbitron text-slate-200">Bunker Status</h2>
            <div className="space-y-8">
              <BunkerBar label="Bunker 1" percentage={bunker1} />
              <input type="range" value={bunker1} onChange={(e) => setBunker1(parseInt(e.target.value))} className="w-full accent-cyan-400" />
              <BunkerBar label="Bunker 2" percentage={bunker2} />
              <input type="range" value={bunker2} onChange={(e) => setBunker2(parseInt(e.target.value))} className="w-full accent-cyan-400" />
            </div>
          </NeonCard>
        </div>
      </div>

      <NeonCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-xs text-slate-400 mb-2 orbitron">WEIGHT SCALE (TONS)</label>
            <input 
              type="text" 
              value={weightScale}
              onChange={(e) => setWeightScale(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 p-4 rounded text-3xl font-black text-white orbitron shadow-inner focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="md:col-span-2 flex flex-col justify-end space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-green-500" />
                <span className="text-sm font-bold text-slate-300">Cleaning Checklist Completed</span>
              </label>
              <label className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-green-500" />
                <span className="text-sm font-bold text-slate-300">Belt Tension Verified</span>
              </label>
            </div>
            <textarea placeholder="Description / Issues..." className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-slate-300 text-sm h-24 focus:outline-none focus:border-cyan-500"></textarea>
          </div>
        </div>
      </NeonCard>

      <NeonCard>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <label className="text-xs text-slate-400 orbitron uppercase">Supervisor/Incharge Sign-Off:</label>
            <select 
              value={supervisor} 
              onChange={(e) => setSupervisor(e.target.value)}
              className="bg-slate-800 border border-slate-600 p-2 rounded text-slate-200"
            >
              {authorizedStaff.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <div className="flex space-x-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none py-3 px-8 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/40 font-bold orbitron transition-all">
              PRINT PDF (A4)
            </button>
            <button className="flex-1 sm:flex-none py-3 px-8 bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/40 font-bold orbitron transition-all">
              SAVE REPORT
            </button>
          </div>
        </div>
      </NeonCard>
    </div>
  );
};

export default ProductionPage;
