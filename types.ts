
export interface Employee {
  id: string;
  name: string;
  phone: string;
  totalLeaves: number;
  cOffBalance: number;
  history: HistoryEntry[];
  schedules?: Record<string, string[]>; // Keyed by "YYYY-M" (e.g., "2026-0" for Jan)
  role?: 'INCHARGE' | 'SUPERVISOR' | 'OPERATOR';
}

export interface HistoryEntry {
  date: string;
  type: 'Leave' | 'C-Off Earned' | 'C-Off Taken';
  reason: string;
}

export interface LeaveRequest {
  id: string;
  empId: string;
  empName: string;
  type: 'Leave' | 'C-Off';
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemark?: string;
  timestamp: number;
}

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

export type DailyShifts = Record<string, Shifts>;

export enum Page {
  Schedule = 'Schedule',
  Production = 'Production',
  Labour = 'Labour',
  Admin = 'Admin',
  Login = 'Login'
}

export enum AdminPageType {
  Schedule = 'Master Schedule',
  Roster = 'Daily Roster',
  Notification = 'System Notification',
  Leave = 'Leave Management',
  Requests = 'Leave Requests'
}

export interface NotificationConfig {
  id: string;
  text: string;
  // Styling
  font: string;
  size: string;
  // Animation
  duration: number; // in seconds
  pause: number; // in seconds
}
