import React from 'react';
import { Employee } from '../types';
import MasterSchedule from '../components/admin/MasterSchedule';
import GlassCard from '../components/ui/GlassCard';


interface ScheduleProps {
  employees: Employee[];
  rosterMonth: number;
  rosterYear: number;
  isAdmin: boolean;
}

const SchedulePage: React.FC<ScheduleProps> = ({ employees, rosterMonth, rosterYear, isAdmin }) => {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysInMonth = new Date(rosterYear, rosterMonth + 1, 0).getDate();
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const scheduleKey = `${rosterYear}-${rosterMonth}`;

  // Define specific names per the user's image requirements
  const operatorNames = [
    "Rohit Kumar-I", "Ravi Kumar", "Susheel Yadav", "Kamlesh Yadav",
    "Om Shankar Yadav", "Vijendra Singh", "Kulwant Singh"
  ];
  const generalOpNames = ["Yash Kumar", "Rohit Kumar-II", "Arvind Kumar"];
  const supervisorNames = ["Lakhvinder Singh", "Prateek Yadav", "Pradeep Shukla", "Amit Nagarale"];
  const inchargeNames = ["Bhupendra Kumar"];

  const allDefinedNames = [...operatorNames, ...generalOpNames, ...supervisorNames, ...inchargeNames];

  const getGroupByName = (namesList: string[]) => {
    return (employees || [])
      .filter(e => namesList.includes(e.name.trim())) // Match by Name with trim
      .sort((a, b) => namesList.indexOf(a.name.trim()) - namesList.indexOf(b.name.trim())); // Value Order
  };

  const groupOperators = getGroupByName(operatorNames);
  const groupGeneralOperators = getGroupByName(generalOpNames);
  const groupSupervisors = getGroupByName(supervisorNames);
  const groupIncharge = getGroupByName(inchargeNames);

  const groupOthers = (employees || [])
    .filter(e => !allDefinedNames.includes(e.name.trim()))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Sort others by ID traditionally

  const renderSection = (title: string, group: Employee[], startIndex: number) => {
    if (group.length === 0) return null;

    return (
      <React.Fragment key={title}>
        {/* Section Header */}
        <tr className="bg-slate-200 border-y-2 border-slate-300">
          <td colSpan={100} className="p-2 text-left">
            <span className="text-slate-900 font-black uppercase tracking-widest text-xs border-l-4 border-slate-900 pl-3">
              {title}
            </span>
          </td>
        </tr>

        {/* Employee Rows */}
        {group.map((emp, idx) => {
          const schedule = emp.schedules?.[scheduleKey] || Array(31).fill('-');
          return (
            <tr key={emp.id} className="border-b-2 border-slate-300 hover:bg-slate-50 transition-colors">
              <td className="p-1 border-r-2 border-slate-300 text-center font-black text-slate-800 text-xs">{startIndex + idx + 1}</td>
              <td className="p-1 border-r-2 border-slate-300 font-extrabold text-slate-900 whitespace-nowrap min-w-[180px] text-sm">{emp.name}</td>
              <td className="p-1 border-r-2 border-slate-300 font-mono font-bold text-xs text-slate-700">{emp.id}</td>
              {dayArray.map((day) => {
                const shift = schedule[day - 1] || '-';
                const isRest = shift === 'R';
                return (
                  <td key={day} className={`p-1 border-r-2 border-slate-300 text-center text-xs font-black min-w-[32px] ${isRest ? 'bg-red-600 text-white' : 'text-slate-900'}`}>
                    {shift}
                  </td>
                );
              })}
            </tr>
          );
        })}
        {/* Gap after section */}
        <tr className="h-6 bg-transparent border-none"><td colSpan={100}></td></tr>
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Admin Editor (Only visible if Admin) */}
      {isAdmin && (
        <div className="space-y-8">

          <MasterSchedule
            employees={employees}
            rosterMonth={rosterMonth}
            rosterYear={rosterYear}
          />
        </div>
      )}

      {/* Public Read-Only Master Table */}
      {!isAdmin && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
            <h2 className="text-xl font-black orbitron tracking-[0.3em] text-white uppercase flex items-center">
              <span className="mr-3 text-cyan-400">#</span>
              Master Roster
            </h2>
            <span className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded text-cyan-300 text-xs font-bold orbitron">
              {months[rosterMonth]} {rosterYear}
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin bg-white rounded-lg shadow-xl">
            <table className="w-full text-xs border-collapse text-black">
              <thead>
                <tr className="bg-slate-100 text-black font-black uppercase tracking-wider text-sm">
                  <th className="p-2 border-2 border-slate-300 text-center">S.N</th>
                  <th className="p-2 border-2 border-slate-300 text-left">Worker Name</th>
                  <th className="p-2 border-2 border-slate-300 text-left">ID</th>
                  {dayArray.map(d => {
                    const dateObj = new Date(rosterYear, rosterMonth, d);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
                    return (
                      <th key={d} className="p-1 border-2 border-slate-300 min-w-[32px] text-center bg-slate-50">
                        <div className="flex flex-col items-center leading-none py-1">
                          <span className="text-sm font-black">{d}</span>
                          <span className="text-[9px] text-slate-700 font-bold mt-0.5">{dayName}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white">
                {renderSection("Operators", groupOperators, 0)}
                {renderSection("General operators", groupGeneralOperators, groupOperators.length)}
                {renderSection("Supervisor", groupSupervisors, 0)}
                {renderSection("INCHARGE", groupIncharge, 0)}
                {renderSection("Others", groupOthers, 0)}

                {/* Disclaimer Footer */}
                <tr className="bg-white border-t-4 border-slate-900">
                  <td colSpan={100} className="p-3 text-center">
                    <span className="text-black font-black text-sm uppercase tracking-[0.2em]">
                      NOBODY CHANGE SHIFT AND REST WITHOUT PERMISSION
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default SchedulePage;
