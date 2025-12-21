
import React, { useState, useEffect } from 'react';
import { Employee, Shifts, DailyShifts } from '../types';
import { INITIAL_SHIFTS } from '../constants';
import { NotificationConfig } from '../App';
import { db } from '../firebase';
import { ref, set, update } from 'firebase/database';

interface AdminPageProps {
  employees: Employee[];
  dailyShiftHistory: DailyShifts;
  notification: NotificationConfig;
  rosterMonth: number;
  rosterYear: number;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  employees, dailyShiftHistory, notification,
  rosterMonth, rosterYear
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');

  // Daily Shift Management State
  const [rosterDate, setRosterDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempShifts, setTempShifts] = useState<Shifts>(dailyShiftHistory[new Date().toISOString().split('T')[0]] || JSON.parse(JSON.stringify(INITIAL_SHIFTS)));
  const [historySearch, setHistorySearch] = useState('');

  // Master Roster Editor Local State (for editing before commit)
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([...employees]);

  // Sync localEmployees when global employees change
  useEffect(() => {
    setLocalEmployees([...employees]);
  }, [employees]);

  // Notification Banner Temp State
  const [tempNotification, setTempNotification] = useState<NotificationConfig>({ ...notification });

  // Employee Record State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [recordType, setRecordType] = useState<'Leave' | 'C-Off'>('Leave');
  const [cOffSubtype, setCOffSubtype] = useState<'Earned' | 'Taken'>('Earned');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordReason, setRecordReason] = useState('');

  const monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '967514') {
      setIsLocked(false);
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityAnswer.toUpperCase() === 'AARTI SHARMA') {
      setIsLocked(false);
      setShowForgot(false);
      setError('');
    } else {
      setError('Wrong answer. Reset failed.');
    }
  };

  const updateMasterScheduleCell = (empIdx: number, dayIdx: number, value: string) => {
    const updated = [...localEmployees];
    const schedule = [...(updated[empIdx].schedule || Array(31).fill('-'))];
    schedule[dayIdx] = value.toUpperCase();
    updated[empIdx] = { ...updated[empIdx], schedule };
    setLocalEmployees(updated);
  };

  const saveMasterSchedule = () => {
    set(ref(db, 'employees'), localEmployees)
      .then(() => alert(`Master Schedule for ${monthsFull[rosterMonth]} updated successfully!`))
      .catch((err) => alert("Error updating Firebase: " + err.message));
  };

  const handleDateChange = (date: string) => {
    setRosterDate(date);
    setTempShifts(dailyShiftHistory[date] || JSON.parse(JSON.stringify(INITIAL_SHIFTS)));
  };

  const updateRoster = () => {
    set(ref(db, `dailyShiftHistory/${rosterDate}`), tempShifts)
      .then(() => alert(`Roster for ${rosterDate} updated successfully!`))
      .catch((err) => alert("Error updating Firebase: " + err.message));
  };

  const deleteRoster = (date: string) => {
    if (window.confirm(`Delete roster for ${date}?`)) {
      set(ref(db, `dailyShiftHistory/${date}`), null);
    }
  };

  const saveNotification = () => {
    set(ref(db, 'notification'), tempNotification)
      .then(() => alert("Notification Banner Updated Successfully!"))
      .catch((err) => alert("Error updating Firebase: " + err.message));
  };

  const updateMonth = (val: number) => {
    set(ref(db, 'rosterMonth'), val);
  };

  const updateYear = (val: number) => {
    set(ref(db, 'rosterYear'), val);
  };

  const saveEmployeeRecord = () => {
    if (!selectedEmpId || !recordReason || !recordDate) {
      alert("Please fill all required fields.");
      return;
    }

    const newEmployees = employees.map(emp => {
      if (emp.id === selectedEmpId) {
        let updatedLeaves = emp.totalLeaves;
        let updatedCOff = emp.cOffBalance;
        let historyType: 'Leave' | 'C-Off Earned' | 'C-Off Taken';

        if (recordType === 'Leave') {
          updatedLeaves += 1;
          historyType = 'Leave';
        } else {
          if (cOffSubtype === 'Earned') {
            updatedCOff += 1;
            historyType = 'C-Off Earned';
          } else {
            updatedCOff -= 1;
            historyType = 'C-Off Taken';
          }
        }

        const newHistory = emp.history ? [...emp.history] : [];
        return {
          ...emp,
          totalLeaves: updatedLeaves,
          cOffBalance: updatedCOff,
          history: [{ date: recordDate, type: historyType, reason: recordReason }, ...newHistory]
        };
      }
      return emp;
    });

    set(ref(db, 'employees'), newEmployees)
      .then(() => {
        alert("Record Saved Successfully!");
        setRecordReason('');
      })
      .catch((err) => alert("Error updating Firebase: " + err.message));
  };

  const deleteEmployeeRecord = (empId: string, historyIdx: number) => {
    if (!window.confirm("Are you sure you want to delete this history entry?")) return;

    const newEmployees = employees.map(emp => {
      if (emp.id === empId) {
        const record = emp.history[historyIdx];
        let updatedLeaves = emp.totalLeaves;
        let updatedCOff = emp.cOffBalance;

        if (record.type === 'Leave') updatedLeaves -= 1;
        else if (record.type === 'C-Off Earned') updatedCOff -= 1;
        else if (record.type === 'C-Off Taken') updatedCOff += 1;

        const newHistory = emp.history.filter((_, i) => i !== historyIdx);
        return { ...emp, totalLeaves: updatedLeaves, cOffBalance: updatedCOff, history: newHistory };
      }
      return emp;
    });

    set(ref(db, 'employees'), newEmployees);
  };

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);

  const renderRosterEditGroup = (startIndex: number, endIndex: number) => {
    return localEmployees.slice(startIndex, endIndex).map((emp, idx) => {
      const realIdx = startIndex + idx;
      return (
        <tr key={emp.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors group text-[10px]">
          <td className="p-2 border border-slate-700 text-center font-bold text-slate-500">{realIdx + 1}</td>
          <td className="p-2 border border-slate-700 font-bold text-slate-100 whitespace-nowrap min-w-[150px]">{emp.name}</td>
          {dayArray.map((day) => {
            const val = emp.schedule?.[day-1] || '-';
            const isRest = val === 'R';
            return (
              <td key={day} className={`p-0 border border-slate-700 min-w-[30px] ${isRest ? 'bg-red-600' : ''}`}>
                <input 
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => updateMasterScheduleCell(realIdx, day-1, e.target.value)}
                  className={`w-full h-full bg-transparent text-center font-black ${isRest ? 'text-white' : 'text-slate-300'} focus:bg-blue-900 focus:outline-none uppercase`}
                />
              </td>
            );
          })}
        </tr>
      );
    });
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="brushed-metal p-10 rounded-2xl border border-slate-600 w-full max-md shadow-2xl">
          <h2 className="text-3xl font-black orbitron mb-6 text-center silver-gradient bg-clip-text text-transparent">SECURITY ACCESS</h2>
          {showForgot ? (
            <form onSubmit={handleReset} className="space-y-6">
              <p className="text-sm text-slate-400">Question: <span className="text-slate-100 font-bold italic">Favourite Person Name?</span></p>
              <input type="text" autoFocus placeholder="Answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-center font-bold text-white tracking-widest focus:ring-2 focus:ring-amber-500 outline-none" />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button type="submit" className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl">VERIFY ANSWER</button>
              <button onClick={() => setShowForgot(false)} className="w-full text-slate-500 text-xs uppercase hover:text-slate-300">Back to PIN</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" autoFocus maxLength={6} placeholder="••••••" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-center text-3xl font-black text-white tracking-[1rem] focus:ring-2 focus:ring-slate-500 outline-none" />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button type="submit" className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl">UNLOCK CONSOLE</button>
              <button type="button" onClick={() => setShowForgot(true)} className="w-full text-slate-500 text-xs uppercase hover:text-slate-300">Forgot PIN?</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black orbitron silver-gradient bg-clip-text text-transparent">ADMIN CONSOLE</h1>
        <button onClick={() => setIsLocked(true)} className="bg-red-900/40 text-red-400 border border-red-700/50 px-4 py-1 rounded text-xs font-bold uppercase orbitron">LOCK SYSTEM</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl space-y-4">
          <h2 className="text-xl font-bold mb-4 orbitron text-slate-200">Manage Notification Banner</h2>
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Banner Message</label>
            <textarea value={tempNotification.text} onChange={(e) => setTempNotification({ ...tempNotification, text: e.target.value })} className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white h-24 focus:ring-2 focus:ring-slate-500" placeholder="Enter ticker text..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Font Style</label>
              <select value={tempNotification.font} onChange={(e) => setTempNotification({ ...tempNotification, font: e.target.value })} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs mt-1">
                <option value="font-sans">Standard (Inter)</option>
                <option value="orbitron">Industrial (Orbitron)</option>
                <option value="gold-neon">Premium (Dancing Script)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Font Size</label>
              <select value={tempNotification.size} onChange={(e) => setTempNotification({ ...tempNotification, size: e.target.value })} className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs mt-1">
                <option value="text-[10px]">Extra Small</option>
                <option value="text-xs">Small (Default)</option>
                <option value="text-sm">Medium</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">Extra Large</option>
              </select>
            </div>
          </div>
          <button onClick={saveNotification} className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl hover:brightness-110 uppercase text-xs">Update Notification Banner</button>
        </section>

        <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold orbitron text-slate-200">Daily Supervisor Management</h2>
            <div className="flex flex-col items-end">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Select Date</label>
              <input type="date" value={rosterDate} onChange={(e) => handleDateChange(e.target.value)} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white orbitron font-bold" />
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
                      <select value={tempShifts[s][field as keyof typeof tempShifts.A]} onChange={(e) => setTempShifts({...tempShifts, [s]: {...tempShifts[s], [field]: e.target.value}})} className="bg-slate-900 border border-slate-700 p-1 rounded text-[10px] text-white">
                        <option value="">None</option>
                        {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <button onClick={updateRoster} className="mt-6 w-full py-3 bg-green-700 text-white font-bold orbitron rounded shadow-xl hover:bg-green-600 border border-green-500">UPDATE ROSTER FOR {rosterDate}</button>
        </section>
      </div>

      {/* NEW SECTION: Master Monthly Roster Editor */}
      <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold orbitron text-slate-200">Master Schedule (Monthly Update)</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
               <label className="text-[9px] text-slate-500 uppercase font-bold">Month</label>
               <select value={rosterMonth} onChange={(e) => updateMonth(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white orbitron">
                 {monthsFull.map((m, i) => <option key={m} value={i}>{m}</option>)}
               </select>
            </div>
            <div className="flex flex-col">
               <label className="text-[9px] text-slate-500 uppercase font-bold">Year</label>
               <select value={rosterYear} onChange={(e) => updateYear(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white orbitron">
                 {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
               </select>
            </div>
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
              {renderRosterEditGroup(0, 7)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterEditGroup(7, 9)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterEditGroup(9, 13)}
              <tr className="h-4 bg-slate-900/50"><td colSpan={100}></td></tr>
              {renderRosterEditGroup(13, 14)}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[10px] text-slate-500 italic">Enter Shift Codes: A, B, C, G (General), R (Rest)</p>
          <button onClick={saveMasterSchedule} className="w-full py-4 silver-gradient text-slate-900 font-black orbitron rounded-lg shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase">
            COMMIT MASTER SCHEDULE TO SYSTEM
          </button>
        </div>
      </section>

      <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold orbitron text-slate-200">Daily Roster History Log</h2>
          <input type="text" placeholder="Search Date..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white" />
        </div>
        <div className="max-h-60 overflow-y-auto roster-scrollbar rounded bg-black/40 border border-slate-800">
          <table className="w-full text-[10px]">
            <thead className="sticky top-0 bg-slate-900 text-slate-500 uppercase font-black">
              <tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">Status</th><th className="p-2 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {Object.keys(dailyShiftHistory).filter(d => d.includes(historySearch)).sort((a,b) => b.localeCompare(a)).map(date => (
                <tr key={date} className="border-b border-slate-800/50">
                  <td className="p-2 font-bold text-slate-300">{date}</td>
                  <td className="p-2"><span className="text-green-500">Active Roster</span></td>
                  <td className="p-2 text-right"><button onClick={() => deleteRoster(date)} className="text-red-500 hover:text-red-400 font-bold px-2">DELETE</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="brushed-metal p-8 rounded-xl border border-slate-600/50 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 orbitron text-slate-200 border-b border-slate-700 pb-4">Manage Employee Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <label className="text-xs text-slate-500 orbitron uppercase font-bold">Select Employee</label>
            <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-white focus:ring-2 focus:ring-slate-500">
              <option value="">-- Choose Employee --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
            </select>
            <div className="flex space-x-4">
              <button onClick={() => setRecordType('Leave')} className={`flex-1 py-3 rounded orbitron font-bold border ${recordType === 'Leave' ? 'silver-gradient text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}>LEAVE</button>
              <button onClick={() => setRecordType('C-Off')} className={`flex-1 py-3 rounded orbitron font-bold border ${recordType === 'C-Off' ? 'silver-gradient text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}>C-OFF</button>
            </div>
            {selectedEmployee && (
              <div className="mt-8">
                <h4 className="text-sm font-bold orbitron text-slate-400 mb-4 uppercase tracking-widest">Entry History</h4>
                <div className="bg-black/30 rounded border border-slate-800 max-h-48 overflow-y-auto roster-scrollbar">
                  <table className="w-full text-left text-[10px]">
                    <thead className="sticky top-0 bg-slate-900 text-slate-600 font-black">
                      <tr><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2 text-right">Action</th></tr>
                    </thead>
                    <tbody>
                      {(selectedEmployee.history || []).map((h, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="p-2 text-slate-300">{h.date}</td>
                          <td className="p-2 text-slate-400">{h.type}</td>
                          <td className="p-2 text-right"><button onClick={() => deleteEmployeeRecord(selectedEmployee.id, i)} className="text-red-600 hover:text-red-400 font-bold px-1">REMOVE</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 orbitron font-bold">Transaction Date</label>
                <input type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 orbitron font-bold">Reason/Remarks</label>
                <input type="text" value={recordReason} onChange={(e) => setRecordReason(e.target.value)} placeholder="Reason..." className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white" />
              </div>
            </div>
            {recordType === 'C-Off' && (
              <div className="flex space-x-4">
                <button onClick={() => setCOffSubtype('Earned')} className={`flex-1 py-2 rounded text-xs font-bold border ${cOffSubtype === 'Earned' ? 'bg-green-700 text-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}>EARNED (+)</button>
                <button onClick={() => setCOffSubtype('Taken')} className={`flex-1 py-2 rounded text-xs font-bold border ${cOffSubtype === 'Taken' ? 'bg-red-700 text-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}>TAKEN (-)</button>
              </div>
            )}
            <button onClick={saveEmployeeRecord} className="w-full py-4 bg-blue-700 text-white font-black orbitron rounded shadow-xl border border-blue-400 hover:bg-blue-600 transition-all">COMMIT RECORD</button>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-inner">
        <h3 className="text-slate-500 text-xs font-bold orbitron mb-4 uppercase">System Console Log</h3>
        <div className="font-mono text-[10px] text-green-500 space-y-1">
          <p>{'>'} Master Roster Controller Initialized</p>
          <p>{'>'} Sync Status: Cloud (Firebase) Real-time (Ver 2.0.0)</p>
          <p>{'>'} Security: Industrial standard Aes-256</p>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
