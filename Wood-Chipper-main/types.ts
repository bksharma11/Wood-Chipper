
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

export interface ShiftSwapRequest {
  id: string;
  requestorId: string;
  requestorName: string;
  requestType: 'Mutual Swap' | 'unilateral';
  targetEmpId?: string; // If Mutual Swap
  targetEmpName?: string; // If Mutual Swap
  targetDate: string;
  currentShift: 'A' | 'B' | 'C' | 'G';
  desiredShift: 'A' | 'B' | 'C' | 'G';
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
  Dashboard = 'dashboard',
  Schedule = 'schedule',
  Production = 'production',
  Labour = 'labour',
  Admin = 'admin',
  Login = 'login'
}

export enum AdminPageType {
  Schedule = 'Master Schedule',
  Roster = 'Daily Roster',
  Notification = 'System Notification',
  Leave = 'Leave Management',
  Requests = 'Leave Requests',
  SwapRequests = 'Shift Swap Requests'
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
