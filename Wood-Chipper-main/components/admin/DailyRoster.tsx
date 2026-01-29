
import React, { useState } from 'react';
import { Employee, Shifts, DailyShifts } from '../../types';
import { INITIAL_SHIFTS } from '../../constants';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';
import NeonCard from '../NeonCard';

interface DailyRosterProps {
  employees: Employee[];
  dailyShiftHistory: DailyShifts;
}

const DailyRoster: React.FC<DailyRosterProps> = ({ employees, dailyShiftHistory }) => {
  const [rosterDate, setRosterDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempShifts, setTempShifts] = useState<Shifts>(dailyShiftHistory[new Date().toISOString().split('T')[0]] || JSON.parse(JSON.stringify(INITIAL_SHIFTS)));

  const handleDateChange = (date: string) => {
    setRosterDate(date);
    setTempShifts(dailyShiftHistory[date] || JSON.parse(JSON.stringify(INITIAL_SHIFTS)));
  };

  const updateRoster = () => {
    set(ref(db, `dailyShiftHistory/${rosterDate}`), tempShifts)
      .then(() => alert(`Daily Roster for ${rosterDate} updated!`))
      .catch((err) => alert("Error: " + err.message));
  };

  return (
    <NeonCard>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold orbitron text-slate-200">Daily Supervisor Management</h2>
        <div className="flex flex-col items-end">
          <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Select Date</label>
          <input type="date" value={rosterDate} onChange={(e) => handleDateChange(e.target.value)} className="bg-slate-900/70 border border-slate-700 p-2 rounded text-xs text-white orbitron font-bold" />
        </div>
      </div>
      <div className="space-y-4 flex-grow">
        {(['A', 'B', 'C', 'General'] as const).map(s => {
          const labels = s === 'General' ? ['Supervisor', 'Incharge', 'Operator'] : ['Supervisor', 'Chipper 1', 'Chipper 2'];
          return (
            <div key={s} className="grid grid-cols-4 gap-2 items-end bg-black/20 p-2 rounded border border-slate-800">
              <span className="font-bold text-slate-400 orbitron text-[10px] uppercase">SHIFT {s}</span>
              {['supervisor', 'chipper1', 'chipper2'].map((field, idx) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-[8px] text-slate-600 font-bold uppercase">{labels[idx]}</label>
                  <select 
                    value={tempShifts[s][field as keyof typeof tempShifts.A] || ''} 
                    onChange={(e) => setTempShifts({...tempShifts, [s]: {...tempShifts[s], [field]: e.target.value}})} 
                    className="bg-slate-900 border border-slate-700 p-1 rounded text-[10px] text-white"
                  >
                    <option value="">None</option>
                    {(employees || []).filter(e => e.name).map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button onClick={updateRoster} className="mt-6 w-full py-3 bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/40 font-bold orbitron transition-all uppercase text-xs">Update Daily Assignment</button>
    </NeonCard>
  );
};

export default DailyRoster;
