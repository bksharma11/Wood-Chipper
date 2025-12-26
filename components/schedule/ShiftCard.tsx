
import React from 'react';
import { ShiftData } from '../../types';
import NeonCard from '../NeonCard';

interface ShiftCardProps {
  label: string;
  data: ShiftData;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ label, data }) => {
  const hasData = data && (data.supervisor || data.chipper1 || data.chipper2);
  if (!hasData) return null;

  const labels = label === 'General' 
    ? { s: 'Supervisor', c1: 'Incharge', c2: 'Operator' }
    : { s: 'Supervisor', c1: 'Chipper 1 Op.', c2: 'Chipper 2 Op.' };

  return (
    <NeonCard>
      <div className="absolute top-2 right-4 p-2 text-[10px] text-slate-600 orbitron uppercase font-bold">SHFT_{label}</div>
      <h3 className="text-xl font-bold mb-4 text-slate-200 orbitron border-b border-slate-700/50 pb-2">Shift {label}</h3>
      <div className="space-y-3">
        {data.supervisor && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{labels.s}</p>
            <p className="font-bold text-lg text-cyan-300">{data.supervisor}</p>
          </div>
        )}
        {data.chipper1 && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{labels.c1}</p>
            <p className="text-slate-300 text-sm">{data.chipper1}</p>
          </div>
        )}
        {data.chipper2 && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{labels.c2}</p>
            <p className="text-slate-300 text-sm">{data.chipper2}</p>
          </div>
        )}
      </div>
    </NeonCard>
  );
};

export default ShiftCard;
