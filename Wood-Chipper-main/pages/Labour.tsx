import React, { useState } from 'react';
import { LabourEntry, Employee } from '../types';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import GlassSelect from '../components/ui/GlassSelect';
import GlassButton from '../components/ui/GlassButton';

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

  const shiftOptions = [
    { label: 'Day Shift', value: 'Day' },
    { label: 'Night Shift', value: 'Night' }
  ];

  const reasonOptions = [
    { label: 'Full Day', value: 'Full Day' },
    { label: 'Half Day', value: 'Half Day' },
    { label: 'Gate Pass', value: 'Gate Pass' },
    { label: 'Other', value: 'Other' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black orbitron text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Labour <span className="text-yellow-400">Management</span>
        </h1>
      </div>

      <GlassCard className="border-yellow-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassInput
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <GlassSelect
            label="Shift Selection"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            options={shiftOptions}
          />
          <GlassInput
            label="Contractor / Agency"
            placeholder="e.g. Sharma Logistics"
            value={contractor}
            onChange={(e) => setContractor(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950/30">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                <th className="p-4 text-left">Worker Name</th>
                <th className="p-4 text-left w-32">In Time</th>
                <th className="p-4 text-left w-32">Out Time</th>
                <th className="p-4 text-left w-48">Attendance Type</th>
                <th className="p-4 text-center w-16">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {labourList.map((row, idx) => (
                <tr key={idx} className="hover:bg-yellow-500/5 transition-colors group">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateLabour(idx, 'name', e.target.value)}
                      placeholder="Enter Name..."
                      className="w-full bg-transparent p-2 text-slate-100 outline-none focus:bg-slate-800/50 rounded transition-colors placeholder-slate-600 font-medium"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={row.inTime}
                      onChange={(e) => updateLabour(idx, 'inTime', e.target.value)}
                      className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 w-full focus:border-yellow-500/50 outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={row.outTime}
                      onChange={(e) => updateLabour(idx, 'outTime', e.target.value)}
                      className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 w-full focus:border-yellow-500/50 outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <div className="space-y-2">
                      <select
                        value={row.reason}
                        onChange={(e) => updateLabour(idx, 'reason', e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 focus:border-yellow-500/50 outline-none"
                      >
                        {reasonOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
                    <button
                      onClick={() => removeRow(idx)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-xl leading-none">&times;</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <GlassButton
            onClick={addRow}
            variant="ghost"
            className="w-full border-dashed border-slate-700 text-slate-500 hover:text-yellow-400 hover:border-yellow-400/50"
          >
            + Add Worker Row
          </GlassButton>
        </div>
      </GlassCard>

      <GlassCard className="sticky bottom-4 z-40 bg-slate-900/90 backdrop-blur-xl border-t-4 border-t-yellow-500/30">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto min-w-[300px]">
            <GlassSelect
              label="Shift Supervisor Authorization"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              options={employees.map(e => ({ label: e.name, value: e.name }))}
            />
          </div>
          <GlassButton
            className="w-full sm:w-auto bg-yellow-600/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-600/30 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            size="lg"
            icon={<span>💾</span>}
          >
            Submit Labour Roster
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default LabourPage;
