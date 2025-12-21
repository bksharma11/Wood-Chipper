
export interface Employee {
  id: string;
  name: string;
  phone: string;
  totalLeaves: number;
  cOffBalance: number;
  history: HistoryEntry[];
  schedule?: string[]; // January 2026 pattern
}

export interface HistoryEntry {
  date: string;
  type: 'Leave' | 'C-Off Earned' | 'C-Off Taken';
  reason: string;
}

// Added missing LabourEntry interface
export interface LabourEntry {
  name: string;
  inTime: string;
  outTime: string;
  reason: string;
  specifyOther?: string;
}

export interface ShiftData {
  supervisor: string;
  chipper1: string;
  chipper2: string;
}

export interface Shifts {
  A: ShiftData;
  B: ShiftData;
  C: ShiftData;
  General: ShiftData;
}

export enum Page {
  Schedule = 'Schedule',
  Production = 'Production',
  Labour = 'Labour',
  Admin = 'Admin'
}
