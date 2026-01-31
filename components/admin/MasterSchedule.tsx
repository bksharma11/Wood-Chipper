import React, { useState, useEffect, useCallback } from 'react';
import { Employee } from '../../types';
import { db } from '../../firebase';
import { ref, set, remove } from 'firebase/database';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import { handleFirebaseError } from '../../utils';

interface MasterScheduleProps {
  employees: Employee[];
  rosterMonth: number;
  rosterYear: number;
}

const MasterSchedule: React.FC<MasterScheduleProps> = ({ employees, rosterMonth, rosterYear }) => {
  const [isScheduleEditing, setIsScheduleEditing] = useState(false);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);

  // Edit Modal State
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmpId, setEditEmpId] = useState('');

  const scheduleKey = `${rosterYear}-${rosterMonth}`;

  useEffect(() => {
    // Only verify local matches remote if not actively editing cells
    // Logic kept simple: sync when not editing, else rely on local state until save
    if (!isScheduleEditing && employees) {
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

  const handlePaste = (e: React.ClipboardEvent, startEmpIdx: number, startDayIdx: number) => {
    e.preventDefault();
    if (!isScheduleEditing) return;

    const clipboardData = e.clipboardData.getData('Text');
    const rows = clipboardData.split(/\r?\n/).filter(r => r.length > 0);

    setLocalEmployees(prev => {
      const updated = [...prev]; // Shallow copy of array

      rows.forEach((row, rIdx) => {
        const targetEmpIdx = startEmpIdx + rIdx;

        // Safety check: ensure employee exists
        if (targetEmpIdx >= updated.length) return;

        const cells = row.split('\t');

        // Deep copy the specific employee we are modifying
        updated[targetEmpIdx] = { ...updated[targetEmpIdx] };

        // Ensure schedules object exists
        const schedules = { ...(updated[targetEmpIdx].schedules || {}) };
        const currentMonthSchedule = [...(schedules[scheduleKey] || Array(31).fill('-'))];

        cells.forEach((cellData, cIdx) => {
          const targetDayIdx = startDayIdx + cIdx;

          // Safety check: ensure day is within current month range
          if (targetDayIdx >= daysInMonth) return;

          const cleaned = cellData.trim().toUpperCase();
          const char = cleaned.length > 0 ? cleaned.slice(-1) : '-';

          currentMonthSchedule[targetDayIdx] = char;
        });

        updated[targetEmpIdx].schedules = { ...schedules, [scheduleKey]: currentMonthSchedule };
      });

      return updated;
    });
  };

  const saveMasterSchedule = () => {
    set(ref(db, 'employees'), localEmployees)
      .then(() => {
        alert(`Master Schedule and Employee Data Committed Successfully!`);
        setIsScheduleEditing(false);
      })
      .catch(handleFirebaseError);
  };

  // --- CRUD Operations ---

  const handleDeleteEmployee = (empId: string, name: string) => {
    if (confirm(`Are you sure you want to PERMANENTLY DELETE employee "${name}"?\nThis action cannot be undone.`)) {
      // Find the index in the array to construct the path 'employees/INDEX' is risky if array shifts. 
      // Best practice: Assuming 'employees' is an array in DB.
      // We need to find the correct index in the *source* employees array to delete correctly from Firebase array.
      // BUT, since we are fetching the whole array, we can just filter locally and SAVE the whole array.

      const updatedList = localEmployees.filter(e => e.id !== empId);
      set(ref(db, 'employees'), updatedList)
        .then(() => alert(`${name} deleted.`))
        .catch(handleFirebaseError);
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditName(employee.name);
    setEditEmpId(employee.id);
  };

  const saveEmployeeEdit = () => {
    if (!editingEmployee) return;

    // Update in the local list then save to DB (Full Sync strategy for array)
    const updatedList = localEmployees.map(e => {
      if (e.id === editingEmployee.id) {
        return { ...e, name: editName, id: editEmpId }; // ID update might be tricky if used as key elsewhere, but here it's just a field
      }
      return e;
    });

    set(ref(db, 'employees'), updatedList)
      .then(() => {
        setEditingEmployee(null);
        // alert("Employee Updated");
      })
      .catch(handleFirebaseError);
  };

  const updateMonth = (val: number) => set(ref(db, 'rosterMonth'), val).catch(handleFirebaseError);
  const updateYear = (val: number) => set(ref(db, 'rosterYear'), val).catch(handleFirebaseError);



  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold orbitron text-slate-200 uppercase">Master Schedule Editor</h2>
        </div>
        <div className="flex items-center gap-4">
          <select value={rosterMonth} onChange={(e) => updateMonth(parseInt(e.target.value))} className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 orbitron outline-none">
            {monthsFull.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={rosterYear} onChange={(e) => updateYear(parseInt(e.target.value))} className="bg-slate-900/50 border border-slate-700 p-2 rounded text-xs text-slate-300 orbitron outline-none">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white shadow-lg">
        <table className="w-full text-xs border-collapse text-black">
          <thead>
            <tr className="bg-slate-100 text-black font-black uppercase tracking-wider text-sm">
              <th className="p-2 border-2 border-slate-300 text-center">S.N</th>
              <th className="p-2 border-2 border-slate-300 text-left">Employee Name</th>
              <th className="p-2 border-2 border-slate-300 text-center w-24">Actions</th>
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
          <tbody>
            {(() => {
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
                return localEmployees
                  .filter(e => namesList.includes(e.name.trim())) // Match by Name with trim
                  .sort((a, b) => namesList.indexOf(a.name.trim()) - namesList.indexOf(b.name.trim())); // Value Order
              };

              const groupOperators = getGroupByName(operatorNames);
              const groupGeneralOperators = getGroupByName(generalOpNames);
              const groupSupervisors = getGroupByName(supervisorNames);
              const groupIncharge = getGroupByName(inchargeNames);

              const groupOthers = localEmployees
                .filter(e => !allDefinedNames.includes(e.name.trim()))
                .sort((a, b) => parseInt(a.id) - parseInt(b.id));

              // We render manually to control S.N resets
              const renderAdminSection = (title: string, group: Employee[], startSn: number) => {
                if (group.length === 0) return null;
                let localSn = startSn;

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

                    {/* Employees */}
                    {group.map((emp) => {
                      const schedule = emp.schedules?.[scheduleKey] || Array(31).fill('-');
                      localSn++;
                      return (
                        <tr key={emp.id} className="border-b-2 border-slate-300 hover:bg-slate-50 transition-colors group text-xs">
                          <td className="p-1 border-r-2 border-slate-300 text-center font-black text-slate-700">{localSn}</td>
                          <td className="p-1 border-r-2 border-slate-300 min-w-[150px] font-extrabold text-slate-900">
                            {emp.name}
                            <span className="block text-[10px] text-slate-600 font-mono font-bold">{emp.id}</span>
                          </td>
                          <td className="p-1 border-r-2 border-slate-300 text-center">
                            <div className="flex justify-center space-x-1">
                              <button
                                onClick={() => openEditModal(emp)}
                                className="p-1 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                title="Edit Details"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                title="Delete Employee"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                          {dayArray.map((day) => {
                            const val = schedule[day - 1] || '-';
                            const isRest = val === 'R';
                            return (
                              <td key={day} className={`p-0 border-r-2 border-slate-300 min-w-[32px] ${isRest ? 'bg-red-600' : ''}`}>
                                <input
                                  type="text"
                                  disabled={!isScheduleEditing}
                                  value={val}
                                  onFocus={(e) => isScheduleEditing && e.target.select()}
                                  onChange={(e) => updateMasterScheduleCell(localEmployees.findIndex(l => l.id === emp.id), day - 1, e.target.value)}
                                  onPaste={(e) => handlePaste(e, localEmployees.findIndex(l => l.id === emp.id), day - 1)}
                                  className={`w-full h-full bg-transparent text-center font-black text-xs ${isRest ? 'text-white' : 'text-slate-900'} focus:bg-blue-100 focus:text-blue-900 focus:outline-none uppercase ${!isScheduleEditing ? 'cursor-not-allowed select-none' : 'cursor-text bg-slate-50'}`}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {/* Gap */}
                    <tr className="h-6 bg-transparent border-none"><td colSpan={100}></td></tr>
                  </React.Fragment>
                );
              };

              return (
                <>
                  {renderAdminSection("Operators", groupOperators, 0)}
                  {/* General Operator continues S.N from Operators */}
                  {renderAdminSection("General operators", groupGeneralOperators, groupOperators.length)}

                  {/* Supervicor Restart S.N at 0 */}
                  {renderAdminSection("Supervisor", groupSupervisors, 0)}

                  {/* Incharge Restart S.N at 0 */}
                  {renderAdminSection("INCHARGE", groupIncharge, 0)}

                  {/* Others Restart S.N at 0 */}
                  {renderAdminSection("Others", groupOthers, 0)}

                  {/* Disclaimer Footer */}
                  <tr className="bg-white border-t-4 border-slate-900">
                    <td colSpan={100} className="p-3 text-center">
                      <span className="text-black font-black text-sm uppercase tracking-[0.2em]">
                        NOBODY CHANGE SHIFT AND REST WITHOUT PERMISSION
                      </span>
                    </td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex gap-4">
        <GlassButton
          variant={isScheduleEditing ? "secondary" : "ghost"}
          onClick={() => setIsScheduleEditing(!isScheduleEditing)}
          className={`flex-1 ${isScheduleEditing ? 'border-amber-500/50 text-amber-300' : ''}`}
        >
          {isScheduleEditing ? '🔒 EXIT EDIT MODE' : '✏️ EDIT SCHEDULE ROSTER'}
        </GlassButton>

        {isScheduleEditing && (
          <GlassButton
            variant="success"
            onClick={saveMasterSchedule}
            className="flex-1"
          >
            SAVE SCHEDULE CHANGES
          </GlassButton>
        )}

      </div>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <GlassCard className="w-full max-w-md border-cyan-500/50">
            <h3 className="text-xl font-bold orbitron text-white mb-6 uppercase">Edit Employee Details</h3>

            <div className="space-y-4">
              <GlassInput
                label="Employee Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <GlassInput
                label="Employee ID"
                value={editEmpId}
                onChange={(e) => setEditEmpId(e.target.value)}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <GlassButton variant="ghost" onClick={() => setEditingEmployee(null)} className="flex-1">
                Cancel
              </GlassButton>
              <GlassButton variant="primary" onClick={saveEmployeeEdit} className="flex-1">
                Save Changes
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

    </GlassCard>
  );
};

export default MasterSchedule;
