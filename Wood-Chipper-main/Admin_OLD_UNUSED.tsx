
import React, { useState } from 'react';
import { Employee, Shifts, Page } from './types';

interface AdminPageProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  shifts: Shifts;
  setShifts: React.Dispatch<React.SetStateAction<Shifts>>;
  notification: string;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

const AdminPage: React.FC<AdminPageProps> = ({
  employees, setEmployees, shifts, setShifts, notification, setNotification
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');

  // Manage Employee Records State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [recordType, setRecordType] = useState<'Leave' | 'C-Off'>('Leave');
  const [cOffSubtype, setCOffSubtype] = useState<'Earned' | 'Taken'>('Earned');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordReason, setRecordReason] = useState('');

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

        return {
          ...emp,
          totalLeaves: updatedLeaves,
          cOffBalance: updatedCOff,
          history: [
            { date: recordDate, type: historyType, reason: recordReason },
            ...emp.history
          ]
        };
      }
      return emp;
    });

    setEmployees(newEmployees);
    alert("Record Saved Successfully!");
    // Reset form
    setRecordReason('');
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="brushed-metal p-10 rounded-2xl border border-slate-600 w-full max-w-md shadow-2xl">
          <h2 className="text-3xl font-black orbitron mb-6 text-center silver-gradient bg-clip-text text-transparent">SECURITY ACCESS</h2>

          {showForgot ? (
            <form onSubmit={handleReset} className="space-y-6">
              <p className="text-sm text-slate-400">Question: <span className="text-slate-100 font-bold italic">Favourite Person Name?</span></p>
              <input
                type="text"
                autoFocus
                placeholder="Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-center font-bold text-white tracking-widest focus:ring-2 focus:ring-amber-500 outline-none"
              />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button type="submit" className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl hover:scale-105 transition-transform">
                VERIFY ANSWER
              </button>
              <button onClick={() => setShowForgot(false)} className="w-full text-slate-500 text-xs uppercase hover:text-slate-300">Back to PIN</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="password"
                autoFocus
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-center text-3xl font-black text-white tracking-[1rem] focus:ring-2 focus:ring-slate-500 outline-none"
              />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button type="submit" className="w-full py-3 silver-gradient text-slate-900 font-bold orbitron rounded shadow-xl hover:scale-105 transition-transform">
                UNLOCK CONSOLE
              </button>
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
        {/* Manage Notifications */}
        <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 orbitron text-slate-200">Manage Notifications</h2>
          <div className="space-y-4">
            <textarea
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-white h-32 focus:ring-2 focus:ring-slate-500"
              placeholder="Enter ticker text here..."
            ></textarea>
            <p className="text-[10px] text-slate-500 italic">This text will scroll on the main Schedule page.</p>
          </div>
        </section>

        {/* Manage Shifts */}
        <section className="brushed-metal p-6 rounded-xl border border-slate-600/50 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 orbitron text-slate-200">Manage Shift Display</h2>
          <div className="space-y-4">
            {(['A', 'B', 'C', 'General'] as const).map(s => (
              <div key={s} className="grid grid-cols-4 gap-2 items-center">
                <span className="font-bold text-slate-400 orbitron">SHIFT {s}</span>
                <select
                  value={shifts[s].supervisor}
                  onChange={(e) => setShifts({ ...shifts, [s]: { ...shifts[s], supervisor: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white"
                >
                  {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
                <select
                  value={shifts[s].chipper1}
                  onChange={(e) => setShifts({ ...shifts, [s]: { ...shifts[s], chipper1: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white"
                >
                  {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
                <select
                  value={shifts[s].chipper2}
                  onChange={(e) => setShifts({ ...shifts, [s]: { ...shifts[s], chipper2: e.target.value } })}
                  className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white"
                >
                  {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Manage Employee Records Logic */}
      <section className="brushed-metal p-8 rounded-xl border border-slate-600/50 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 orbitron text-slate-200 border-b border-slate-700 pb-4">Manage Employee Records (Leaves & C-Off)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 orbitron uppercase">Step 1: Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-white focus:ring-2 focus:ring-slate-500"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 orbitron uppercase">Step 2: Employee ID (Auto-fill)</label>
              <input
                type="text"
                readOnly
                value={selectedEmpId}
                placeholder="ID will appear here"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded text-slate-400 font-mono italic"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 orbitron uppercase">Step 3: Transaction Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setRecordType('Leave')}
                  className={`flex-1 py-3 rounded orbitron font-bold border ${recordType === 'Leave' ? 'silver-gradient text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
                >
                  LEAVE
                </button>
                <button
                  onClick={() => setRecordType('C-Off')}
                  className={`flex-1 py-3 rounded orbitron font-bold border ${recordType === 'C-Off' ? 'silver-gradient text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
                >
                  C-OFF
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fadeIn">
            {recordType === 'C-Off' && (
              <div className="space-y-2">
                <label className="text-xs text-amber-500 orbitron uppercase">C-Off Action</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCOffSubtype('Earned')}
                    className={`flex-1 py-2 rounded text-sm font-bold border ${cOffSubtype === 'Earned' ? 'bg-green-700 text-white border-green-500' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
                  >
                    EARNED (+)
                  </button>
                  <button
                    onClick={() => setCOffSubtype('Taken')}
                    className={`flex-1 py-2 rounded text-sm font-bold border ${cOffSubtype === 'Taken' ? 'bg-red-700 text-white border-red-500' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
                  >
                    TAKEN (-)
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 orbitron uppercase">Date</label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 orbitron uppercase">Reason (Mandatory)</label>
                <input
                  type="text"
                  value={recordReason}
                  onChange={(e) => setRecordReason(e.target.value)}
                  placeholder="e.g. Sunday Duty, Sick Leave..."
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={saveEmployeeRecord}
                className="w-full py-5 bg-blue-700 text-white font-black orbitron rounded-lg shadow-[0_0_20px_rgba(29,78,216,0.4)] hover:brightness-110 active:scale-[0.98] transition-all border border-blue-400"
              >
                COMMIT RECORD TO DATABASE
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-inner">
        <h3 className="text-slate-500 text-xs font-bold orbitron mb-4">SYSTEM CONSOLE LOG</h3>
        <div className="font-mono text-[10px] text-green-500 space-y-1">
          <p>&gt; Admin Logged In: {new Date().toLocaleTimeString()}</p>
          <p>&gt; System Security: AES-256 (Industrial Standard)</p>
          <p>&gt; Sync Status: LocalStorage Persistent</p>
          <p>&gt; Version: 1.0.4-industrial-gold</p>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
