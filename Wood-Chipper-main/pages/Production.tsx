import React, { useState } from 'react';
import { Employee } from '../types';
import ProductionEntry from '../components/production/ProductionEntry';
import ProductionReport from '../components/production/ProductionReport';

interface ProductionPageProps {
  employees: Employee[];
}

const ProductionPage: React.FC<ProductionPageProps> = ({ employees }) => {
  const [viewMode, setViewMode] = useState<'ENTRY' | 'REPORT'>('ENTRY');

  return (
    <div className="space-y-8 animate-fadeIn pb-12">

      {/* Header with Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black orbitron text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Production <span className="text-cyan-400">{viewMode === 'ENTRY' ? 'Control' : 'Reports'}</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 ml-1">
            {viewMode === 'ENTRY' ? 'Live Data Entry System' : 'Historical Analysis & Stoppage Logs'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('ENTRY')}
            className={`flex items-center gap-2 px-6 py-2 rounded font-bold uppercase text-xs tracking-wider transition-all orbitron
                ${viewMode === 'ENTRY' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            <span>⚡ Live Entry</span>
          </button>
          <button
            onClick={() => setViewMode('REPORT')}
            className={`flex items-center gap-2 px-6 py-2 rounded font-bold uppercase text-xs tracking-wider transition-all orbitron
                ${viewMode === 'REPORT' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-white'}`}
          >
            <span>📊 Reports</span>
          </button>
        </div>
      </div>

      {/* Content Switcher */}
      {viewMode === 'ENTRY' ? (
        <ProductionEntry employees={employees} />
      ) : (
        <ProductionReport />
      )}

    </div>
  );
};

export default ProductionPage;
