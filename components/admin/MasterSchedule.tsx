
import React, { useState, useEffect, useCallback } from 'react';
import { Employee } from '../../types';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';
import NeonCard from '../NeonCard';

interface MasterScheduleProps {
  employees: Employee[];
  rosterMonth: number;
  rosterYear: number;
}

const MasterSchedule: React.FC<MasterScheduleProps> = ({ employees, rosterMonth, rosterYear }) => {
  const [isScheduleEditing, setIsScheduleEditing] = useState(false);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);

  const scheduleKey = `${rosterYear}-${rosterMonth}`;

  useEffect(() => {
    if (!isScheduleEditing && employees && employees.length > 0) {
      setLocalEmployees(JSON.parse(JSON.stringify(employees)));
    }
  }, [employees, isScheduleEditing, rosterMonth, rosterYear]);

  const monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const updateMasterScheduleCell = useCallback((empIdx: number, dayIdx: number, value: string) => {
    setLocalEmployees(prev => {
      const updated = [...prev];
      if (!updated[empIdx]) return prev;
      
      const schedules = updated[empIdx].schedules || {};
      const currentMonthSchedule = [...(schedules[scheduleKey] || Array(31).fill('-'))];
      
      const cleaned = value.trim().toUpperCase();
      const char = cleaned.length > 0 ? cleaned.slice(-1) : '-';
      
      currentMonthSchedule[dayIdx] = char;
      updated[empIdx] = { 
        ...updated[empIdx], 
        schedules: { ...schedules, [scheduleKey]: currentMonthSchedule } 
      };
      return updated;
    });
  }, [scheduleKey]);

  const updateEmployeeName = useCallback((empIdx: number, newName: string) => {
    setLocalEmployees(prev => {
      const updated = [...prev];
      if (!updated[empIdx]) return prev;
      updated[empIdx] = { ...updated[empIdx], name: newName };
      return updated;
    });
  }, []);

  const saveMasterSchedule = () => {
    set(ref(db, 'employees'), localEmployees)
      .then(() => {
        alert(`Master Schedule and Employee Data Committed Successfully!`);
        setIsScheduleEditing(false);
      })
      .catch((err) => alert("Error: " + err.message));
  };
  
  const updateMonth = (val: number) => set(ref(db, 'rosterMonth'), val);
  const updateYear = (val: number) => set(ref(db, 'rosterYear'), val);

  const renderRosterEditRows = (startIndex: number, count: number) => {
    return localEmployees.slice(startIndex, startIndex + count).map((emp, idx) => {
      const realIdx = startIndex + idx;
      return (
        <tr key={emp.id} className="border-b border-slate-800 hover:bg-cyan-500/5 transition-colors group text-[10px]">
          <td className="p-2 border border-slate-800 text-center font-bold text-slate-500">{realIdx + 1}</td>
          <td className="p-1 border border-slate-800 min-w-[150px]">
            <input 
              type="text"
              disabled={!isScheduleEditing}
              value={emp.name}
              onChange={(e) => updateEmployeeName(realIdx, e.target.value)}
              className={`w-full bg-transparent px-2 font-bold text-slate-200 focus:bg-slate-900 focus:outline-none ${!isScheduleEditing ? 'cursor-not-allowed border-none' : 'cursor-text border border-cyan-700 rounded bg-cyan-900/20'}`}
            />
          </td>
          {dayArray.map((day) => {
            const val = emp.schedules?.[scheduleKey]?.[day-1] || '-';
            const isRest = val === 'R';
            return (
              <td key={day} className={`p-0 border border-slate-800 min-w-[30px] ${isRest ? 'bg-red-700' : ''}`}>
                <input 
                  type="text"
                  disabled={!isScheduleEditing}
                  value={val}
                  onFocus={(e) => isScheduleEditing && e.target.select()}
                  onChange={(e) => updateMasterScheduleCell(realIdx, day-1, e.target.value)}
                  className={`w-full h-full bg-transparent text-center font-black ${isRest ? 'text-white' : 'text-slate-300'} focus:bg-cyan-900/20 focus:outline-none uppercase ${!isScheduleEditing ? 'cursor-not-allowed opacity-60 select-none' : 'cursor-text bg-slate-900/50'}`}
                />
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <NeonCard>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold orbitron text-slate-200 uppercase">Master Schedule Editor</h2>
        </div>
        <div className="flex items-center gap-4">
          <select value={rosterMonth} onChange={(e) => updateMonth(parseInt(e.target.value))} className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 orbitron">
            {monthsFull.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={rosterYear} onChange={(e) => updateYear(parseInt(e.target.value))} className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 orbitron">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-300 font-bold">
              <th className="p-2 border border-slate-700">S.N</th>
              <th className="p-2 border border-slate-700 text-left">Employee Name</th>
              {dayArray.map(d => <th key={d} className="p-1 border border-slate-700 min-w-[30px] text-[10px]">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {renderRosterEditRows(0, localEmployees.length)}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => setIsScheduleEditing(!isScheduleEditing)}
          className={`flex-1 py-3 rounded-lg text-xs font-black orbitron border-2 transition-all duration-300 ${
            isScheduleEditing 
              ? 'bg-amber-500/80 text-white border-amber-400/50 shadow-lg' 
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/40'
          }`}
        >
          {isScheduleEditing ? '🔒 VIEW MODE' : '✏️ EDIT MODE'}
        </button>
        <button 
          onClick={saveMasterSchedule} 
          disabled={!isScheduleEditing}
          className={`flex-1 py-3 font-black orbitron rounded-lg shadow-xl transition-all uppercase border-2 text-xs ${
            isScheduleEditing 
              ? 'bg-green-600/80 text-white border-green-500/50 hover:bg-green-600' 
              : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
          }`}
        >
          COMMIT CHANGES
        </button>
      </div>
    </NeonCard>
  );
};

export default MasterSchedule;
