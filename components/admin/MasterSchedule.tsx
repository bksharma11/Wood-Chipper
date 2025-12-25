
import React, { useState, useEffect, useCallback } from 'react';
import { Employee } from '../../types';
import { db } from '../../firebase';
import { ref, set } from 'firebase/database';

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

  const saveMasterSchedule = () => {
    set(ref(db, 'employees'), localEmployees)
      .then(() => {
        alert(`Master Schedule Committed Successfully!`);
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
        <tr key={emp.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors group text-[10px]">
          <td className="p-2 border border-slate-700 text-center font-bold text-slate-500">{realIdx + 1}</td>
          <td className="p-2 border border-slate-700 font-bold text-slate-100 whitespace-nowrap min-w-[150px]">{emp.name}</td>
          {dayArray.map((day) => {
            const val = emp.schedules?.[scheduleKey]?.[day-1] || '-';
            const isRest = val === 'R';
            return (
              <td key={day} className={`p-0 border border-slate-700 min-w-[30px] ${isRest ? 'bg-red-600' : ''}`}>
                <input 
                  type="text"
                  disabled={!isScheduleEditing}
                  value={val}
                  onFocus={(e) => isScheduleEditing && e.target.select()}
                  onChange={(e) => updateMasterScheduleCell(realIdx, day-1, e.target.value)}
                  className={`w-full h-full bg-transparent text-center font-black ${isRest ? 'text-white' : 'text-slate-300'} focus:bg-blue-900 focus:outline-none uppercase ${!isScheduleEditing ? 'cursor-not-allowed opacity-40 select-none' : 'cursor-text bg-white/10'}`}
                />
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold orbitron text-slate-200">Master Schedule (Patterns)</h2>
          <button 
            onClick={() => setIsScheduleEditing(!isScheduleEditing)}
            className={`px-6 py-2 rounded-lg text-[11px] font-black orbitron border-2 transition-all duration-300 ${
              isScheduleEditing 
                ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse' 
                : 'silver-gradient text-slate-900 border-white hover:brightness-110'
            }`}
          >
            {isScheduleEditing ? '🔒 LOCK EDITOR' : '✏️ ENABLE EDITING'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <select value={rosterMonth} onChange={(e) => updateMonth(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white orbitron">
            {monthsFull.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={rosterYear} onChange={(e) => updateYear(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white orbitron">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto roster-scrollbar rounded border border-slate-700">
        <table className="w-full text-xs border-collapse bg-black/30">
          <thead>
            <tr className="bg-slate-800/80 text-white font-bold">
              <th className="p-2 border border-slate-700">S.N</th>
              <th className="p-2 border border-slate-700 text-left">Employee Name</th>
              {dayArray.map(d => <th key={d} className="p-1 border border-slate-700 min-w-[30px] text-[10px]">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {renderRosterEditRows(0, 7)}
            <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
            {renderRosterEditRows(7, 2)}
            <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
            {renderRosterEditRows(9, 4)}
            <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
            {renderRosterEditRows(13, 1)}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={saveMasterSchedule} 
          disabled={!isScheduleEditing}
          className={`w-full py-4 font-black orbitron rounded-lg shadow-2xl transition-all uppercase border-2 ${
            isScheduleEditing 
              ? 'bg-blue-600 text-white border-blue-400 hover:bg-blue-500' 
              : 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed'
          }`}
        >
          COMMIT MASTER SCHEDULE
        </button>
      </div>
    </section>
  );
};

export default MasterSchedule;
