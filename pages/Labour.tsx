
import React, { useState } from 'react';
import { LabourEntry, Employee } from '../types';
import NeonCard from '../components/NeonCard';

interface LabourPageProps {
  employees: Employee[];
}

const LabourPage: React.FC<LabourPageProps> = ({ employees }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('Day');
  const [contractor, setContractor] = useState('');
  const [labourList, setLabourList] = useState<LabourEntry[]>([
    { name: '', inTime: '08:00', outTime: '18:00', reason: 'Full Day' }
  ]);
  const [supervisor, setSupervisor] = useState(employees[0]?.name || '');

  const addRow = () => {
    setLabourList([...labourList, { name: '', inTime: '08:00', outTime: '18:00', reason: 'Full Day' }]);
  };

  const removeRow = (index: number) => {
    setLabourList(labourList.filter((_, i) => i !== index));
  };

  const updateLabour = (index: number, field: keyof LabourEntry, value: string) => {
    const newList = [...labourList];
    newList[index] = { ...newList[index], [field]: value };
    setLabourList(newList);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <NeonCard>
        <h2 className="text-2xl font-bold mb-6 orbitron text-slate-200">Labour Attendance Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-xs text-slate-400 mb-1 orbitron">DATE</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 orbitron">SHIFT</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-white">
              <option>Day</option>
              <option>Night</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 orbitron">CONTRACTOR NAME</label>
            <input type="text" value={contractor} onChange={(e) => setContractor(e.target.value)} placeholder="e.g. Sharma Logistics" className="w-full bg-slate-900/70 border border-slate-700 p-3 rounded text-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left w-32">In Time</th>
                <th className="p-3 text-left w-32">Out Time</th>
                <th className="p-3 text-left w-48">Reason</th>
                <th className="p-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody>
              {labourList.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-cyan-500/5 transition-colors">
                  <td className="p-2">
                    <input 
                      type="text" 
                      value={row.name} 
                      onChange={(e) => updateLabour(idx, 'name', e.target.value)}
                      placeholder="Labourer Name"
                      className="w-full bg-transparent p-1 text-slate-100 outline-none focus:bg-slate-800/50 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input type="time" value={row.inTime} onChange={(e) => updateLabour(idx, 'inTime', e.target.value)} className="bg-slate-900/50 border border-slate-700 p-1 rounded text-xs text-slate-300" />
                  </td>
                  <td className="p-2">
                    <input type="time" value={row.outTime} onChange={(e) => updateLabour(idx, 'outTime', e.target.value)} className="bg-slate-900/50 border border-slate-700 p-1 rounded text-xs text-slate-300" />
                  </td>
                  <td className="p-2">
                    <div className="space-y-2">
                      <select 
                        value={row.reason} 
                        onChange={(e) => updateLabour(idx, 'reason', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-1 rounded text-xs text-slate-300"
                      >
                        <option>Full Day</option>
                        <option>Half Day</option>
                        <option>Gate Pass</option>
                        <option>Other</option>
                      </select>
                      {row.reason === 'Other' && (
                        <input 
                          type="text" 
                          value={row.specifyOther || ''}
                          onChange={(e) => updateLabour(idx, 'specifyOther', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full bg-slate-800 border border-slate-700 p-1 text-xs rounded text-white italic"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={() => removeRow(idx)} className="text-red-500 hover:text-red-400 font-bold p-1 text-xl">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          onClick={addRow}
          className="mt-6 w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-500 font-bold hover:border-cyan-500/50 hover:text-cyan-400 transition-all uppercase text-xs orbitron"
        >
          + Add New Entry
        </button>
      </NeonCard>

      <NeonCard>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <label className="text-xs text-slate-400 orbitron uppercase">Supervisor Select:</label>
            <select 
              value={supervisor} 
              onChange={(e) => setSupervisor(e.target.value)}
              className="bg-slate-800 border border-slate-600 p-2 rounded text-slate-200"
            >
              {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
          <button className="w-full sm:w-auto py-4 px-12 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/40 font-black orbitron transition-all uppercase">
            SAVE LABOUR LIST
          </button>
        </div>
      </NeonCard>
    </div>
  );
};

export default LabourPage;
