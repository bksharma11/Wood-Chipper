
export interface Employee {
  id: string;
  name: string;
  totalLeaves: number;
  cOffBalance: number;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  date: string;
  type: 'Leave' | 'C-Off Earned' | 'C-Off Taken';
  reason: string;
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

export interface ProductionLog {
  id: string;
  date: string;
  chipper1Start: string;
  chipper1Stop: string;
  chipper2Start: string;
  chipper2Stop: string;
  avgWoodCut: number;
  bunker1: number;
  bunker2: number;
  supervisor: string;
}

export interface LabourEntry {
  name: string;
  inTime: string;
  outTime: string;
  reason: string;
  specifyOther?: string;
}

export enum Page {
  Schedule = 'Schedule',
  Production = 'Production',
  Labour = 'Labour',
  Admin = 'Admin'
}
